import { getChatCompletion } from "./getChatCompletion.js";

const schema = {
  A: {
    name: "Básico",
    alias: "A",
    sublevels: {
      A1: {
        name: "Basico 1",
        alias: "A1",
        chapters: [
          {
            name: "<chapter_name>",
            lessons: [
              {
                name: "<lesson_name>",
                description: "<lesson_description>",
              },
            ],
          },
        ],
      },
      A2: {
        name: "Basico 2",
        alias: "A2",
        chapters: [
          {
            name: "<chapter_name>",
            lessons: [
              {
                name: "<lesson_name>",
                description: "<lesson_description>",
              },
            ],
          },
        ],
      },
      A3: {
        name: "Basico 3",
        alias: "A3",
        chapters: [
          {
            name: "<chapter_name>",
            lessons: [
              {
                name: "<lesson_name>",
                description: "<lesson_description>",
              },
            ],
          },
        ],
      },
    },
  },
  B: {
    name: "Intermedio",
    alias: "B",
    sublevels: {
      A1: {
        name: "Intermedio 1",
        alias: "B1",
        chapters: [
          {
            name: "<chapter_name>",
            lessons: [
              {
                name: "<lesson_name>",
                description: "<lesson_description>",
              },
            ],
          },
        ],
      },
      B2: {
        name: "Intermedio 2",
        alias: "B2",
        chapters: [
          {
            name: "<chapter_name>",
            lessons: [
              {
                name: "<lesson_name>",
                description: "<lesson_description>",
              },
            ],
          },
        ],
      },
    },
  },
  C: {
    name: "Avanzado",
    alias: "C",
    sublevels: {
      A1: {
        name: "Avanzado 1",
        alias: "C1",
        chapters: [
          {
            name: "<chapter_name>",
            lessons: [
              {
                name: "<lesson_name>",
                description: "<lesson_description>",
              },
            ],
          },
        ],
      },
    },
  },
};

export const generateThemesSublevels = async () => {
  const generatedQuestion = await getChatCompletion([
    {
      role: "system",
      content: `
        Eres una base de datos capítulos y lecciones variadas pero relevantes para el aprendizaje francés,
        estos capítulos y lecciones se encuentran clasificados por nivel (A, B, C) y subnivel (A1, A2, A3, B1, B2, C1).
        Debes responder con la siguiente estructura ${JSON.stringify(
          schema
        )} de forma OBLIGATORIA en formato JSON.

        REGLAS:
          - Cada subnivel consta de 5 capítulos OBLIGATORIAMENTE. Cada capítulo tiene 4 lecciones OBLIGATORIAMENTE.
          - Los temas deben ser diversos y progresivos siempre (OBLIGATORIO).
      `,
    },
    {
      role: "user",
      content: `
        Genera los capítulos y lecciones en español (OBLIGATORIO).
      `,
    },
  ]);

  return generatedQuestion;
};
