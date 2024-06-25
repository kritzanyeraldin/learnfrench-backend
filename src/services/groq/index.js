import Groq from "groq-sdk";
import { keys } from "../../config/index.js";

export const groq = new Groq({ apiKey: keys.GROQ_API_KEY });

export * from "./getChatCompletion.js";
export * from "./generateCompleteQuestion.js";
export * from "./generateThemesLevels.js";
export * from "./generateQ.js";
