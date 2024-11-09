export function escapeHtml(str: string): string {
	return str.replace(/[&<>"']/g, char => {
		switch (char) {
			 case '&': return '&#38;'
			 case '<': return '&#60;'
			 case '>': return '&#62;'
			 case '"': return '&#34;'
		}
		return '&#39;'
  })
}