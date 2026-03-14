import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { amount, target } = await req.json();

  if (typeof amount !== "number") {
    return NextResponse.json(
      { error: "Invalid amount" },
      { status: 400 }
    );
  }

  const existing = await prisma.laylatCounter.findFirst({
    where: { mosque: "alihssani" },
  });

  if (!existing) {
    await prisma.laylatCounter.create({
      data: {
        mosque: "alihssani",
        amount,
        target: target ?? 301400,
      },
    });
  } else {
    await prisma.laylatCounter.update({
      where: { id: existing.id },
      data: {
        amount,
        target: target ?? existing.target,
      },
    });
  }

  return NextResponse.json({ success: true });
}
