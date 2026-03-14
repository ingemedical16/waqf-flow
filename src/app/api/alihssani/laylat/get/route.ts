import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const counter = await prisma.laylatCounter.findFirst({
    where: { mosque: "alihssani" },
  });

  return NextResponse.json({
    amount: counter?.amount ?? 141500,
    target: counter?.target ?? 301400,
  });
}
