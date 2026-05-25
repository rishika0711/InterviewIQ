import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { aiModel } from "@/lib/ai";
import { FeedbackSchema } from "@/lib/validations";
import { generateObject } from "ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { attemptId } = await req.json();
  if (!attemptId) {
    return NextResponse.json({ error: "attemptId required" }, { status: 400 });
  }

  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId, userId: session.user.id },
    include: { question: true },
  });
  if (!attempt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.attempt.update({
    where: { id: attemptId },
    data: { feedbackStatus: "PROCESSING" },
  });

  try {
    const { object } = await generateObject({
      model: aiModel,
      schema: FeedbackSchema,
      prompt: `
        You are a senior software engineer conducting a technical interview.

        Question: "${attempt.question.title}"
        Details: "${attempt.question.description}"

        Candidate's Answer:
        "${attempt.content}"

        Evaluate objectively. Be specific and constructive. Provide:
        - score: 0–100 integer
        - strengths: 1–4 specific things they did well
        - weaknesses: 1–4 specific gaps or errors
        - suggestions: 2–3 sentences on how to improve
        - modelAnswer: a concise ideal answer (150–250 words)
      `,
    });

    const updated = await prisma.attempt.update({
      where: { id: attemptId },
      data: {
        aiScore: object.score,
        aiStrengths: object.strengths,
        aiWeaknesses: object.weaknesses,
        aiSuggestions: object.suggestions,
        aiModelAnswer: object.modelAnswer,
        feedbackStatus: "COMPLETED",
      },
    });

    return NextResponse.json(updated);
  } catch {
    await prisma.attempt.update({
      where: { id: attemptId },
      data: { feedbackStatus: "FAILED" },
    });
    return NextResponse.json({ error: "AI feedback failed" }, { status: 500 });
  }
}
