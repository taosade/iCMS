import '@std/dotenv/load'
import { Hono } from '@hono/hono'
import { serveStatic } from '@hono/hono/deno'
import { ObjectId } from 'jsr:@db/mongo'

import { generate } from './openAi.ts'
import { documents } from './db.ts'

import renderLayout from './views/layout.ts'
import renderForm from './views/form.ts'

const app = new Hono()

// Static assets

app.get('/static/*', serveStatic({ root: './' }))

// Home page

app.get('/', async (ctx) => {
	return ctx.html(await renderLayout())
})

// Document page

app.get('/documents/:id{[a-f\\d]{24}}', async (ctx) => {
	const id = ctx.req.param('id')

	const document = await documents.findOne({ _id: new ObjectId(id) })

	if (!document)
		return ctx.notFound()

	return ctx.html(await renderLayout({
		content: `<h1>${document.title}</h1>${document.text}</p>`
	}))
})

// Form layout

app.get('/form', (ctx) => {
	return ctx.html(renderLayout({
		content: renderForm()
	}))
})

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