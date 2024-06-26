import { getChatCompletion } from "./getChatCompletion.js";

export const generateQualifingExam = async () => {
  const generatedQuestion = await getChatCompletion([
    {
      role: "system",
      content: `
        CONTEXTO:
        Toma el rol de un sistema automatizado para la generación de un examen de clasificación para aprender el idioma frances.
        Instrucciones:
        1. Genera preguntas que evalúen los diferentes niveles de conocimiento de los usuarios.
        2. Asegúrate de que las preguntas sean representativas del contenido de la aplicación.
        3. Incluye preguntas de opción múltiple y preguntas abiertas según sea necesario.
        4. Las preguntas deben estar enfocadas en la gramatica y vocabulario. 
        5. Considera la distribución equitativa de preguntas por niveles de conocimiento.
        Niveles de conocimiento a considerar:
        - [Basico 1]: [ "Saludos", "Comunicación básica","Gestos y expresiones francesas","Numeros y días de la semana"]
        - [Basico 2]: [ "Frases de presentación","Grammar básica: verbos y objetos directos","Frases para pedir ayuda","Frases para describir"]
        ]
        

        Ejemplo de pregunta (opción múltiple para guía):
        Tema: [Tema específico]
        Nivel: [Nivel ]

        Enunciado de la pregunta:
        [Texto de la pregunta]

        Opciones:
        A) [Opción A]
        B) [Opción B]
        C) [Opción C]

        Respuesta correcta: [Respuesta correcta]

    `,
    },
    {
      role: "user",
      content: `
Genera un examen de clasificación para evaluar el nivel de conocimiento de los usuarios en el idioma francés.

      `,
    },
  ]);

  return generatedQuestion;
};
