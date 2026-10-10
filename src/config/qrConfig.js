// Central QR defaults and limits. Edit here.
export const QR = {
  maxPayloadChars: 1500,
  sizes: { Small: 128, Medium: 256, Large: 512, 'Extra Large': 1024 },
  minSize: 64, maxSize: 2048, defaultSize: 512,
  defaultMargin: 4, minSafeMargin: 2,
  defaultEcc: 'M', logoEcc: 'H',
  defaultFg: '#000000', defaultBg: '#FFFFFF',
  maxLogoBytes: 512 * 1024, logoTypes: ['image/png', 'image/jpeg', 'image/webp'],
  defaultLogoRatio: 0.2, maxLogoRatio: 0.3,
  minContrast: 3,
};
export const TYPES = {
  url: { label: 'Website URL', fields: [['url', 'Website URL', 'https://example.com']] },
  text: { label: 'Text', fields: [['text', 'Text', '', 'area']] },
  wifi: { label: 'Wi-Fi', fields: [['ssid', 'Network name (SSID)'], ['password', 'Password', '', 'password'], ['security', 'Security', '', 'select', ['WPA', 'WEP', 'nopass']], ['hidden', 'Hidden network', '', 'check']] },
  contact: { label: 'Contact (vCard)', fields: [['first', 'First name'], ['last', 'Last name'], ['org', 'Organization'], ['title', 'Job title'], ['tel', 'Telephone'], ['email', 'Email'], ['website', 'Website'], ['street', 'Street'], ['city', 'City'], ['region', 'Region'], ['zip', 'Postal code'], ['country', 'Country']] },
  email: { label: 'Email', fields: [['to', 'Email address'], ['subject', 'Subject'], ['body', 'Message', '', 'area']] },
  phone: { label: 'Phone', fields: [['tel', 'Telephone number', '+911234567890']] },
  sms: { label: 'SMS', fields: [['tel', 'Telephone number'], ['body', 'Message', '', 'area']] },
  whatsapp: { label: 'WhatsApp', fields: [['tel', 'Number with country code', '911234567890'], ['body', 'Prefilled message', '', 'area']] },
  event: { label: 'Calendar event', fields: [['title', 'Event title'], ['start', 'Start', '', 'datetime-local'], ['end', 'End', '', 'datetime-local'], ['location', 'Location'], ['desc', 'Description', '', 'area']] },
  location: { label: 'Location', fields: [['lat', 'Latitude', '17.385'], ['lon', 'Longitude', '78.4867'], ['label', 'Label']] },
  custom: { label: 'Custom content', fields: [['raw', 'Raw payload (opens apps when scanned)', '', 'area']] },
};
