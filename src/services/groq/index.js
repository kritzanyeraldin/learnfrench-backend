import Groq from "groq-sdk";
import { keys } from "../../config/index.js";

export const groq = new Groq({ apiKey: keys.GROQ_API_KEY });

export * from "./getChatCompletion.js";
export * from "./generateCompleteOptionsQuestion.js";
export * from "./generateThemesSublevels.js";
export * from "./generateQualifingExam.js";
export * from "./generateCompleteTextQuestion.js";
export * from "./generateOrderSentenceQuestion.js";
export * from "./generateVoiceSentenceQuestion.js";
export * from "./generatedThemesSublevelsUser.js";
export * from "./generateGrammar.js";
export * from "./generateVocabulary.js";
