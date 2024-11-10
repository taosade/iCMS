import { Document } from '../db.ts'
import { escapeHtml } from "../utils.ts";

export default function render(document: Document): string {
	return `
	<div id="document">
		<h1>${escapeHtml(document.title)}</h1>
		<h2>${new Date(document.updatedAt ?? document.createdAt).toDateString()}</h2>
		<p>${escapeHtml(document.text)}</p>
	</div>`;
}