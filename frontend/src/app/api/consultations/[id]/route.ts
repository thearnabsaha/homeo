import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const payload = getUserFromRequest(req);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  try {
    const consultation = await prisma.consultation.findFirst({
      where: { id, userId: payload.userId },
    });
    if (!consultation) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ consultation });
  } catch (error) {
    console.error("Get consultation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const payload = getUserFromRequest(req);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  try {
    const existing = await prisma.consultation.findFirst({
      where: { id, userId: payload.userId },
    });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { name } = await req.json();
    const consultation = await prisma.consultation.update({
      where: { id },
      data: { ...(name ? { name: name.trim() } : {}) },
    });
    return NextResponse.json({ consultation });
  } catch (error) {
    console.error("Update consultation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const payload = getUserFromRequest(req);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  try {
    const existing = await prisma.consultation.findFirst({
      where: { id, userId: payload.userId },
    });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.consultation.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete consultation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
