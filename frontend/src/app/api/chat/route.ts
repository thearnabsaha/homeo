import { NextRequest, NextResponse } from "next/server";
import { chatWithAI } from "../lib/groq";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, language } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      const bn = (language || "bn") === "bn";
      return NextResponse.json(
        { error: bn ? "একটি বার্তা প্রদান করুন" : "Please provide a message" },
        { status: 400 }
      );
    }

    const result = await chatWithAI(message.trim(), language || "bn");
    return NextResponse.json(result);
  } catch (error) {
    console.error("chat error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
