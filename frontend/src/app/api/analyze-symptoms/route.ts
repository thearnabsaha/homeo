import { NextRequest, NextResponse } from "next/server";
import { neoAnalyzeSymptoms } from "../lib/groqNeo";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { symptoms, language } = body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return NextResponse.json({ error: "Symptoms array is required" }, { status: 400 });
    }

    if (symptoms.length > 20) {
      return NextResponse.json({ error: "Maximum 20 symptoms allowed" }, { status: 400 });
    }

    const result = await neoAnalyzeSymptoms(symptoms, language || "bn");
    return NextResponse.json(result);
  } catch (error) {
    console.error("neo analyze error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
