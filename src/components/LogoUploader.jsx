import { useState } from 'react';
import { validateLogoFile } from '../utils/qrValidation.js';
import { QR } from '../config/qrConfig.js';

export default function LogoUploader({ logo, ratio, onLogo, onRatio }) {
  const [err, setErr] = useState('');
  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const bad = validateLogoFile(file);
    if (bad) { setErr(bad); return; }
    const r = new FileReader();
    r.onload = () => { setErr(''); onLogo(r.result); };
    r.onerror = () => setErr('Could not read the image.');
    r.readAsDataURL(file);
  };
  return (
    <fieldset>
      <legend>Logo (optional)</legend>
      <input type="file" accept={QR.logoTypes.join(',')} onChange={onFile} aria-label="Upload logo" />
      {logo && (<>
        <label>Logo size: {Math.round(ratio * 100)}%
          <input type="range" min="0.1" max={QR.maxLogoRatio} step="0.01" value={ratio} onChange={(e) => onRatio(Number(e.target.value))} />
        </label>
        <button type="button" onClick={() => onLogo(null)}>Remove logo</button>
        <p className="hint">Error correction is raised to H. A logo can still make a code unreadable: always test-scan it.</p>
      </>)}
      {err && <p role="alert" className="error">{err}</p>}
    </fieldset>
  );
}
