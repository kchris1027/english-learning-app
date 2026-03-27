import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";
import { SCENARIOS, type ScenarioKey, buildSystemPrompt } from "@/lib/openai";

export async function GET() {
  try {
    const userId = getDefaultUserId();

    const conversations = await prisma.chatConversation.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          where: { role: { not: "system" } },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        _count: { select: { messages: { where: { role: { not: "system" } } } } },
      },
    });

    const result = conversations.map((c) => ({
      id: c.id,
      title: c.title,
      scenario: c.scenario,
      level: c.level,
      lastMessage: c.messages[0]?.content ?? null,
      lastMessageRole: c.messages[0]?.role ?? null,
      messageCount: c._count.messages,
      updatedAt: c.updatedAt,
      createdAt: c.createdAt,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const userId = getDefaultUserId();
    const body = await req.json();
    const scenario: string | null = body.scenario ?? null;
    const level: string = body.level ?? "intermediate";

    const scenarioConfig = scenario
      ? SCENARIOS[scenario as ScenarioKey]
      : null;

    const title = scenarioConfig
      ? scenarioConfig.name
      : "Free Chat";

    const systemContent = buildSystemPrompt(scenario, level);

    const conversation = await prisma.chatConversation.create({
      data: {
        userId,
        title,
        scenario,
        level,
        messages: {
          create: {
            role: "system",
            content: systemContent,
          },
        },
      },
    });

    return NextResponse.json({ id: conversation.id, title: conversation.title });
  } catch (error) {
    console.error("Failed to create conversation:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}
