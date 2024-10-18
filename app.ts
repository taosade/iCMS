import { Hono } from '@hono/hono'
import { serveStatic } from '@hono/hono/deno'

const app = new Hono()

// Main UI layout
app.get('/', serveStatic({ path: 'static/layout.html' }))

// Static assets
app.get('/static/*', serveStatic({ root: './' }))

export default app