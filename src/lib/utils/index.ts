export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(value));
}

export function formatRMB(amount: number) {
  return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(amount);
}

export function generateApplicationNumber(counter: number) {
  return 'APP-' + new Date().getFullYear() + '-' + String(counter).padStart(4, '0');
}

export function generateTrackingToken() {
  return crypto.randomUUID();
}

export function getTimezoneFromCountry(country: string) {
  const mapping: Record<string, string> = {
    China: 'Asia/Shanghai',
    India: 'Asia/Kolkata',
    Nigeria: 'Africa/Lagos',
    Brazil: 'America/Sao_Paulo',
    Ghana: 'Africa/Accra',
  };
  return mapping[country] ?? 'Asia/Shanghai';
}
