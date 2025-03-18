import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { resumeText, jobDescription } = await req.json()

    if (!resumeText || !jobDescription) {
      return NextResponse.json({ error: "Resume text and job description are required" }, { status: 400 })
    }

    // Analyze resume summary
    const { text: summaryText } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Analise este currículo: "${resumeText.substring(0, 2000)}..." 
               Forneça um resumo profissional em 3 a 4 frases.`,
      providerOptions: {
        openai: {
          apiKey: process.env.OPENAI_API_KEY as string,
        },
      },
    })

    // Extract key skills
    const { text: skillsText } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Extraia as principais habilidades deste currículo: "${resumeText.substring(0, 2000)}..." 
               Liste as 5 a 7 principais habilidades em formato de tópicos.`,
      providerOptions: {
        openai: {
          apiKey: process.env.OPENAI_API_KEY as string,
        },
      },
    })

    // Evaluate job match
    const { text: matchText } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Compare este currículo: "${resumeText.substring(0, 2000)}..." 
               Com a descriçao desta vaga: "${jobDescription}"
               Avalie o quão bem o candidato atende aos requisitos do trabalho.
                Forneça 3-4 frases sobre pontos fortes e potenciais lacunas.`,
      providerOptions: {
        openai: {
          apiKey: process.env.OPENAI_API_KEY as string,
        },
      },
    })

    // Generate match score
    const { text: scoreText } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Com base neste currículo: "${resumeText.substring(0, 1000)}..." 
               e esta descrição desta vaga: "${jobDescription}"
               Forneça apenas uma pontuação numérica de 0 a 100 representando o quão bem o candidato se encaixa na vaga.
                Retorne apenas o número, nenhum outro texto.`,
      providerOptions: {
        openai: {
          apiKey: process.env.OPENAI_API_KEY as string,
        },
      },
    })

    const score = Number.parseInt(scoreText.trim()) || 75 // Fallback if parsing fails

    return NextResponse.json({
      summary: summaryText,
      skills: skillsText,
      match: matchText,
      score: score,
    })
  } catch (error) {
    console.error("Error analyzing resume:", error)
    return NextResponse.json({ error: "Failed to analyze resume" }, { status: 500 })
  }
}

