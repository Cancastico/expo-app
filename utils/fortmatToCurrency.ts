export default function formatToCurrency(value: number | null | undefined): string {
  if (value == null) return '0,00';
  return value.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

