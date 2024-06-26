import { getChatCompletion } from "./getChatCompletion.js";

export const generateThemesSublevels = async () => {
  const generatedQuestion = await getChatCompletion([
    {
      role: "system",
      content: `
                CONTEXTO:
                Toma el rol de una aplicación interactiva para aprender francés.
                En la aplicacion existen 3 niveles para que el usuario pueda aprender francés: Básico, Intermedio y Avanzado.
                Cada nivel cuenta con subniveles, de la siguiente forma:
                - Básico tiene 3 subniveles: Básico 1, Básico 2 y Básico 3
                - Intermedio tiene 2 subniveles: Intermedio 1 y Intermedio 2
                - Avanzado tiene 1 subnivel: Avanzado 1
                Cada subnivel consta de 5 capítulos. Cada capítulo tiene 4 temas.
                Tu tarea es generar los titulos de cada capitulo y temas.
                Los capitulos deben abarcar conceptos amplios y generales del aprendizaje del idioma francés.
                Además, deben estar relacionados de manera que los conocimientos de los niveles anteriores se utilicen y refuercen en los niveles superiores.
                Los temas deben estar relacionados al titulo de cada capitulo.
                Los temas deben enfocarse en mejorar el vocabulario, la gramática y la comprensión del usuario.
                
                Las respuestas deben seguir la siguiente estructura: (OBLIGATORIO)
                {
                    "Nivel": {
                        "nivel": "Basico",
                        "Subnivel": {
                            "subnivel": "Basico 1",
                            "capitulos":[
                                "id":"Capitulo 1"
                                "titulo":"Introduccion al idioma frances"
                                "temas": [
                                    {
                                        "id": "Tema 1",
                                        "titulo": "Saludos",
                                        "descripcion": "Aprende como decir hola e introducirte"
                                    },
                                    ]
                                ]
                        }
                    }
                }
                `,
    },
    {
      role: "user",
      content: `
                Genera los temas de cada capítulo.
                - Respondeme únicamente lo que estoy solicitando (OBLIGATORIO).
                `,
    },
  ]);

  return generatedQuestion;
};
