export function formatMoney(amount: number, currency = 'XAF') {
  return new Intl.NumberFormat('es-GQ', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-GQ', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}
