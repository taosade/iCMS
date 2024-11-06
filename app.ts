import '@std/dotenv/load'
import { Hono } from '@hono/hono'
import { serveStatic } from '@hono/hono/deno'
import { documents } from "./db.ts"

import renderLayout from './views/layout.ts'
import renderForm from './views/form.ts'

import { generate } from './openAi.ts'

const app = new Hono()

// MongoDB test
app.get('/mongo', async (ctx) => {
	const data = await documents.find().toArray()
	return ctx.json(data)
})

// Main UI layout
app.get('/', serveStatic({ path: 'static/layout.html' }))

// Form layout

app.get('/form', (ctx) => {
	return ctx.html(renderLayout({
		content: renderForm(),
		sidebar: ''
	}))
})

// Static assets
app.get('/static/*', serveStatic({ root: './' }))

// Generative AI endpoint
app.post('/generate', async (ctx) => {
	if (ctx.req.header('Content-Type') !== 'application/json') {
		return ctx.json({ error: 'Invalid content type' }, 400)
	}

	try {
		try {
			const body = await ctx.req.json()
			const text = await generate(body)

			return ctx.json({ text })
		} catch (err) {
			return ctx.json({ error: String(err) }, 500)
		}
	} catch (err) {
		return ctx.json({ error: String(err) }, 400)
	}
})

export default app