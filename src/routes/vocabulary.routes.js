import { Router } from "express";
import { prisma } from "../db.js";
import { z } from "zod";
import { parseStringToInteger } from "../../utils/parseStringToInteger.js";
import { groqService } from "../services/index.js";

const router = Router();

const vocabulariesSchema = z.object({
  V1: z.object({
    name: z.string(),
    content: z.string(),
  }),
  V2: z.object({
    name: z.string(),
    content: z.string(),
  }),
  V3: z.object({
    name: z.string(),
    content: z.string(),
  }),
  V4: z.object({
    name: z.string(),
    content: z.string(),
  }),
  V5: z.object({
    name: z.string(),
    content: z.string(),
  }),
});

router.get("/vocabulary-content", async (req, res) => {
  try {
    // let content = await groqService.generateGrammar();
    // const contentAsJson = JSON.parse(content);
    // validContent = contentAsJson;
    let validContent;
    let tries = 7;

    while (true) {
      try {
        if (tries === 0) break;
        if (validContent) break;
        console.log(tries);
        let content = await groqService.generateVocabulary();
        if (!content) throw new Error("No se pudo generar los vocabularios");

        console.log({
          content,
        });
        const contentAsJson = JSON.parse(content);
        validContent = vocabulariesSchema.parse(contentAsJson);
      } catch (error) {
        console.log(error);
        tries--;
      }
    }

    if (!validContent) return res.json("No se pudo generar el contenido");

    const rawData = Object.values(validContent).map((vocabulary) => ({
      name: vocabulary.name,
      content: vocabulary.content,
    }));

    await prisma.vocabulary.createMany({
      data: rawData,
    });

    return res.json(validContent);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error" });
  }
});

router.get("/all-vocabularies", async (req, res) => {
  try {
    const allVocabularies = await prisma.vocabulary.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return res.json(
      //   Object.fromEntries(allVocabularies.map((g) => [g.id, g.name, g.content]))
      allVocabularies
    );
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
});

export default router;
