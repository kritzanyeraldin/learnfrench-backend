import { getChatCompletion } from './getChatCompletion.js'

const schema = {
	type: 'repeat_sentence',
	content: 'Bonjour! ça va?',
	feedback: 'Buena respuesta',
}

export const generateVoiceQuestion = async lesson => {
	const generatedQuestion = await getChatCompletion([
		{
			role: 'system',
			content: `
          CONTEXTO:
          Toma el rol de una aplicación interactiva para aprender francés.
          Tu tarea en este momento es generar oraciones en francés que el usuario debe leer, que ayudan al usuario
          a mejorar su vocabulario, gramática y comprensión.

          REGLAS:
            - Debes responder con la siguiente estructura ${JSON.stringify(
							schema
						)} de forma OBLIGATORIA en formato JSON.
            - Tanto la pregunta como las respuestas deben estar realacionadas al tema ${lesson})
                       
      `,
		},
		{
			role: 'user',
			content: `
          Genera una oración que debe ser leída.
          - Proporciona una oración en francés.
          - Proporciona feedback positivo en español(se asume que el usuario responderá correctamente.)
          - Respondeme únicamente lo que estoy solicitando (OBLIGATORIO).
        `,
		},
	])

	return generatedQuestion
}
