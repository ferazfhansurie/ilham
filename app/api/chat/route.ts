import { NextResponse } from "next/server"
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const getAssistantId = (subject: string) => {
  switch (subject) {
    case "math":
      return process.env.NEXT_PUBLIC_MATH_ASSISTANT_ID
    case "science":
      return process.env.NEXT_PUBLIC_SCIENCE_ASSISTANT_ID
    case "english":
      return process.env.NEXT_PUBLIC_ENGLISH_ASSISTANT_ID
    case "malay":
      return process.env.NEXT_PUBLIC_MALAY_ASSISTANT_ID
    default:
      throw new Error("Invalid subject")
  }
}

export async function POST(req: Request) {
  try {
    const { message, subject } = await req.json()
    
    const thread = await openai.beta.threads.create()
    
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message
    })

    const assistantId = getAssistantId(subject)
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId!
    })

    let response
    while (true) {
      const runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)
      if (runStatus.status === 'completed') {
        const messages = await openai.beta.threads.messages.list(thread.id)
        const lastMessage = messages.data[0]?.content[0]
        if (lastMessage && 'text' in lastMessage) {
          response = lastMessage.text.value
        }
        break
      } else if (runStatus.status === 'failed') {
        throw new Error('Assistant run failed')
      }
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}

