import renderTreeBranch from './docTree.ts'

export default async function render(data?: { content?: string }): Promise<string> {

	// Render document tree in the sidebar

	const sidebar = await renderTreeBranch()

	return `
	<!DOCTYPE html>
	<html>
		<head>
			<title>iCMS</title>
			<link rel="stylesheet" type="text/css" href="/static/style.css">
			<link rel="stylesheet" type="text/css" href="/static/fontawesome.css"/>
			<script src="/static/script.js" defer></script>
		</head>
		<body>
			<div id="header">
				<div>
					<i class="fa fa-book"></i>
					iCMS
				</div>
				<div>
					<p>generative ai powered</p>
					<p>content management system</p>
				</div>
				<div>
					<p>
						<i class="fa fa-fw fa-university"></i>
						UEHS, Warsaw 2024
					</p>
					<p>
						<i class="fa fa-fw fa-user"></i>
						Mikhail Melikhov
					</p>
					<p>
						<i class="fa fa-fw fa-graduation-cap"></i>
						Marcin Kacprowicz
					</p>
				</div>
			</div>
			<div id="main">
				<div id="sidebar">
					<a href="/create"><i class="fa fa-fw fa-plus-square-o"></i>New document</a>
					${sidebar}
				</div>
				${data?.content ? `<div id="content">${data.content}</div>` : ''}
			</div>
		</div>
	</html>`;
}