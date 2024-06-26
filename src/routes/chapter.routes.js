import { Router } from "express";
import { prisma } from "../db.js";
import { z } from "zod";
import { parseStringToInteger } from "../../utils/parseStringToInteger.js";
import { groqService } from "../services/index.js";

const router = Router();

const chapterSchema = z.object({
  name: z.string(),
  userId: z.number().optional(),
  levelId: z.number(),
  sublevelId: z.number(),
});

const levelIdSchema = z.object({ id: parseStringToInteger() });
const userIdSchema = z.object({ id: parseStringToInteger() });
const chapterNameSchema = z.object({ name: z.string() });

router.get("/chapter-level/:id", async (req, res) => {
  try {
    const { error, data: params } = levelIdSchema.safeParse(req.params);
    if (error) {
      return res.status(404).json({
        message: "Bad payload",
        data: error.formErrors.fieldErrors,
      });
    }
    const chapter = await prisma.chapter.findUnique({
      where: {
        levelId: params.levelId,
      },
      include: {
        sublevel: true,
        Lesson: true,
      },
    });

    if (!chapter)
      return res.status(400).json({
        message: "chapter doesn't exists",
      });
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
});
router.get("/chapter/:chapter", async (req, res) => {
  try {
    const { error, data: params } = chapterNameSchema.safeParse(req.params);
    if (error) {
      return res.status(404).json({
        message: "Bad payload",
        data: error.formErrors.fieldErrors,
      });
    }
    const chapter = await prisma.chapter.findUnique({
      where: {
        name: params.name,
      },
      include: {
        level: true,
        sublevel: true,
        Lesson: true,
      },
    });

    if (!chapter)
      return res.status(400).json({
        message: "chapter doesn't exists",
      });
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
});

router.get("/new-chapter", async (req, res) => {
  try {
    // if (!req.body)
    //   return res.status(404).json({
    //     message: "Invalid payload",
    //   });

    // const { error, data: chapter } = chapterSchema.safeParse(req.body);

    const chaptersSublevels = await groqService.generateThemesSublevels();

    if (!chaptersSublevels) return "No se pudo generar los capitulos";

    console.log(chaptersSublevels);

    // if (error) {
    //   return res.status(404).json({
    //     message: "Bad payload",
    //     data: error.formErrors.fieldErrors,
    //   });
    // }
    // const foundChapter = await prisma.chapter.findUnique({
    //   where: {
    //     alias: chapter.alias,
    //   },
    // });

    // if (foundChapter)
    //   return res.status(400).json({
    //     message: "Email already exists",
    //   });

    // const newChapter = await prisma.chapter.create({
    //   data: chapter,
    // });
    // return res.json(newChapter);
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

router.get("/chapter-user/:id", async (req, res) => {
  try {
    const { error, data: params } = userIdSchema.safeParse(req.params);
    if (error) {
      return res.status(404).json({
        message: "Bad payload",
        data: error.formErrors.fieldErrors,
      });
    }

    const chapter = await prisma.chapter.findUnique({
      where: {
        userId: params.id,
      },
      include: {
        level: true,
        sublevel: true,
        Lesson: true,
      },
    });

    if (!chapter)
      return res.status(400).json({
        message: "chapter doesn't exists",
      });
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
});

export default router;
