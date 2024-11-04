import '@std/dotenv/load'
import { Hono } from '@hono/hono'
import { serveStatic } from '@hono/hono/deno'
import { documents } from "./db.ts"

const app = new Hono()

// MongoDB test
app.get('/mongo', async (ctx) => {
	const data = await documents.find().toArray()
	return ctx.json(data)
})

// Main UI layout
app.get('/', serveStatic({ path: 'static/layout.html' }))

// Form layout
app.get('/form', serveStatic({ path: 'static/form.html' }))

// Static assets
app.get('/static/*', serveStatic({ root: './' }))

// Generative AI endpoint
app.post('/generate', async (ctx) => {

	// Parsing form data

	//const formData = await ctx.req.formData()
	//const prompt = formData.get('prompt')
	//const keywords = formData.get('keywords')
	//const maxTokens = formData.get('maxTokens')

	const payload = {
		model: 'gpt-3.5-turbo',
		messages: [
			{
				role: 'user',
				content: `Generate a plain text based on the following keywords: lol, kek, cheburek`
			}
		],
		max_tokens: 50
	}

	try {
		const res = await fetch(String(Deno.env.get('OPENAI_ENDPOINT')), {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		})

		console.log(res.status);

		if (res.status !== 200) {
			throw new Error('Failed to generate text')
		}

		const data = await res.json()

		if (typeof data?.choices?.[0]?.message?.content !== 'string') {
			throw new Error('Invalid response data')
		}

		return ctx.json({ text: data.choices[0].message.content }, 200)
	} catch (error) {
		return ctx.json({ error: String(error) }, 500)
	}
})

export default app