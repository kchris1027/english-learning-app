import { NextResponse } from "next/server";
import { compareSentences } from "@/lib/dictation-diff";

export async function POST(request: Request) {
  const body = await request.json();
  const { userInput, reference } = body as {
    userInput: string;
    reference: string;
  };

  if (typeof userInput !== "string" || typeof reference !== "string") {
    return NextResponse.json(
      { error: "userInput and reference are required strings" },
      { status: 400 }
    );
  }

  const result = compareSentences(userInput, reference);
  return NextResponse.json(result);
}
