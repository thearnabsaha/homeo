import { NextRequest, NextResponse } from "next/server";
import { neoChatWithAI } from "../lib/groqNeo";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, language } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const result = await neoChatWithAI(message.trim(), language || "bn");
    return NextResponse.json(result);
  } catch (error) {
    console.error("neo chat error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
