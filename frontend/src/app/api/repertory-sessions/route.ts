import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const payload = getUserFromRequest(req);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const sessions = await prisma.repertorySession.findMany({
      where: { userId: payload.userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true, name: true, selections: true, aggregated: true,
        createdAt: true, updatedAt: true,
      },
    });
    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("List repertory sessions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const payload = getUserFromRequest(req);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, selections, aggregated } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const session = await prisma.repertorySession.create({
      data: {
        name: name.trim(),
        userId: payload.userId,
        selections: selections || [],
        aggregated: aggregated || [],
      },
    });

    return NextResponse.json({ session }, { status: 201 });
  } catch (error) {
    console.error("Create repertory session error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
