import { QR } from '../config/qrConfig.js';
import { isHex } from './colorValidation.js';
export const validateSize = (n) => (Number.isInteger(n) && n >= QR.minSize && n <= QR.maxSize ? null : `Size must be a whole number from ${QR.minSize} to ${QR.maxSize}.`);
export const validatePayloadLength = (p) => (p.length > QR.maxPayloadChars ? `Content is too long (${p.length}/${QR.maxPayloadChars}). Shorten it or use a shorter URL.` : null);
export const validateEcc = (e) => (['L', 'M', 'Q', 'H'].includes(e) ? null : 'Invalid error correction level.');
export function validateAppearance({ size, fg, bg, ecc }) {
  if (!isHex(fg) || !isHex(bg)) return 'Colors must be hex values like #000000.';
  return validateSize(size) || validateEcc(ecc);
}
export function validateLogoFile(file) {
  if (!QR.logoTypes.includes(file.type)) return 'Logo must be PNG, JPEG or WebP.';
  if (file.size > QR.maxLogoBytes) return `Logo must be under ${Math.round(QR.maxLogoBytes / 1024)} KB.`;
  return null;
}
