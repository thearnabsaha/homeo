import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(
    { status: "ok", service: "RepertoryAI", timestamp: Date.now() },
    { headers: { "Cache-Control": "no-store" } }
  );
}
