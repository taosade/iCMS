export default function render(data: {
	content?: string;
	sidebar?: string;
}) { return `
<!DOCTYPE html>
<html>
	<head>
		<title>iCMS</title>
		<link rel="stylesheet" type="text/css" href="static/style.css">
		<link rel="stylesheet" type="text/css" href="static/fontawesome.css"/>
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
			${data.sidebar ? `<div id="sidebar">${data.sidebar}</div>` : ''}
			${data.content ? `<div id="content">${data.content}</div>` : ''}
		</div>
	</div>
</html>`;
}