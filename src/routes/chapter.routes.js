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
const userSchema = z.object({
  userId: parseStringToInteger(),
  preferencesUser: z.string,
  sublevelId: parseStringToInteger(),
});
const chapterNameSchema = z.object({ name: z.string() });
const sublevelIdSchema = z.object({ sublevelId: parseStringToInteger() });

router.get("/chapters/sublevel/:sublevelId", async (req, res) => {
  try {
    const MOCKED_USER_ID = 1;
    const { error, data: params } = sublevelIdSchema.safeParse(req.params);
    if (error) {
      return res.status(404).json({
        message: "Bad payload",
        data: error.formErrors.fieldErrors,
      });
    }
    const chapters = await prisma.chapter.findMany({
      where: {
        sublevelId: params.sublevelId,
        userId: MOCKED_USER_ID,
        // userPreference: req.params.p,
      },
      include: {
        Lesson: true,
        CompletedUserLesson: {
          where: {
            userId: MOCKED_USER_ID,
          },
          select: {
            lessonId: true,
          },
        },
      },
    });
    return res.json(
      chapters.map((chapter) => {
        const { Lesson, CompletedUserLesson, ...restChapter } = chapter;

        return {
          ...restChapter,
          lessons: Lesson,
          completedLessonsIds: CompletedUserLesson.map((cl) => cl.lessonId),
        };
      })
    );
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

// const MOCK_DATA = {
//   A: {
//     name: "Básico",
//     alias: "A",
//     sublevels: {
//       A1: {
//         name: "Basico 1",
//         alias: "A1",
//         chapters: [
//           {
//             name: "<chapter_name>",
//             lessons: [
//               {
//                 name: "<lesson_name>",
//                 description: "<lesson_description>",
//               },
//             ],
//           },
//         ],
//       },
//       A2: {
//         name: "Basico 2",
//         alias: "A2",
//         chapters: [
//           {
//             name: "<chapter_name>",
//             lessons: [
//               {
//                 name: "<lesson_name>",
//                 description: "<lesson_description>",
//               },
//             ],
//           },
//         ],
//       },
//       A3: {
//         name: "Basico 3",
//         alias: "A3",
//         chapters: [
//           {
//             name: "<chapter_name>",
//             lessons: [
//               {
//                 name: "<lesson_name>",
//                 description: "<lesson_description>",
//               },
//             ],
//           },
//         ],
//       },
//     },
//   },
//   B: {
//     name: "Intermedio",
//     alias: "B",
//     sublevels: {
//       B1: {
//         name: "Intermedio 1",
//         alias: "B1",
//         chapters: [
//           {
//             name: "<chapter_name>",
//             lessons: [
//               {
//                 name: "<lesson_name>",
//                 description: "<lesson_description>",
//               },
//             ],
//           },
//         ],
//       },
//       B2: {
//         name: "Intermedio 2",
//         alias: "B2",
//         chapters: [
//           {
//             name: "<chapter_name>",
//             lessons: [
//               {
//                 name: "<lesson_name>",
//                 description: "<lesson_description>",
//               },
//             ],
//           },
//         ],
//       },
//     },
//   },
//   C: {
//     name: "Avanzado",
//     alias: "C",
//     sublevels: {
//       C1: {
//         name: "Avanzado 1",
//         alias: "C1",
//         chapters: [
//           {
//             name: "<chapter_name>",
//             lessons: [
//               {
//                 name: "<lesson_name>",
//                 description: "<lesson_description>",
//               },
//             ],
//           },
//         ],
//       },
//     },
//   },
// };

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
            .length(4),
        })
      )
      .length(5),
  });

const defaultContentSchema = z.object({
  A: z.object({
    name: z.string(),
    alias: z.literal("A"),
    sublevels: z.object({
      A1: getSublevelSchema("A1"),
      A2: getSublevelSchema("A2"),
      A3: getSublevelSchema("A3"),
    }),
  }),
  B: z.object({
    name: z.string(),
    alias: z.literal("B"),
    sublevels: z.object({
      B1: getSublevelSchema("B1"),
      B2: getSublevelSchema("B2"),
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

// Solo va ser un endpoint que sere llamado mediante Postman
router.get("/chapters/default-content", async (req, res) => {
  try {
    let validContent;
    let tries = 5;

    while (true) {
      try {
        if (tries === 0) break;
        if (validContent) break;

        let content = await groqService.generateThemesSublevels();
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
            lessons: chapter.lessons.map((lesson) => ({
              levelId: levelIds[level.alias],
              sublevelId: sublevelIds[sublevel.alias],
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
      })),
    });

    return res.json(validContent);
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

router.get("/chapters-user/:userPreference", async (req, res) => {
  try {
    const MOCKED_USER_ID = 1;
    const { error, data: params } = sublevelIdSchema.safeParse(req.params);
    // if (error) {
    //   return res.status(404).json({
    //     message: "Bad payload",
    //     data: error.formErrors.fieldErrors,
    //   });
    // }
    const chapters = await prisma.chapter.findMany({
      where: {
        // sublevelId: params.sublevelId,
        userId: MOCKED_USER_ID,
        userPreference: req.params.userPreference,
      },
      include: {
        Lesson: true,
        CompletedUserLesson: {
          where: {
            userId: MOCKED_USER_ID,
          },
          select: {
            lessonId: true,
          },
        },
      },
    });
    return res.json(
      chapters.map((chapter) => {
        const { Lesson, CompletedUserLesson, ...restChapter } = chapter;

        return {
          ...restChapter,
          lessons: Lesson,
          completedLessonsIds: CompletedUserLesson.map((cl) => cl.lessonId),
        };
      })
    );
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
});

export default router;
