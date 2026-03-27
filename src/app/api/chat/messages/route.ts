import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";
import {
  openai,
  isOpenAIConfigured,
  getMockResponse,
  getMockCorrections,
  buildSystemPrompt,
} from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const userId = getDefaultUserId();
    const body = await req.json();
    const { conversationId, content } = body;

    if (!conversationId || !content?.trim()) {
      return NextResponse.json(
        { error: "conversationId and content are required" },
        { status: 400 }
      );
    }

    const conversation = await prisma.chatConversation.findFirst({
      where: { id: conversationId, userId },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    const mockCorrections = getMockCorrections(content);

    const userMessage = await prisma.chatMessage.create({
      data: {
        conversationId,
        role: "user",
        content,
        correctedContent: mockCorrections?.correctedContent ?? null,
        corrections: mockCorrections
          ? JSON.stringify(mockCorrections.corrections)
          : null,
      },
    });

    if (isOpenAIConfigured()) {
      try {
        const messages = conversation.messages.map((m) => ({
          role: m.role as "system" | "user" | "assistant",
          content: m.content,
        }));
        messages.push({ role: "user", content });

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            try {
              let fullContent = "";

              const correctionPromise = getAICorrections(content, messages);

              const completion = await openai.chat.completions.create({
                model: "gpt-4o",
                messages,
                stream: true,
                max_tokens: 300,
              });

              for await (const chunk of completion) {
                const delta = chunk.choices[0]?.delta?.content;
                if (delta) {
                  fullContent += delta;
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({ type: "delta", content: delta })}\n\n`
                    )
                  );
                }
              }

              const assistantMessage = await prisma.chatMessage.create({
                data: {
                  conversationId,
                  role: "assistant",
                  content: fullContent,
                },
              });

              const corrections = await correctionPromise;
              if (corrections) {
                await prisma.chatMessage.update({
                  where: { id: userMessage.id },
                  data: {
                    correctedContent: corrections.correctedContent,
                    corrections: JSON.stringify(corrections.corrections),
                  },
                });
              }

              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    type: "done",
                    assistantMessage,
                    userMessage: {
                      ...userMessage,
                      correctedContent:
                        corrections?.correctedContent ??
                        userMessage.correctedContent,
                      corrections: corrections
                        ? JSON.stringify(corrections.corrections)
                        : userMessage.corrections,
                    },
                  })}\n\n`
                )
              );
              controller.close();
            } catch (err) {
              console.error("Streaming error:", err);
              const fallback = getMockResponse(conversation.scenario);
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: "delta", content: fallback })}\n\n`
                )
              );
              const assistantMessage = await prisma.chatMessage.create({
                data: { conversationId, role: "assistant", content: fallback },
              });
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    type: "done",
                    assistantMessage,
                    userMessage,
                  })}\n\n`
                )
              );
              controller.close();
            }
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        });
      } catch {
        // Fall through to mock mode
      }
    }

    // Mock mode: simulate streaming with delayed response
    const mockResponse = getMockResponse(conversation.scenario);
    const words = mockResponse.split(" ");
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        for (let i = 0; i < words.length; i++) {
          const word = (i > 0 ? " " : "") + words[i];
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "delta", content: word })}\n\n`
            )
          );
          await new Promise((r) => setTimeout(r, 80 + Math.random() * 120));
        }

        const assistantMessage = await prisma.chatMessage.create({
          data: {
            conversationId,
            role: "assistant",
            content: mockResponse,
          },
        });

        await prisma.chatConversation.update({
          where: { id: conversationId },
          data: { updatedAt: new Date() },
        });

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "done",
              assistantMessage,
              userMessage,
            })}\n\n`
          )
        );
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Failed to send message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

async function getAICorrections(
  userContent: string,
  _conversationMessages: Array<{ role: string; content: string }>
) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an English grammar correction assistant. Analyze the user's message for grammar, spelling, and punctuation errors. Return a JSON object with:
- "correctedContent": the fully corrected version of the text
- "corrections": an array of objects, each with "original" (the incorrect text), "corrected" (the fix), and "explanation" (brief explanation)
If the text is correct, return null.
Only return valid JSON, no markdown.`,
        },
        { role: "user", content: userContent },
      ],
      max_tokens: 300,
    });

    const text = response.choices[0]?.message?.content?.trim();
    if (!text || text === "null") return null;

    const parsed = JSON.parse(text);
    if (!parsed || !parsed.corrections?.length) return null;

    return parsed as {
      correctedContent: string;
      corrections: Array<{
        original: string;
        corrected: string;
        explanation: string;
      }>;
    };
  } catch {
    return getMockCorrections(userContent);
  }
}
