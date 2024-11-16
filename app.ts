import '@std/dotenv/load'
import { Hono } from '@hono/hono'
import { serveStatic } from '@hono/hono/deno'
import { ObjectId } from 'jsr:@db/mongo'

import { generate } from './openAi.ts'
import { documents } from './db.ts'

import renderDocument from './views/document.ts'
import renderForm from './views/form.ts'
import renderLayout from './views/layout.ts'

const app = new Hono()

// Static assets

app.get('/static/*', serveStatic({ root: './' }))

// Home page

app.get('/', async (ctx) => { return ctx.html(await renderLayout()) })

// Document page

app.get('/documents/:id{[a-f\\d]{24}}', async (ctx) => {
	const id = ctx.req.param('id')

	const document = await documents.findOne({ _id: new ObjectId(id) })

	if (!document)
		return ctx.html(await renderLayout())

	return ctx.html(await renderLayout({
		content: renderDocument(document)
	}))
})

// Document create/edit form

app.get('/documents/:id{[a-f\\d]{24}}/edit', async (ctx) => {
	const id = ctx.req.param('id')

	const document = (await documents.findOne({ _id: new ObjectId(id) })) || {
		_id: new ObjectId(id),
		title: '',
		text: ''
	}

	return ctx.html(await renderLayout({
		content: renderForm(document)
	}))
})

// Document child create form

app.get('/documents/:id{[a-f\\d]{24}}/create', async (ctx) => {
	const id = ctx.req.param('id')

	return ctx.html(await renderLayout({
		content: renderForm({
			_id: new ObjectId(),
			parent: new ObjectId(id),
			title: '',
			text: ''
		})
	}))
})

// Document upserting endpoint (POST)

app.post('/documents/:id{[a-f\\d]{24}}', async (ctx) => {
	const id = ctx.req.param('id')

	try {
		const json = await ctx.req.json()

		if (typeof json.title !== 'string' || typeof json.text !== 'string')
			throw new Error('Request body must contain title and text properties')

		try {
			await documents.updateOne(
				{ _id: new ObjectId(id) },
				{
					$set: {
						parent: json.parent ? new ObjectId(json.parent) : undefined,
						title: json.title.trim().substr(0, 200),
						text: json.text.trim().substr(0, 5000),
						updatedAt: new Date()
					}
				},
				{ upsert: true }
			)

			return ctx.json({ success: true }, 200)
		} catch {
			return ctx.json({
				success: false,
				error: 'Failed to save the document'
			}, 500)
		}
	} catch {
		return ctx.json({
			success: false,
			error: 'Bad request'
		}, 400)
	}
})

// Docuement deletion endpoint (DELETE)

app.delete('/documents/:id{[a-f\\d]{24}}', async (ctx) => {
	const id = ctx.req.param('id')

	// Recursive function to delete the document and all it's children

	async function deleteDocument(id: ObjectId) {
		const children = await documents.find({ parent: id }).toArray()
		await Promise.all(children.map(child => deleteDocument(child._id)))
		await documents.deleteOne({ _id: id })
	}

	try {
		await deleteDocument(new ObjectId(id))

		return ctx.json({ success: true }, 200)
	} catch {
		return ctx.json({
			success: false,
			error: 'Failed to delete the document'
		}, 500)
	}
})

// Generative AI endpoint

app.post('/generate', async (ctx) => {
	if (ctx.req.header('Content-Type') !== 'application/json') {
		return ctx.json({ error: 'Invalid content type' }, 400)
	}

	try {
		const body = await ctx.req.json()
		const text = await generate(body)

		return ctx.json({ text })
	} catch (err) {
		return ctx.json({ error: String(err) }, 500)
	}
})

export default app