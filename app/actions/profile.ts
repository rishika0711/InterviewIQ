"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import {
  DATABASE_UNAVAILABLE_MESSAGE,
  isMongoConnectivityFailure,
} from "@/lib/db-errors";
import { prisma } from "@/lib/prisma";
import { ProfileUpdateSchema } from "@/lib/validations";

export type ProfileUpdateState = {
  error?: string;
  success?: boolean;
};

export async function updateProfileAction(
  _prevState: ProfileUpdateState,
  formData: FormData
): Promise<ProfileUpdateState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const parsed = ProfileUpdateSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { name } = parsed.data;

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
    });
  } catch (e) {
    if (isMongoConnectivityFailure(e)) {
      return { error: DATABASE_UNAVAILABLE_MESSAGE };
    }
    throw e;
  }

  revalidatePath("/profile");
  return { success: true };
}
