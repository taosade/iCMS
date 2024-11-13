import '@std/dotenv/load'
import { MongoClient, ObjectId } from 'jsr:@db/mongo'

// Defining document schema

type Document = {
	_id: ObjectId;
	parent?: ObjectId;
	title: string;
	text: string;
	updatedAt?: Date;
}

// Connecting to MongoDB Atlas

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

const client = new MongoClient()

try {
	await client.connect(URI)

	client.database(DBNAME).runCommand({ ping: 1 })

	console.log('Connected to MongoDB Atlas')
} catch (error) {
	console.error('Error connecting to MongoDB Atlas:', error)

	Deno.exit(1)
}

const documents = client.database(DBNAME).collection<Document>('documents')

export { documents }
export type { Document }