import { useState } from 'react';
import { Download, Printer, Copy } from 'lucide-react';
import { renderSvg } from '../utils/qrGenerator.js';
import { qrFilename } from '../utils/filenameUtils.js';

function save(href, name) { const a = document.createElement('a'); a.href = href; a.download = name; a.click(); }

export default function QRCodePreview({ png, payload, error, type, appearance, typeLabel }) {
  const [status, setStatus] = useState('');
  const ready = !!png && !error;
  const downloadPng = () => { save(png, qrFilename(type, 'png')); setStatus('PNG downloaded.'); };
  const downloadSvg = async () => {
    try {
      const url = URL.createObjectURL(new Blob([await renderSvg(payload, appearance)], { type: 'image/svg+xml' }));
      save(url, qrFilename(type, 'svg')); setTimeout(() => URL.revokeObjectURL(url), 1000); setStatus('SVG downloaded.');
    } catch { setStatus('SVG export failed.'); }
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(payload); setStatus('Content copied.'); } catch { setStatus('Copy failed.'); }
  };
  return (
    <section className="card preview" id="print-area">
      <h2>3. Preview</h2>
      {ready ? (<>
        <img src={png} alt={`QR code (${typeLabel})`} className="qr" />
        <p className="hint">{typeLabel} · {appearance.size}px · ECC {appearance.logo ? 'H' : appearance.ecc}</p>
      </>) : <p className="empty">{error ? 'No preview: fix the highlighted input.' : 'Enter content to see your QR code.'}</p>}
      <div className="row noprint">
        <button className="primary" disabled={!ready} onClick={downloadPng}><Download aria-hidden="true" /> PNG</button>
        <button disabled={!ready} onClick={downloadSvg}><Download aria-hidden="true" /> SVG</button>
        <button disabled={!ready} onClick={copy}><Copy aria-hidden="true" /> Copy content</button>
        <button disabled={!ready} onClick={() => window.print()}><Printer aria-hidden="true" /> Print</button>
      </div>
      <p role="status" className="hint noprint">{status}</p>
      <p className="hint noprint">Static QR code: the data is encoded directly, so changing it means generating a new code. QR codes are not encrypted; Wi-Fi passwords and contact details are visible to anyone who scans.</p>
    </section>
  );
}
