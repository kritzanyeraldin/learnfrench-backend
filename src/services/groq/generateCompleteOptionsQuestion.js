import { getChatCompletion } from "./getChatCompletion.js";

const schema = {
  Optionsquestion: {
    type: "complete_with_options",
    content:
      'Complete la frase con la opción correcta: "Je vais ___ cinéma ce soir."',
    options: [
      {
        content: "au",
        right: true,
        feedback:
          "Correcto, 'au'. 'Au' se usa antes de 'cinéma' para indicar el destino. Es una contracción de 'à le'.",
      },
      {
        content: "à",
        right: false,
        feedback:
          "Incorrecto. 'À' se utiliza antes de palabras que no se combinan con el artículo definido, como 'à la'. En este caso, 'cinéma' requiere 'au'.",
      },
      {
        content: "aux",
        right: false,
        feedback:
          "Incorrecto. 'Aux' es la forma plural de 'au'. 'Cinéma' es singular, así que la forma correcta es 'au'.",
      },
    ],
  },
};

export const generateCompleteOptionsQuestion = async (lesson) => {
  const generatedQuestion = await getChatCompletion([
    {
      role: "system",
      content: `
        CONTEXTO:
        Toma el rol de una aplicación interactiva para aprender francés.
        Tu tarea es generar preguntas para completar, que ayudan al usuario
        a mejorar su vocabulario, gramática y comprensión.
        REGLAS:
          - Debes responder con la siguiente estructura ${JSON.stringify(
            schema
          )} de forma OBLIGATORIA en formato JSON.
          - Tanto la pregunta como las respuestas deben estar realacionadas al tema ${lesson}) 
          - Siempre debe existir una respuesta correcta. (OBLIGATORIO)
    `,
    },
    {
      role: "user",
      content: `
        Genera una pregunta de completar la frase en francés.
        - Proporciona la frase con una palabra faltante.
        - Ofrece tres opciones de respuesta, donde una es correcta y dos son incorrectas.
        - Asegúrate de que la pregunta sea clara y la opción correcta sea educativa para el usuario.
        - Respondeme únicamente lo que estoy solicitando (OBLIGATORIO).
      `,
    },
  ]);

  return generatedQuestion;
};
