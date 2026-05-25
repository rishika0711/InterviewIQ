import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_AI_API_KEY ?? "",
});

// Allow overriding via env (e.g. GOOGLE_AI_MODEL=gemini-flash-latest).
// gemini-1.5-* models were retired; gemini-2.5-flash is the current stable Flash model.
const modelId = process.env.GOOGLE_AI_MODEL ?? "gemini-2.5-flash";

export const aiModel = google(modelId);
