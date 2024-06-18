import { getChatCompletion } from './getChatCompletion.js'

export const generateCompleteQuestion = async () =>  {
  const generatedQuestion = await getChatCompletion([
    {
      "role": "system",
      "content": `
        CONTEXTO:
        Toma el rol de una aplicación interactiva para aprender francés.
        Tu tarea es generar preguntas para completar, que ayudan al usuario
        a mejorar su vocabulario, gramática y comprensión.
      
        Las respuestas que generes necesito que tomen la siguiente estructura
        (tanto la pregunta como las respuestas pueden variar y ser de diversos temas):
        {
          "question": {
            "text": "Complete la frase con la opción correcta: \"Je vais ___ cinéma ce soir.\"",
            "options": [
              {
                "option": "au",
                "correct": true,
                "feedback": "Correcto, 'au'. 'Au' se usa antes de 'cinéma' para indicar el destino. Es una contracción de 'à le'."
              },
              {
                "option": "à",
                "correct": false,
                "feedback": "Incorrecto. 'À' se utiliza antes de palabras que no se combinan con el artículo definido, como 'à la'. En este caso, 'cinéma' requiere 'au'."
              },
              {
                "option": "aux",
                "correct": false,
                "feedback": "Incorrecto. 'Aux' es la forma plural de 'au'. 'Cinéma' es singular, así que la forma correcta es 'au'."
              }
            ]
          }
        }  
    `
    },
    {
      "role": "user",
      "content": `
        Genera una pregunta de completar la frase en francés.
        - Proporciona la frase con una palabra faltante.
        - Ofrece tres opciones de respuesta, donde una es correcta y dos son incorrectas.
        - Asegúrate de que la pregunta sea clara y la opción correcta sea educativa para el usuario.
        - Respondeme únicamente lo que estoy solicitando (OBLIGATORIO).
      `
    }
  ])
  
  return generatedQuestion
}