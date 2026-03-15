import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const counter = await prisma.laylatCounter.findFirst({
    where: { mosque: "alihssani" },
  });

  if (!counter) {
    return NextResponse.json(
      { error: "Counter not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    amount: counter.amount ?? 145500,
    target: counter.target ?? 301400,
  });
}