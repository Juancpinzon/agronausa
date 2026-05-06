export function formatCOP(value: number) {
  return `COP ${value.toLocaleString("es-CO")}`;
}

export function formatDate(dateString: string | Date) {
  const d = new Date(dateString);
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(d);
}
