import { validatePayloadLength } from './qrValidation.js';
const ok = (payload) => { const e = validatePayloadLength(payload); return e ? { ok: false, error: e } : { ok: true, payload }; };
const fail = (error) => ({ ok: false, error });
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const s = (v) => (v ?? '').toString();

// Wi-Fi format: WIFI:T:<type>;S:<ssid>;P:<pw>;H:<bool>;;  Escape \ ; , : "
export const wifiEscape = (v) => v.replace(/([\\;,:"])/g, '\\$1');
// vCard 3.0 text escaping: backslash, newline, comma, semicolon
export const vcardEscape = (v) => v.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/([;,])/g, '\\$1');

export function normalizeUrl(input) {
  const v = s(input).trim();
  if (!v) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(v) ? v : /^[^\s/]+\.[^\s/]+/.test(v) ? `https://${v}` : null;
  if (!withScheme) return null;
  try { const u = new URL(withScheme); return ['http:', 'https:'].includes(u.protocol) ? u.href : null; } catch { return null; }
}
const digits = (v) => s(v).replace(/[^\d]/g, '');
const telOf = (v) => { const t = s(v).trim(); return /^\+?[\d\s().-]{5,20}$/.test(t) ? (t.startsWith('+') ? '+' : '') + digits(t) : null; };
const icsDate = (v) => s(v).replace(/[-:]/g, '').slice(0, 15).padEnd(15, '0');
const icsEscape = (v) => v.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/([;,])/g, '\\$1');

export function buildPayload(type, f) {
  switch (type) {
    case 'url': { const u = normalizeUrl(f.url); return u ? ok(u) : fail('Enter a valid http(s) URL.'); }
    case 'text': return s(f.text) ? ok(s(f.text)) : fail('Enter some text.');
    case 'custom': return s(f.raw) ? ok(s(f.raw)) : fail('Enter content.');
    case 'wifi': {
      if (!s(f.ssid)) return fail('Network name is required.');
      const sec = f.security || 'WPA';
      if (sec !== 'nopass' && !s(f.password)) return fail('Password is required for secured networks.');
      const pw = sec === 'nopass' ? '' : `P:${wifiEscape(s(f.password))};`;
      return ok(`WIFI:T:${sec};S:${wifiEscape(s(f.ssid))};${pw}H:${f.hidden ? 'true' : 'false'};;`);
    }
    case 'contact': {
      if (!s(f.first) && !s(f.last) && !s(f.org)) return fail('Enter a name or organization.');
      if (f.email && !EMAIL.test(f.email)) return fail('Invalid email address.');
      const L = ['BEGIN:VCARD', 'VERSION:3.0', `N:${vcardEscape(s(f.last))};${vcardEscape(s(f.first))};;;`, `FN:${vcardEscape(`${s(f.first)} ${s(f.last)}`.trim() || s(f.org))}`];
      if (f.org) L.push(`ORG:${vcardEscape(f.org)}`);
      if (f.title) L.push(`TITLE:${vcardEscape(f.title)}`);
      if (f.tel) L.push(`TEL:${vcardEscape(f.tel)}`);
      if (f.email) L.push(`EMAIL:${vcardEscape(f.email)}`);
      if (f.website) L.push(`URL:${f.website}`);
      if (f.street || f.city || f.region || f.zip || f.country) L.push(`ADR:;;${['street', 'city', 'region', 'zip', 'country'].map((k) => vcardEscape(s(f[k]))).join(';')}`);
      L.push('END:VCARD');
      return ok(L.join('\r\n'));
    }
    case 'email': {
      const to = s(f.to).trim();
      if (!EMAIL.test(to)) return fail('Enter a valid email address.');
      const q = [f.subject && `subject=${encodeURIComponent(f.subject)}`, f.body && `body=${encodeURIComponent(f.body)}`].filter(Boolean).join('&');
      return ok(`mailto:${to}${q ? `?${q}` : ''}`);
    }
    case 'phone': { const t = telOf(f.tel); return t ? ok(`tel:${t}`) : fail('Enter a valid telephone number.'); }
    case 'sms': { const t = telOf(f.tel); return t ? ok(`sms:${t}${f.body ? `?body=${encodeURIComponent(f.body)}` : ''}`) : fail('Enter a valid telephone number.'); }
    case 'whatsapp': {
      const d = digits(f.tel);
      if (d.length < 8 || d.length > 15) return fail('Enter the number with country code (8–15 digits).');
      return ok(`https://wa.me/${d}${f.body ? `?text=${encodeURIComponent(f.body)}` : ''}`);
    }
    case 'event': {
      if (!s(f.title)) return fail('Event title is required.');
      if (!f.start || !f.end || Number.isNaN(Date.parse(f.start)) || Number.isNaN(Date.parse(f.end))) return fail('Enter valid start and end times.');
      if (Date.parse(f.end) < Date.parse(f.start)) return fail('End time cannot be earlier than start time.');
      // Floating local time (no timezone); scanner support for importing varies.
      const L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT', `SUMMARY:${icsEscape(f.title)}`, `DTSTART:${icsDate(f.start)}`, `DTEND:${icsDate(f.end)}`];
      if (f.location) L.push(`LOCATION:${icsEscape(f.location)}`);
      if (f.desc) L.push(`DESCRIPTION:${icsEscape(f.desc)}`);
      L.push('END:VEVENT', 'END:VCALENDAR');
      return ok(L.join('\r\n'));
    }
    case 'location': {
      const lat = Number(f.lat), lon = Number(f.lon);
      if (s(f.lat).trim() === '' || s(f.lon).trim() === '' || !(lat >= -90 && lat <= 90)) return fail('Latitude must be between -90 and 90.');
      if (!(lon >= -180 && lon <= 180)) return fail('Longitude must be between -180 and 180.');
      return ok(`geo:${lat},${lon}${f.label ? `?q=${lat},${lon}(${encodeURIComponent(f.label)})` : ''}`);
    }
    default: return fail('Unsupported QR type.');
  }
}
