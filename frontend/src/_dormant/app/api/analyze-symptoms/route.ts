import { NextRequest, NextResponse } from "next/server";
import { analyzeSymptoms } from "../lib/groq";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { symptoms, language } = body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      const bn = (language || "bn") === "bn";
      return NextResponse.json(
        { error: bn ? "বিশ্লেষণের জন্য লক্ষণের তালিকা প্রদান করুন" : "Please provide an array of symptoms to analyze" },
        { status: 400 }
      );
    }

    const cleaned = symptoms.map((s: string) => String(s).trim()).filter(Boolean);
    if (cleaned.length === 0) {
      return NextResponse.json({ error: "No valid symptoms provided" }, { status: 400 });
    }
    if (cleaned.length > 20) {
      return NextResponse.json({ error: "Maximum 20 symptoms" }, { status: 400 });
    }

    const result = await analyzeSymptoms(cleaned, language || "bn");

    if (!result || (!result.analysis && !result.remedies?.length)) {
      const bn = (language || "bn") === "bn";
      return NextResponse.json({
        analysis: bn ? "নির্বাচিত লক্ষণগুলির উপর ভিত্তি করে বিশ্লেষণ।" : "Analysis based on selected symptoms.",
        remedies: [],
        precautions: bn ? "একজন যোগ্য হোমিওপ্যাথের সাথে পরামর্শ করুন।" : "Consult a qualified homeopath.",
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("analyze-symptoms error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
