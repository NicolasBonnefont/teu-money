import { Configuration, OpenAIApi } from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { getLancamentos } from '@/app/server/lancamentos/Lancamentos'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(config)

export const runtime = 'server'

export async function POST(req: Request) {

  try {
    let { messages } = await req.json()

    const lancamentos = await getLancamentos()

    let content = `voce é um assistente virtual financeiro. voce recebera lancamentos do sistema de controle de gestão onde vai conter as entradas e saidas que o usuário cadastrou. responda sempre de forma objetiva e com poucas palavras, mas, educado.`

    await Promise.all(
      lancamentos.map(lancamento => {
        if (lancamento.tipo == 'entrada') {
          content += `entrada: descricao: ${lancamento.descricao} valor: ${lancamento.valor} `
        } else {
          content += `saida: descricao: ${lancamento.descricao} valor: ${lancamento.valor} `
        }
      }
      )
    )

    if (messages[0].role !== 'system') {
      messages = [
        { role: 'system', content },
        ...messages,
      ]
    }

    console.log(messages)

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages
    })

    const stream = OpenAIStream(response)

    return new StreamingTextResponse(stream)
  } catch (error) {
    console.log(error)
  }

}