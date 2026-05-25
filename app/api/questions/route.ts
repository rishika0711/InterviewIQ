import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Domain, Difficulty } from "@/app/generated/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const domain = searchParams.get("domain") || undefined;
  const difficulty = searchParams.get("difficulty") || undefined;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 12;

  const where = {
    ...(domain && { domain: domain as Domain }),
    ...(difficulty && { difficulty: difficulty as Difficulty }),
  };

  const [questions, total] = await Promise.all([
    prisma.question.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        title: true,
        difficulty: true,
        domain: true,
        tags: true,
        _count: { select: { attempts: true } },
      },
    }),
    prisma.question.count({ where }),
  ]);

  return NextResponse.json({
    questions,
    total,
    pages: Math.ceil(total / limit),
  });
}
