import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2, "Name too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be 8+ characters"),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const SubmitAnswerSchema = z.object({
  questionId: z.string().min(1, "Invalid question ID"),
  content: z
    .string()
    .min(1, "Answer cannot be empty")
    .max(3000, "Answer too long"),
});

export const FeedbackSchema = z.object({
  score: z.number().min(0).max(100),
  strengths: z.array(z.string()).min(0).max(4),
  weaknesses: z.array(z.string()).min(0).max(4),
  suggestions: z.string(),
  modelAnswer: z.string(),
});

export const ProfileUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name is too long"),
});
