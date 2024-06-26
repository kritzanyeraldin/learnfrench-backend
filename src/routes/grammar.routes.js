import { Router } from "express";
import { prisma } from "../db.js";
import { z } from "zod";
import { parseStringToInteger } from "../../utils/parseStringToInteger.js";
import { groqService } from "../services/index.js";

const router = Router();

const grammarsSchema = z.object({
  G1: z.object({
    name: z.string(),
    content: z.string(),
  }),
  G2: z.object({
    name: z.string(),
    content: z.string(),
  }),
  G3: z.object({
    name: z.string(),
    content: z.string(),
  }),
  G4: z.object({
    name: z.string(),
    content: z.string(),
  }),
  G5: z.object({
    name: z.string(),
    content: z.string(),
  }),
});

router.get("/grammar-content", async (req, res) => {
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
        let content = await groqService.generateGrammar();
        if (!content) throw new Error("No se pudo generar la gramatica");

        console.log({
          content,
        });
        const contentAsJson = JSON.parse(content);
        validContent = grammarsSchema.parse(contentAsJson);
      } catch (error) {
        console.log(error);
        tries--;
      }
    }

    if (!validContent) return res.json("No se pudo generar el contenido");

    const rawData = Object.values(validContent).map((grammar) => ({
      name: grammar.name,
      content: grammar.content,
    }));

    await prisma.grammar.createMany({
      data: rawData,
    });

    return res.json(validContent);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error" });
  }
});

router.get("/all-grammars", async (req, res) => {
  try {
    const allGrammars = await prisma.grammar.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return res.json(
      //   Object.fromEntries(allGrammars.map((g) => [g.id, g.name, g.content]))
      allGrammars
    );
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
});

export default router;
