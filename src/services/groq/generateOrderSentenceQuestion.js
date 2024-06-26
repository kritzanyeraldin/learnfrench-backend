import { getChatCompletion } from "./getChatCompletion.js";

const schema = {
  question: {
    type: "order_sentence",
    content: "est / la / France / capitale / de / Paris",
    answer: "France est la capitale de Paris",
    feedback: "feedback",
  },
};

export const generateOrderSentenceQuestion = async (lesson) => {
  const generatedQuestion = await getChatCompletion([
    {
      role: "system",
      content: `
          CONTEXTO:
          Toma el rol de una aplicación interactiva para aprender francés.
          Tu tarea es generar preguntas para reordenar, que ayudan al usuario
          a mejorar su vocabulario, gramática y comprensión.
        
          REGLAS:
            - Debes responder con la siguiente estructura ${JSON.stringify(
              schema
            )} de forma OBLIGATORIA en formato JSON.
            - No olvides desordenar las palabras del texto de la pregunta.
            - Tanto la pregunta como las respuestas deben estar realacionadas al tema ${lesson}) 
          
      `,
    },
    {
      role: "user",
      content: `
          Genera una pregunta para ordenar la frase en francés.
          - Proporciona una oración en desorden, cada palabra separada por slashes.
          - Deja que el usuario conteste, y verifique su respuesta.
          - Proporciona feedback en español basado en la estructura gramatical de la oración.
          - Respondeme únicamente lo que estoy solicitando (OBLIGATORIO).
        `,
    },
  ]);

  return generatedQuestion;
};
