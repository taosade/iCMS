import '@std/dotenv/load'
import app from './app.ts'

Deno.serve({
  onListen({ hostname, port }) {
    console.log(`iCMS running at ${hostname}:${port}`)
  },
  hostname: Deno.env.get('SERVER_HOST') || 'localhost',
  port: Number(Deno.env.get('SERVER_PORT')) || 3000
}, app.fetch)