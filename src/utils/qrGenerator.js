import QRCode from 'qrcode';
import { QR } from '../config/qrConfig.js';
import { validateAppearance } from './qrValidation.js';

const opts = (o) => ({
  width: o.size, margin: o.margin, errorCorrectionLevel: o.logo ? QR.logoEcc : o.ecc,
  color: { dark: o.fg, light: o.transparent ? '#00000000' : o.bg },
});
const check = (o) => { const e = validateAppearance(o); if (e) throw new Error(e); };
const loadImage = (src) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('Logo could not be loaded.')); i.src = src; });

/** PNG data URL. `logo` is a data URL (or null). Browser-only when a logo is used. */
export async function renderPng(payload, o) {
  check(o);
  const canvas = document.createElement('canvas');
  await QRCode.toCanvas(canvas, payload, opts(o));
  if (o.logo) {
    const img = await loadImage(o.logo);
    const box = Math.round(o.size * o.logoRatio), x = Math.round((o.size - box) / 2), pad = Math.round(box * 0.1);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = o.bg; ctx.fillRect(x - pad, x - pad, box + pad * 2, box + pad * 2);
    ctx.drawImage(img, x, x, box, box);
  }
  return canvas.toDataURL('image/png');
}

/** Self-contained SVG string. The logo is embedded as a data URI (no external refs). */
export async function renderSvg(payload, o) {
  check(o);
  let svg = await QRCode.toString(payload, { ...opts(o), type: 'svg' });
  if (o.logo) {
    const n = Number(/viewBox="0 0 (\d+) /.exec(svg)?.[1]);
    const box = n * o.logoRatio, x = (n - box) / 2, pad = box * 0.1;
    svg = svg.replace('</svg>', `<rect x="${x - pad}" y="${x - pad}" width="${box + pad * 2}" height="${box + pad * 2}" fill="${o.bg}"/><image href="${o.logo}" x="${x}" y="${x}" width="${box}" height="${box}"/></svg>`);
  }
  return svg;
}
