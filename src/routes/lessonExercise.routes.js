import { Router } from "express";
import { prisma } from "../db.js";
import { z } from "zod";
import { parseStringToInteger } from "../../utils/parseStringToInteger.js";
import { groqService } from "../services/index.js";

const router = Router();

const optionsQuestionSchema = z.object({
  OptionQuestion: z.object({
    type: z.string(),
    content: z.string(),
    options: z
      .array(
        z.object({
          content: z.string(),
          right: z.boolean(),
          feedback: z.string(),
        })
      )
      .length(3),
  }),
});

const withTextQuestionSchema = z.object({
  Textquestion: z.object({
    type: z.string(),
    content: z.string(),
    answer: z.string(),
    feedback: z.object({
      correcto: z.string(),
      incorrecto: z.string(),
    }),
  }),
});

const orderQuestionSchema = z.object({
  Orderquestion: z.object({
    type: z.string(),
    content: z.string(),
    answer: z.string(),
    feedback: z.string(),
  }),
});

const voiceQuestionSchema = z.object({
  Repeatquestion: z.object({
    type: z.string(),
    content: z.string(),
    feedback: z.string(),
  }),
});

router.get("/exercise-lesson/:lesson", async (req, res) => {
  try {
    let validOptionsQuestionContent;
    let validWithTextQuestionContent;
    let validOrderQuestionContent;
    let validVoiceQuestionContent;

    let tries = 7;
    const lessonName = req.params.lesson;
    while (true) {
      try {
        if (tries === 0) break;
        if (validOptionsQuestionContent && validWithTextQuestionContent) break;
        let [
          optionsQuestionContent,
          withtextQuestionContent,
          orderQuestionContent,
          voiceQuestionContent,
        ] = await Promise.all([
          groqService.generateCompleteOptionsQuestion(lessonName),
          groqService.generateCompleteTextQuestion(lessonName),
          groqService.generateOrderSentenceQuestion(lessonName),
          groqService.generateVoiceQuestion(lessonName),
        ]);

        if (
          !optionsQuestionContent &&
          !withtextQuestionContent &&
          !orderQuestionContent &&
          !voiceQuestionContent
        )
          throw new Error("No se pudo generar las preguntas");

        console.log({
          optionsQuestionContent,
          withtextQuestionContent,
          orderQuestionContent,
          voiceQuestionContent,
        });
        let contentAsJson = JSON.parse(optionsQuestionContent);
        validOptionsQuestionContent =
          optionsQuestionSchema.parse(contentAsJson);

        contentAsJson = JSON.parse(withtextQuestionContent);
        validWithTextQuestionContent =
          withTextQuestionSchema.parse(contentAsJson);

        contentAsJson = JSON.parse(orderQuestionContent);
        validOrderQuestionContent = orderQuestionSchema.parse(contentAsJson);

        contentAsJson = JSON.parse(voiceQuestionContent);
        validVoiceQuestionContent = voiceQuestionSchema.parse(contentAsJson);
      } catch (error) {
        console.log(error);
        tries--;
      }
    }

    const exercise = {
      complete_with_options: validOptionsQuestionContent,
      complete_with_text: validWithTextQuestionContent,
      order_sentence: validOrderQuestionContent,
      repeat_sentence: validVoiceQuestionContent,
    };

    return res.json(exercise);
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
});

export default router;
