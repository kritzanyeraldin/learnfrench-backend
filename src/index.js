import Groq from "groq-sdk";
import { groqService } from './services/index.js'

export async function main() {
  const completions = await Promise.all([
    groqService.generateCompleteQuestion(),
    groqService.generateCompleteQuestion()
  ])

  completions.forEach(completion => {
    console.log(completion.choices[0]?.message?.content ? JSON.parse(completion.choices[0]?.message?.content) : "");
  })
}

main();