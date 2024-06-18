import { groq } from './index.js'
import { constants } from '../../config/index.js'

export const getChatCompletion = (messages) => {
  return groq.chat.completions.create({
    messages,
    model: constants.MODEL_NAME,
  });
}
