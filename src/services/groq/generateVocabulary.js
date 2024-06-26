import { getChatCompletion } from "./getChatCompletion.js";

const schema = {
  V1: {
    name: "<titulo_de_vocabulario>",
    content: "<palabras_de_cada_vocabulario>",
  },
  V2: {
    name: "<titulo_de_vocabulario>",
    content: "<palabras_de_cada_vocabulario>",
  },
  V3: {
    name: "<titulo_de_vocabulario>",
    content: "<palabras_de_cada_vocabulario>",
  },
  V4: {
    name: "<titulo_de_vocabulario>",
    content: "<palabras_de_cada_vocabulario>",
  },
  V5: {
    name: "<titulo_de_vocabulario>",
    content: "<palabras_de_cada_vocabulario>",
  },
};

export const generateVocabulary = async () => {
  const generatedQuestion = await getChatCompletion([
    {
      role: "system",
      content: `
          Eres una base de datos de vocabulario variado pero relevante para el aprendizaje francés,
          Debes responder con la siguiente estructura ${JSON.stringify(
            schema
          )} de forma OBLIGATORIA en formato JSON.
  
          REGLAS:
            - Necesito 5  Vocabularios (V1,V2,V3,V4,V5) enfocados al aprendizaje en frances OBLIGATORIAMENTE.
            - Cada palabra debe tener su traduccion al español.
            - El contenido de cada vocabulario deben contener diferentes palabras  siempre (OBLIGATORIO).
        `,
    },
    {
      role: "user",
      content: `
          Genera Vocabulario (OBLIGATORIO).
      `,
    },
  ]);

  return generatedQuestion;
};
