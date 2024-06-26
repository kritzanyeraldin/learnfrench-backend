import { getChatCompletion } from "./getChatCompletion.js";

export const generateOrderSentenceQuestion = async () => {
  const generatedQuestion = await getChatCompletion([
    {
      role: "system",
      content: `
          CONTEXTO:
          Toma el rol de una aplicación interactiva para aprender francés.
          Tu tarea es generar preguntas para reordenar, que ayudan al usuario
          a mejorar su vocabulario, gramática y comprensión.
        
          Las respuestas que generes necesito que tomen la siguiente estructura,
          y no olvides desordenar las palabras del texto de la pregunta.
          (tanto la pregunta como las respuestas pueden variar y ser de diversos temas):
          {
            "question": {
              "type" : "order_sentence", 
              "content": "est / la / France / capitale / de / Paris",
              "answer": "France est la capitale de Paris" ,
          "feedback": "feedback", 
            }
          }  
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
