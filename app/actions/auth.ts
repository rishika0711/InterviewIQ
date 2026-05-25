"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { DATABASE_UNAVAILABLE_MESSAGE, isMongoConnectivityFailure } from "@/lib/db-errors";
import { RegisterSchema } from "@/lib/validations";

export type ActionState = {
  error?: string;
  success?: boolean;
};

export async function registerUser(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = RegisterSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { name, email, password } = parsed.data;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { error: "An account with this email already exists" };
    }

    const hashed = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: { name, email, password: hashed },
    });

    return { success: true };
  } catch (e) {
    if (isMongoConnectivityFailure(e)) {
      return { error: DATABASE_UNAVAILABLE_MESSAGE };
    }
    throw e;
  }
}
