import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const payload = getUserFromRequest(req);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const consultations = await prisma.consultation.findMany({
      where: { userId: payload.userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true, name: true, complaints: true, cycles: true,
        recommendation: true, createdAt: true, updatedAt: true,
      },
    });
    return NextResponse.json({ consultations });
  } catch (error) {
    console.error("List consultations error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const payload = getUserFromRequest(req);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, complaints, cycles, recommendation } = await req.json();
    if (!name || !recommendation) {
      return NextResponse.json({ error: "Name and recommendation are required" }, { status: 400 });
    }

    const consultation = await prisma.consultation.create({
      data: {
        name: name.trim(),
        userId: payload.userId,
        complaints: complaints || [],
        cycles: cycles || [],
        recommendation,
      },
    });

    return NextResponse.json({ consultation }, { status: 201 });
  } catch (error) {
    console.error("Create consultation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
