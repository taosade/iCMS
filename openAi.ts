import '@std/dotenv/load'
import { z } from 'zod'

const requestSchema = z.object({
	keywords: z.string().max(200),
	model: z.enum(['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'gpt-4o', 'gpt-4o-mini']),
	prompt: z.string().max(200),
	text: z.string().max(1000),
	volume: z.enum(['50', '100', '200', '300', '400', '500']),
})

const generate = async (request: unknown): Promise<string> => {
	const validatedRequest = requestSchema.safeParse(request)

	if (!validatedRequest.success) {
		throw new Error('Failed to parse request schema')
	}

	let prompt = ''

	if (validatedRequest.data.prompt) {
		prompt += `Using following prompt: ${validatedRequest.data.prompt}\n\n`
	}

	if (validatedRequest.data.text) {
		prompt += `Generate ${validatedRequest.data.volume} words as continuation for the following text:\n\n${validatedRequest.data.text}`
	} else {
		prompt += `Generate a random ${validatedRequest.data.volume} words long plain text.`
	}

	if (validatedRequest.data.keywords) {
		prompt += `\n\nUse following keywords: ${validatedRequest.data.keywords}`
	}

	prompt += '\n\nRespond with generated text only.'

	const res = await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			model: validatedRequest.data.model,
			messages: [
				{
					role: 'user',
					content: prompt
				}
			]
		})
	})

	if (res.status !== 200) {
		throw new Error('Failed to retrieve generated text from OpenAI')
	}

	const data = await res.json()

	if (typeof data?.choices?.[0]?.message?.content !== 'string') {
		throw new Error('Invalid response from OpenAI')
	}

	return data.choices[0].message.content
}

export { generate }