# QR Studio (incpage)
React + Vite + `qrcode`. QR codes are generated locally in the browser; no API, backend or account.

    npm install
    npm run dev | npm test | npm run build | npm run preview

## Customize
`src/config/qrConfig.js`: max payload, size limits, default colors/margin/ECC, logo limits, contrast threshold.

## Notes
- Static QR codes only: the payload is encoded directly. Dynamic QR codes would need a redirect backend.
- QR codes are not encrypted. Wi-Fi/contact QR codes expose their data to anyone who sees them.
- Logos are embedded locally (PNG: drawn on canvas; SVG: base64 data URI). ECC is forced to H with a logo; always test-scan.
- Calendar events use floating local time; scanner import support varies.
- Nothing is saved or sent. No payload history, no storage.

## Nginx (SPA)
    server { listen 80; root /var/www/qrstudio/dist; location / { try_files $uri /index.html; } }
Enable HTTPS with certbot (`certbot --nginx -d your.domain`).
