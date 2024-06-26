import { groq } from "./index.js";
import { constants } from "../../config/index.js";

export const getChatCompletion = async (messages) => {
  const chatCompletion = await groq.chat.completions.create({
    response_format: {
      type: "json_object",
    },
    messages,
    model: constants.MODEL_NAME,
  });

  return chatCompletion.choices[0]?.message?.content;
};
