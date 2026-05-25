"use server";

import { generateObject } from "ai";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { aiModel } from "@/lib/ai";
import { prisma } from "@/lib/prisma";
import { FeedbackSchema, SubmitAnswerSchema } from "@/lib/validations";

export type SubmitAnswerState = {
  error?: string;
  attemptId?: string;
};

export async function submitAnswerAction(
  _prevState: SubmitAnswerState,
  formData: FormData
): Promise<SubmitAnswerState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const parsed = SubmitAnswerSchema.safeParse({
    questionId: formData.get("questionId"),
    content: formData.get("content"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { questionId, content } = parsed.data;

  const question = await prisma.question.findUnique({
    where: { id: questionId },
  });
  if (!question) {
    return { error: "Question not found" };
  }

  const attempt = await prisma.attempt.create({
    data: {
      userId: session.user.id,
      questionId,
      content,
      feedbackStatus: "PENDING",
    },
  });

  revalidatePath("/history");
  revalidatePath("/dashboard");

  return { attemptId: attempt.id };
}

export async function generateFeedbackAction(attemptId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId, userId: session.user.id },
    include: { question: true },
  });

  if (!attempt) {
    return { error: "Attempt not found" };
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

    revalidatePath(`/practice/${attempt.questionId}`);
    revalidatePath("/history");
    revalidatePath("/dashboard");

    return { attempt: updated };
  } catch (err) {
    console.error("[generateFeedbackAction] AI generation failed:", err);
    await prisma.attempt.update({
      where: { id: attemptId },
      data: { feedbackStatus: "FAILED" },
    });
    const message =
      err instanceof Error ? err.message : "AI feedback failed";
    return { error: `AI feedback failed: ${message}` };
  }
}

export async function getAttemptAction(attemptId: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.attempt.findUnique({
    where: { id: attemptId, userId: session.user.id },
    include: {
      question: {
        select: { title: true, domain: true, difficulty: true },
      },
    },
  });
}
