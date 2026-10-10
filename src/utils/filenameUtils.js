export function qrFilename(type, ext, date = new Date()) {
  const safe = String(type).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '') || 'qr';
  return `qr-code-${safe}-${date.toISOString().slice(0, 10)}.${ext}`;
}
