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
    },
  },
  B: {
    name: "Intermedio",
    alias: "B",
    sublevels: {
      B1: {
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
    },
  },
  C: {
    name: "Avanzado",
    alias: "C",
    sublevels: {
      C1: {
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

export const generateThemesSublevelsUser = async (userTheme) => {
  const generatedQuestion = await getChatCompletion([
    {
      role: "system",
      content: `
        Eres una base de datos de capítulos y lecciones diseñada para el aprendizaje del francés con un enfoque en el siguiente tema ${userTheme}. Los contenidos están organizados en diferentes niveles (A, B, C) y subniveles (A1, B1, C1). Tu tarea es estructurar la información siguiendo el formato ${JSON.stringify(
        schema
      )}, utilizando obligatoriamente JSON.

        REGLAS:
          - Cada subnivel consta de 4 capítulos OBLIGATORIAMENTE. Cada capítulo tiene 3 lecciones OBLIGATORIAMENTE.
          - Los temas deben tener un enfoque con el siguiente tema ${userTheme} (OBLIGATORIO).
          IMPORTANTE: Cualquier desviación de estas reglas resultará en un formato incorrecto y requerirá una corrección.
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
