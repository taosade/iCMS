// Document deletion confirmation

function confirmDeletion(id) {
	if (confirm('Are you sure you want to delete this document?'))
		window.location.href = `/${id}/delete`;
}