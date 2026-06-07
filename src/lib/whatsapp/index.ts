export function generateWhatsAppLink(phone: string, templateType: string, data: Record<string, string>) {
  const parts = ['Hello from Globlearn Education,', 'I am interested in ' + templateType + '.'];
  for (const key in data) {
    parts.push(key + ': ' + data[key]);
  }
  const text = encodeURIComponent(parts.join(' '));
  return 'https://wa.me/' + phone + '?text=' + text;
}
