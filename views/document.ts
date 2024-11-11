import { Document } from '../db.ts'
import { escapeHtml, htmlLineBreaks } from "../utils.ts";

export default function render(document: Document): string {
	return `
	<div id="document">
		<h1>${escapeHtml(document.title)}</h1>
		${document.updatedAt ? `<h2>${new Date(document.updatedAt).toDateString()}</h2>` : ''}
		<p>${htmlLineBreaks(escapeHtml(document.text))}</p>
	</div>`;
}