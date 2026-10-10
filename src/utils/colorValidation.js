import { QR } from '../config/qrConfig.js';
export const isHex = (c) => /^#[0-9a-fA-F]{6}$/.test(c);
const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export function contrastRatio(a, b) {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
/** Returns warning strings (empty if fine). */
export function contrastWarnings(fg, bg) {
  const w = [];
  if (!isHex(fg) || !isHex(bg)) return w;
  if (contrastRatio(fg, bg) < QR.minContrast) w.push('Low contrast: this QR code may be hard to scan.');
  if (lum(fg) > lum(bg)) w.push('Light-on-dark (inverted) codes are not read by all scanners.');
  return w;
}
