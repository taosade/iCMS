import { Document } from '../db.ts'
import { escapeHtml } from "../utils.ts";

export default function render(document: Document): string {
	return `
	<div id="form">
		<div id="ai-bar">
			<div id="ai-bar-header">
				<div>
					<i class="fa fa-magic"></i>
					Generative AI
				</div>
				<div>
					<i id="ai-bar-header-chevron" class="fa fa-chevron-down"></i>
				</div>
			</div>
			<div id="ai-bar-form">
				<div>Prompt</div>
				<div>
					<input id="input-prompt" type="text">
				</div>
				<div>Keywords</div>
				<div>
					<input id="input-keywords" type="text">
				</div>
				<div>Model</div>
				<div>
					<div>
						<select id="input-model">
							<option value="gpt-3.5-turbo">GPT 3.5 Turbo</option>
							<option value="gpt-4">GPT 4</option>
							<option value="gpt-4-turbo">GPT 4 Turbo</option>
							<option value="gpt-4o">GPT 4o</option>
							<option value="gpt-4o-mini" selected>GPT 4o Mini</option>
						</select>
					</div>
					<div>Volume</div>
					<div>
						<select id="input-volume">
							<option value="50">50 words</option>
							<option value="100">100 words</option>
							<option value="200">200 words</option>
							<option value="300">300 words</option>
							<option value="400">400 words</option>
							<option value="500">500 words</option>
						</select>
					</div>
					<div>
						<button id="ai-bar-form-submit">
							<i class="fa fa-fw fa-play-circle"></i>
							Generate
						</button>
					</div>
				</div>
			</div>
		</div>
		<input id="input-title" type="text" placeholder="Title" maxlength="200" value="${document ? escapeHtml(document.title) : ''}">
		<textarea id="input-text" maxlength="5000">${document ? escapeHtml(document.text) : ''}</textarea>
		<button id="document-form-submit">
			<i class="fa fa-fw fa-save"></i>
			Save
		</button>
	</div>
	<script defer>

	// Toggling generative AI form visibility

	document.getElementById('ai-bar-header').addEventListener('click', function () {
		const form = document.getElementById('ai-bar-form')
		const computedStyle = window.getComputedStyle(form)
		const chevron = document.getElementById('ai-bar-header-chevron')
		if (computedStyle.display === 'none') {
			form.style.display = 'grid'
			chevron.className = 'fa fa-chevron-up'
		} else {
			form.style.display = 'none'
			chevron.className = 'fa fa-chevron-down'
		}
	})

	// Submitting generative AI form

	document.getElementById('ai-bar-form-submit').addEventListener('click', async function () {
		const button = document.getElementById('ai-bar-form-submit')
		button.disabled = true

		const buttonIcon = button.getElementsByTagName('i')[0]
		buttonIcon.className = 'fa fa-fw fa-spinner fa-spin'

		function resetButton() {
			button.disabled = false
			buttonIcon.className = 'fa fa-fw fa-play-circle'
		}

		const res = await fetch('/generate', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				prompt: document.getElementById('input-prompt').value.substr(0, 200),
				keywords: document.getElementById('input-keywords').value.substr(0, 200),
				model: document.getElementById('input-model').value,
				volume: document.getElementById('input-volume').value,
				text: document.getElementById('input-text').value.substr(0, 5000)
			})
		})

		if (res.status !== 200) {
			resetButton()
			console.error('Failed to retrieve generated text')
			return
		}

		const data = await res.json()

		if (typeof data.text !== 'string' || !data.text.length) {
			resetButton()
			console.error('Invalid response')
			return
		}

		const textArea = document.getElementById('input-text')

		textArea.value = textArea.value.trim()

		if (textArea.value.trim().length) {
			textArea.value += '\\n\\n'
		}

		// Imitating typing of generated text

		let index = 0

		const interval = setInterval(function () {
			textArea.value += data.text[index]
			if (++index >= data.text.length) {
				resetButton()
				clearInterval(interval)
			}
		}, 5)
	})

	// Submitting the document form

	document.getElementById('document-form-submit').addEventListener('click', async function () {
		const button = document.getElementById('document-form-submit')
		button.disabled = true

		const buttonIcon = button.getElementsByTagName('i')[0]
		buttonIcon.className = 'fa fa-fw fa-spinner fa-spin'

		function resetButton() {
			button.disabled = false
			buttonIcon.className = 'fa fa-fw fa-save'
		}

		if (!document.getElementById('input-title').value.trim().length) {
			resetButton()
			alert('Please provide document title')
			return
		}

		if (!document.getElementById('input-text').value.trim().length) {
			resetButton()
			alert('Please provide docuemnt text')
			return
		}

		const res = await fetch('/documents/${document._id}', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				${document.parent ? `parent: '${document.parent.toString()}',` : ''}
				title: document.getElementById('input-title').value.substr(0, 200),
				text: document.getElementById('input-text').value.substr(0, 2000)
			})
		})

		if (res.status !== 200) {
			resetButton()
			alert('Failed to save the document')
			return
		}

		window.location.href = '/documents/${document._id}'
	})

	</script>`;
}