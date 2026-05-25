import { config } from "dotenv";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

config({ path: ".env.local" });

const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_AI_API_KEY });

const models = [
  "gemini-1.5-flash",
  "gemini-2.0-flash",
  "gemini-2.5-flash",
  "gemini-flash-latest",
];

for (const m of models) {
  try {
    const { object } = await generateObject({
      model: google(m),
      schema: z.object({ score: z.number().min(0).max(100), msg: z.string() }),
      prompt: 'Return {score: 50, msg: "ok"}',
    });
    console.log("OK", m, JSON.stringify(object));
  } catch (e) {
    console.log("FAIL", m, "-", (e?.message || String(e)).slice(0, 250));
  }
}
