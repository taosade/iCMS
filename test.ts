import app from './app.ts'
import { assertEquals, assertStringIncludes } from '@std/assert'

// Starting the test server
Deno.serve({
	onListen() {
	  console.log('iCMS test server started')
	},
	hostname: 'localhost',
	port: 8888
}, app.fetch)

const load = async (url: string): Promise<Response> => {
	return await fetch('http://localhost:8888' + url)
}

// Testing the root route
Deno.test('GET /', async () => {
	const res = await load('/');
	const text = await res.text();

	assertEquals(res.status, 200);
	assertEquals(res.headers.get('content-type'), 'text/html; charset=utf-8')
	assertStringIncludes(text, '<!DOCTYPE html>')
})