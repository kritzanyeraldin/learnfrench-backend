import { Router } from "express";
import { prisma } from "../db.js";
import { z } from "zod";
import { parseStringToInteger } from "../../utils/parseStringToInteger.js";
import { groqService } from "../services/index.js";

const router = Router();

const getSublevelSchema = (alias) =>
  z.object({
    name: z.string(),
    alias: z.literal(alias),
    chapters: z
      .array(
        z.object({
          name: z.string(),
          lessons: z
            .array(
              z.object({
                name: z.string(),
                description: z.string(),
              })
            )
            .length(3),
        })
      )
      .length(4),
  });

const defaultContentSchema = z.object({
  A: z.object({
    name: z.string(),
    alias: z.literal("A"),
    sublevels: z.object({
      A1: getSublevelSchema("A1"),
    }),
  }),
  B: z.object({
    name: z.string(),
    alias: z.literal("B"),
    sublevels: z.object({
      B1: getSublevelSchema("B1"),
    }),
  }),
  C: z.object({
    name: z.string(),
    alias: z.literal("C"),
    sublevels: z.object({
      C1: getSublevelSchema("C1"),
    }),
  }),
});

router.get("/user/:name/:id", async (req, res) => {
  const name = req.params.name;
  const id = req.params.id;
  res.json({ name, id });
});

const userIdSchema = z.object({ userId: parseStringToInteger() });
const userThemeSchema = z.object({ userTheme: z.string() });

router.get("/user-content/:userPreference/:userId", async (req, res) => {
  try {
    let validContent;
    let tries = 7;
    let lessonName = req.params.userPreference;
    let userId = parseInt(req.params.userId);
    // const {error, data: params} =

    while (true) {
      try {
        if (tries === 0) break;
        if (validContent) break;
        console.log(tries);
        let content = await groqService.generateThemesSublevelsUser(lessonName);
        if (!content) throw new Error("No se pudo generar los capitulos");

        console.log({
          content,
        });
        const contentAsJson = JSON.parse(content);
        validContent = defaultContentSchema.parse(contentAsJson);
      } catch (error) {
        console.log(error);
        tries--;
      }
    }

    console.log("a");
    if (!validContent) return res.json("No se pudo generar el contenido");

    const levelAliases = Object.keys(validContent);
    const sublevelAliases = Object.values(validContent)
      .map((level) => Object.keys(level.sublevels))
      .flat();
    const [levels, sublevels] = await Promise.all([
      prisma.level.findMany({
        where: {
          alias: {
            in: levelAliases,
          },
        },
        select: {
          id: true,
          alias: true,
        },
      }),
      prisma.sublevel.findMany({
        where: {
          alias: {
            in: sublevelAliases,
          },
        },
        select: {
          id: true,
          alias: true,
        },
      }),
    ]);
    const levelIds = Object.fromEntries(
      levels.map((level) => [level.alias, level.id])
    );
    const sublevelIds = Object.fromEntries(
      sublevels.map((sublevel) => [sublevel.alias, sublevel.id])
    );

    const rawData = Object.values(validContent)
      .map((level) =>
        Object.values(level.sublevels).map((sublevel) =>
          sublevel.chapters.map((chapter) => ({
            levelId: levelIds[level.alias],
            sublevelId: sublevelIds[sublevel.alias],
            name: chapter.name,
            userId: userId,
            userPreference: lessonName,
            lessons: chapter.lessons.map((lesson) => ({
              levelId: levelIds[level.alias],
              sublevelId: sublevelIds[sublevel.alias],
              userId: userId,
              chapterName: chapter.name,
              ...lesson,
            })),
          }))
        )
      )
      .flat(2);

    let rawLessons = [];
    const rawChapters = rawData.map((chapter) => {
      const { lessons, ...restChapter } = chapter;
      rawLessons.push(lessons);
      return restChapter;
    });
    rawLessons = rawLessons.flat();

    const chapters = await prisma.chapter.createManyAndReturn({
      data: rawChapters,
      select: {
        id: true,
        name: true,
      },
    });

    const chapterIds = Object.fromEntries(
      chapters.map((chapter) => [chapter.name, chapter.id])
    );

    await prisma.lesson.createMany({
      data: rawLessons.map((lesson) => ({
        chapterId: chapterIds[lesson.chapterName],
        name: lesson.name,
        description: lesson.description,
        levelId: lesson.levelId,
        sublevelId: lesson.sublevelId,
        userId: lesson.userId,
      })),
    });

    return res.json(validContent);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error" });
  }
});

export default router;
