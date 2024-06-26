import { getChatCompletion } from "./getChatCompletion.js";

export const generateCompleteTextQuestion = async () => {
  const generatedQuestion = await getChatCompletion([
    {
      role: "system",
      content: `
          CONTEXTO:
          Toma el rol de una aplicación interactiva para aprender francés.
          Tu tarea en este momento es generar preguntas para responder con texto, que ayudan al usuario
          a mejorar su vocabulario, gramática y comprensión.
        
          Las preguntas que generes necesito que tomen la siguiente estructura
          (tanto la pregunta como las respuestas pueden variar y ser de diversos temas):
          {
            "question": {
              "type" : "complete_with_text", 
              "content": "¿Qué puedes responder si alguien dice ¡Bonjour! Ca va?",
              "answer": "si" ,
                "feedback": {
                "correcto": "feedbackcorrecto",
                "incorrecto": "feedbackincorrecto"
              },
            }
          }  
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
