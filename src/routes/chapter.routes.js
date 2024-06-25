import { Router } from "express";
import { prisma } from "../db.js";
import { z } from "zod";

const router = Router();

const chapterSchema = z.object({
  name: z.string(),
  userId: z.number().optional(),
  levelId: z.number(),
  sublevelId: z.number(),
});

const aliasSchema = z.object({ alias: z.string() });

router.get("/level-alias/:", async (req, res) => {
  try {
    const { error, data: params } = aliasSchema.safeParse(req.params);
    if (error) {
      return res.status(404).json({
        message: "Bad payload",
        data: error.formErrors.fieldErrors,
      });
    }
    const level = await prisma.level.findUnique({
      where: {
        alias: params.alias,
      },
    });

    if (!level)
      return res.status(400).json({
        message: "Level doesn't exists",
      });
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
});

router.post("/new-chapter", async (req, res) => {
  try {
    if (!req.body)
      return res.status(404).json({
        message: "Invalid payload",
      });

    const { error, data: chapter } = chapterSchema.safeParse(req.body);

    if (error) {
      return res.status(404).json({
        message: "Bad payload",
        data: error.formErrors.fieldErrors,
      });
    }
    const foundChapter = await prisma.chapter.findUnique({
      where: {
        alias: chapter.alias,
      },
    });

    if (foundChapter)
      return res.status(400).json({
        message: "Email already exists",
      });

    const newChapter = await prisma.chapter.create({
      data: chapter,
    });
    return res.json(newChapter);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error" });
  }
});

router.get("/all-chapters", async (req, res) => {
  try {
    const allChapters = await prisma.chapter.findMany();
    return res.json(allChapters);
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
});

export default router;
