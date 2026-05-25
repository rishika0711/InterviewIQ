import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SubmitAnswerSchema } from "@/lib/validations";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
  const limit = 20;

  const attempts = await prisma.attempt.findMany({
    where: { userId: session.user.id },
    include: {
      question: {
        select: { title: true, domain: true, difficulty: true },
      },
    },
    orderBy: { submittedAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  return NextResponse.json(attempts);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = SubmitAnswerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { questionId, content } = parsed.data;

  const attempt = await prisma.attempt.create({
    data: {
      userId: session.user.id,
      questionId,
      content,
      feedbackStatus: "PENDING",
    },
  });

  return NextResponse.json(attempt, { status: 201 });
}
