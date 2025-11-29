// lib/gemini.ts
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in the environment");
}

// Single shared client for the whole app
export const ai = new GoogleGenAI({
  apiKey,
});
