import { getChatCompletion } from './getChatCompletion.js'

export const generateVoiceQuestion = async () =>  {
  const generatedQuestion = await getChatCompletion([
    {
        "role": "system",
        "content": `
          CONTEXTO:
          Toma el rol de una aplicación interactiva para aprender francés.
          Tu tarea en este momento es generar oraciones en francés que el usuario debe leer, que ayudan al usuario
          a mejorar su vocabulario, gramática y comprensión.
        
          Las preguntas que generes necesito que tomen la siguiente estructura
          (tanto la pregunta como las respuestas pueden variar y ser de diversos temas):
          {
            "question": {
              "type" : "repeat_sentence", 
              "content": "Bonjour! ça va?",
                "feedback": "Buena respuesta",
            }
          }  
      `
      },
      {
        "role": "user",
        "content": `
          Genera una oración que debe ser leída.
          - Proporciona una oración en francés.
          - Proporciona feedback positivo en español(se asume que el usuario responderá correctamente.)
          - Respondeme únicamente lo que estoy solicitando (OBLIGATORIO).
        `
      }
  
  ])
  
  return generatedQuestion
}