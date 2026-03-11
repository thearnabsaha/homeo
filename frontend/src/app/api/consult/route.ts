import { NextRequest, NextResponse } from "next/server";
import { neoConsultWithAI } from "../lib/groqNeo";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { history, language } = body;

    if (!history || !Array.isArray(history) || history.length === 0) {
      const bn = (language || "bn") === "bn";
      return NextResponse.json(
        { error: bn ? "কথোপকথনের ইতিহাস প্রদান করুন" : "Please provide conversation history" },
        { status: 400 }
      );
    }

    if (history.length > 40) {
      return NextResponse.json(
        { error: "Conversation too long. Start a new consultation." },
        { status: 400 }
      );
    }

    const validHistory = history
      .filter((m: { role?: string; content?: string }) => m.role && m.content)
      .map((m: { role: string; content: string }) => ({ role: m.role, content: m.content }));

    const result = await neoConsultWithAI(validHistory, language || "bn");
    return NextResponse.json(result);
  } catch (error) {
    console.error("neo consult error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
