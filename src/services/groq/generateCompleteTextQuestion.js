import { getChatCompletion } from "./getChatCompletion.js";

const schema = {
  Textquestion: {
    type: "complete_with_text",
    content: "¿Qué puedes responder si alguien dice ¡Bonjour! Ca va?",
    answer: "si",
    feedback: {
      correcto: "feedbackcorrecto",
      incorrecto: "feedbackincorrecto",
    },
  },
};

export const generateCompleteTextQuestion = async (lesson) => {
  const generatedQuestion = await getChatCompletion([
    {
      role: "system",
      content: `
          CONTEXTO:
          Toma el rol de una aplicación interactiva para aprender francés.
          Tu tarea en este momento es generar preguntas para responder con texto, que ayudan al usuario
          a mejorar su vocabulario, gramática y comprensión.
          REGLAS:
            - Debes responder con la siguiente estructura ${JSON.stringify(
              schema
            )} de forma OBLIGATORIA en formato JSON.
            - Tanto la pregunta como las respuestas deben estar relacionadas al tema de ${lesson}
      `,
    },
    {
      role: "user",
      content: `
          Genera una pregunta para responder con texto en francés.
          - Proporciona una pregunta que pida al usuario seguir una conversación.
          - Deja que el usuario conteste, y evalúe si la respuesta es correcta o no.
          - Proporciona feedback en español basado en la respuesta del usuario
          - Respondeme únicamente lo que estoy solicitando (OBLIGATORIO).
        `,
    },
  ]);

  return generatedQuestion;
};
