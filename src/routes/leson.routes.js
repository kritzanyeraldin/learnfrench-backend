import { Router } from "express";
import { prisma } from "../db.js";
import { z } from "zod";
import { parseStringToInteger } from "../../utils/parseStringToInteger.js";

const router = Router();

const lessonSchema = z.object({
  id: z.number(),
  name: z.string(),
  descripcion: z.string(),
  userId: z.number().optional(),
  levelId: z.number(),
  sublevelId: z.number(),
  chapterId: z.number(),
});

const levelIdSchema = z.object({ id: parseStringToInteger() });
const userIdSchema = z.object({ id: parseStringToInteger() });
const lessonNameSchema = z.object({ name: z.string() });

router.post("/new-lesson", async (req, res) => {
  try {
    if (!req.body)
      return res.status(404).json({
        message: "Invalid payload",
      });

    const { error, data: lesson } = lessonSchema.safeParse(req.body);

    if (error) {
      return res.status(404).json({
        message: "Bad payload",
        data: error.formErrors.fieldErrors,
      });
    }
    // const foundChapter = await prisma.lesson.findUnique({
    //   where: {
    //     id: lesson.id,
    //   },
    // });

    // if (foundChapter)
    //   return res.status(400).json({
    //     message: "Email already exists",
    //   });

    const newLesson = await prisma.lesson.create({
      data: lesson,
    });
    return res.json(newLesson);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error" });
  }
});

router.get("/all-lessons", async (req, res) => {
  try {
    const allLessons = await prisma.lesson.findMany();
    return res.json(allLessons);
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
});

router.get("/lesson-level/:id", async (req, res) => {
  try {
    const { error, data: params } = levelIdSchema.safeParse(req.params);
    if (error) {
      return res.status(404).json({
        message: "Bad payload",
        data: error.formErrors.fieldErrors,
      });
    }
    const lesson = await prisma.lesson.findUnique({
      where: {
        levelId: params.levelId,
      },
      include: {
        level: true,
        chapter: true,
      },
    });

    if (!lesson)
      return res.status(400).json({
        message: "lesson doesn't exists",
      });
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
});

router.get("/lesson-user/:id", async (req, res) => {
  try {
    const { error, data: params } = userIdSchema.safeParse(req.params);
    if (error) {
      return res.status(404).json({
        message: "Bad payload",
        data: error.formErrors.fieldErrors,
      });
    }

    const lesson = await prisma.lesson.findUnique({
      where: {
        userId: params.id,
      },
      include: {
        level: true,
        sublevel: true,
        user: true,
      },
    });

    if (!lesson)
      return res.status(400).json({
        message: "lesson doesn't exists",
      });
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
});

router.get("/lesson/:lesson", async (req, res) => {
  try {
    const { error, data: params } = lessonNameSchema.safeParse(req.params);
    if (error) {
      return res.status(404).json({
        message: "Bad payload",
        data: error.formErrors.fieldErrors,
      });
    }
    const lesson = await prisma.lesson.findUnique({
      where: {
        name: params.name,
      },
      include: {
        level: true,
        sublevel: true,
      },
    });

    if (!lesson)
      return res.status(400).json({
        message: "lesson doesn't exists",
      });
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
});

export default router;
