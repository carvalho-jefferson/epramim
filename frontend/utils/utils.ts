export function atLeastOne(a: unknown, b: unknown) {
  return a != null && a !== '' || b != null && b !== ''
}

export function formatBRL(value: number | string | null): string {
  if (value === null || value === undefined) return '—'
  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

