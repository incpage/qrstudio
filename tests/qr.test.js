import { describe, it, expect } from 'vitest';
import { buildPayload, wifiEscape, vcardEscape } from '../src/utils/qrPayloads.js';
import { validateSize, validateLogoFile } from '../src/utils/qrValidation.js';
import { isHex } from '../src/utils/colorValidation.js';
import { renderSvg } from '../src/utils/qrGenerator.js';
import { qrFilename } from '../src/utils/filenameUtils.js';
const ap = { size: 256, margin: 4, ecc: 'M', fg: '#000000', bg: '#FFFFFF', transparent: false, logo: null, logoRatio: 0.2 };
describe('payloads', () => {
  it('url normalizes and rejects bad schemes', () => {
    expect(buildPayload('url', { url: 'example.com' }).payload).toBe('https://example.com/');
    expect(buildPayload('url', { url: 'javascript:alert(1)' }).ok).toBe(false);
    expect(buildPayload('url', { url: 'ftp://x.com' }).ok).toBe(false);
  });
  it('wifi escapes and omits password for open', () => {
    expect(wifiEscape('a;b,c:d"e\\')).toBe('a\\;b\\,c\\:d\\"e\\\\');
    expect(buildPayload('wifi', { ssid: 'Net;1', password: 'p:w', security: 'WPA' }).payload).toBe('WIFI:T:WPA;S:Net\\;1;P:p\\:w;H:false;;');
    expect(buildPayload('wifi', { ssid: 'Open', security: 'nopass' }).payload).toBe('WIFI:T:nopass;S:Open;H:false;;');
  });
  it('vcard', () => {
    expect(vcardEscape('a,b;c\nd')).toBe('a\\,b\\;c\\nd');
    const p = buildPayload('contact', { first: 'A', last: 'B', email: 'a@b.co' }).payload;
    expect(p).toContain('BEGIN:VCARD'); expect(p).toContain('EMAIL:a@b.co');
  });
  it('email/tel/sms/whatsapp/geo', () => {
    expect(buildPayload('email', { to: 'a@b.co', subject: 'Hi there' }).payload).toBe('mailto:a@b.co?subject=Hi%20there');
    expect(buildPayload('phone', { tel: '+91 12345-67890' }).payload).toBe('tel:+911234567890');
    expect(buildPayload('sms', { tel: '12345', body: 'a b' }).payload).toBe('sms:12345?body=a%20b');
    expect(buildPayload('whatsapp', { tel: '+91 12345 67890', body: 'Hi' }).payload).toBe('https://wa.me/911234567890?text=Hi');
    expect(buildPayload('location', { lat: '17.4', lon: '78.5' }).payload).toBe('geo:17.4,78.5');
    expect(buildPayload('location', { lat: '91', lon: '0' }).ok).toBe(false);
    expect(buildPayload('location', { lat: '0', lon: '181' }).ok).toBe(false);
  });
  it('event end before start rejected', () => {
    expect(buildPayload('event', { title: 'x', start: '2026-10-10T10:00', end: '2026-10-10T09:00' }).ok).toBe(false);
  });
  it('rejects empty and oversized', () => {
    expect(buildPayload('text', { text: '' }).ok).toBe(false);
    expect(buildPayload('text', { text: 'a'.repeat(5000) }).ok).toBe(false);
  });
  it('keeps unicode and multiline', () => {
    expect(buildPayload('text', { text: 'నమస్తే\nहिन्दी' }).payload).toBe('నమస్తే\nहिन्दी');
  });
});
describe('validation & export', () => {
  it('size, colors, logo', () => {
    expect(validateSize(256)).toBeNull(); expect(validateSize(10)).not.toBeNull(); expect(validateSize(1.5)).not.toBeNull();
    expect(isHex('#00ff00')).toBe(true); expect(isHex('red')).toBe(false);
    expect(validateLogoFile({ type: 'image/gif', size: 10 })).not.toBeNull();
    expect(validateLogoFile({ type: 'image/png', size: 10 ** 7 })).not.toBeNull();
  });
  it('svg is valid, colored, self-contained with logo', async () => {
    const svg = await renderSvg('https://example.com', { ...ap, fg: '#0B3558', logo: 'data:image/png;base64,AAAA' });
    expect(svg.startsWith('<?xml') || svg.startsWith('<svg')).toBe(true);
    expect(svg).toContain('#0B3558'); expect(svg).toContain('data:image/png;base64,AAAA');
  });
  it('rejects invalid appearance', async () => { await expect(renderSvg('x', { ...ap, size: 5 })).rejects.toThrow(); });
  it('filename is sanitized', () => expect(qrFilename('We/b ../x', 'png', new Date('2026-10-10'))).toBe('qr-code-we-b-x-2026-10-10.png'));
});
