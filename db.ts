import '@std/dotenv/load'
import { MongoClient, ObjectId } from "jsr:@db/mongo"

// Defining document schema

interface DocumentSchema {
	_id: ObjectId;
	title: string;
	content: string;
}

// Connecting to MongoDB cluster

const URI = Deno.env.get('MDBATLAS_URI')

if (!URI) {
	console.error('MDBATLAS_URI not set')

	Deno.exit(1)
}

const DBNAME = Deno.env.get('MDBATLAS_DBNAME')

if (!DBNAME) {
	console.error('MDBATLAS_DBNAME not set')

	Deno.exit(1)
}

const client = new MongoClient();

try {
	await client.connect(URI)

	client.database(DBNAME).runCommand({ ping: 1 })

	console.log('Connected to MongoDB cluster')
} catch (error) {
	console.error('Error connecting to MongoDB cluster:', error)

	Deno.exit(1)
}

const documents = client.database(DBNAME).collection<DocumentSchema>('documents')

export { documents }
export type { DocumentSchema }