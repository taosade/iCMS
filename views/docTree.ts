import { documents } from '../db.ts'
import { escapeHtml } from "../utils.ts"
import { ObjectId } from '@db/mongo'

export default async function render(parent?: ObjectId): Promise<string> {

	// Getting all the documents that are children of the current parent

	const data = await documents.find(
		parent ? { parent } : { parent: { $exists: false } },
		{ projection: { _id: 1, title: 1 } }
	).sort({ title: 1 }).toArray()

	if (!data.length)
		return ''

	// Getting all the children in parallel

	const children = await Promise.all(data.map(document => render(document._id)))

	// Rendering the current level with children

	return data.map((document, i) => `
	<div class="tree-branch">
		<div class="tree-header">
			<i class="fa fa-fw ${children[i].length ? 'fa-folder-o' : 'fa-file-text-o'}"></i>
			<a href="/documents/${document._id.toString()}">${escapeHtml(document.title)}</a>
			<div class="buttons">
				<a href="/documents/${document._id.toString()}/edit"><i class="fa fa-pencil"></i></a>
				<a href="/documents/${document._id.toString()}/create"><i class="fa fa-plus-circle"></i></a>
				<a href="#" onclick="deleteDocument('${document._id.toString()}');return false;"><i class="fa fa-trash"></i></a>
			</div>
		</div>
		${children[i]}
	</div>`).join('').concat(`
	<script>
	async function deleteDocument(id) {
		if (!confirm('Are you sure you want to delete this document and all it\\'s children?'))
			return

		const res = await fetch(\`/documents/\${id}\`, { method: 'DELETE' })

		if (res.status !== 200) {
			alert('Failed to delete the document')
			return
		}

		window.location.reload()
	}
	</script>`)
}