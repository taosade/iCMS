export function escapeHtml(str: string): string {
	//replace new lines with <br>

	return str.replace(/[&<>"'\n]/g, char => {
		switch (char) {
			 case '&': return '&#38;'
			 case '<': return '&#60;'
			 case '>': return '&#62;'
			 case '"': return '&#34;'
			 case "'": return '&#39;'
		}
		return '<br>'
  })
}