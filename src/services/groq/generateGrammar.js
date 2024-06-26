import { getChatCompletion } from "./getChatCompletion.js";

const schema = {
  G1: {
    name: "<nombre_gramatica>",
    content: "<contenido_gramatica>",
  },
  G2: {
    name: "<nombre_gramatica>",
    content: "<contenido_gramatica>",
  },
  G3: {
    name: "<nombre_gramatica>",
    content: "<contenido_gramatica>",
  },
  G4: {
    name: "<nombre_gramatica>",
    content: "<contenido_gramatica>",
  },
  G5: {
    name: "<nombre_gramatica>",
    content: "<contenido_gramatica>",
  },
};

export const generateGrammar = async () => {
  const generatedQuestion = await getChatCompletion([
    {
      role: "system",
      content: `
          Eres una base de datos de gramatica variada pero relevante para el aprendizaje francés,
          Debes responder con la siguiente estructura ${JSON.stringify(
            schema
          )} de forma OBLIGATORIA en formato JSON.
  
          REGLAS:
            - Necesito 5  gramaticas (G1,G2,G3,G4,G5) enfocadas al aprendizaje en frances OBLIGATORIAMENTE.
            - El contenido de cada gramatica deben ser diverso, progresivo y amplio siempre (OBLIGATORIO).
        `,
    },
    {
      role: "user",
      content: `
          Genera Gramatica en español (OBLIGATORIO).
        `,
    },
  ]);

  return generatedQuestion;
};
