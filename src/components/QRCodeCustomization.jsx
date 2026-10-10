import { QR } from '../config/qrConfig.js';
import { isHex, contrastWarnings } from '../utils/colorValidation.js';
import LogoUploader from './LogoUploader.jsx';

function ColorField({ label, value, onChange, def }) {
  return (
    <div className="row">
      <label>{label} <input type="color" value={isHex(value) ? value : def} onChange={(e) => onChange(e.target.value)} /></label>
      <input aria-label={`${label} hex`} type="text" value={value} maxLength={7} onChange={(e) => onChange(e.target.value)} aria-invalid={!isHex(value)} />
      <button type="button" onClick={() => onChange(def)}>Reset</button>
      {!isHex(value) && <span role="alert" className="error">Invalid hex</span>}
    </div>
  );
}
export default function QRCodeCustomization({ a, set }) {
  const warns = contrastWarnings(a.fg, a.bg);
  if (a.margin < QR.minSafeMargin) warns.push('A small quiet zone can make scanning unreliable.');
  return (
    <section className="card">
      <h2>2. Appearance</h2>
      <label htmlFor="size">Size (px)</label>
      <div className="row">
        <select aria-label="Size preset" value={Object.values(QR.sizes).includes(a.size) ? a.size : ''} onChange={(e) => e.target.value && set({ size: Number(e.target.value) })}>
          <option value="">Custom</option>
          {Object.entries(QR.sizes).map(([k, v]) => <option key={k} value={v}>{k} ({v})</option>)}
        </select>
        <input id="size" type="number" step="1" min={QR.minSize} max={QR.maxSize} value={Number.isNaN(a.size) ? '' : a.size} onChange={(e) => set({ size: e.target.value === '' ? NaN : Number(e.target.value) })} />
      </div>
      <ColorField label="Foreground" value={a.fg} def={QR.defaultFg} onChange={(fg) => set({ fg })} />
      <ColorField label="Background" value={a.bg} def={QR.defaultBg} onChange={(bg) => set({ bg })} />
      <label className="check"><input type="checkbox" checked={a.transparent} onChange={(e) => set({ transparent: e.target.checked })} />Transparent background (PNG/SVG; preview shows a checkerboard)</label>
      <label htmlFor="ecc">Error correction</label>
      <select id="ecc" value={a.ecc} onChange={(e) => set({ ecc: e.target.value })} disabled={!!a.logo}>
        <option value="L">Low (~7%)</option><option value="M">Medium (~15%)</option><option value="Q">Quartile (~25%)</option><option value="H">High (~30%)</option>
      </select>
      <p className="hint">Approximate recovery figures, not guarantees. Higher levels make denser codes.</p>
      <label htmlFor="margin">Quiet zone (modules): {a.margin}</label>
      <input id="margin" type="range" min="0" max="10" value={a.margin} onChange={(e) => set({ margin: Number(e.target.value) })} />
      <LogoUploader logo={a.logo} ratio={a.logoRatio} onLogo={(logo) => set({ logo })} onRatio={(logoRatio) => set({ logoRatio })} />
      {warns.map((w) => <p key={w} role="status" className="warn">⚠ {w}</p>)}
    </section>
  );
}
