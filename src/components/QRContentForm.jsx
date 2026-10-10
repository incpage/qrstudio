import { TYPES } from '../config/qrConfig.js';

export default function QRContentForm({ type, fields, onType, onField, error }) {
  return (
    <section className="card">
      <h2>1. Content</h2>
      <div role="tablist" aria-label="QR type" className="tabs">
        {Object.entries(TYPES).map(([k, t]) => (
          <button key={k} role="tab" aria-selected={k === type} className={k === type ? 'tab on' : 'tab'} onClick={() => onType(k)}>{t.label}</button>
        ))}
      </div>
      {TYPES[type].fields.map(([name, label, ph, kind, options]) => {
        const id = `f-${type}-${name}`;
        const v = fields[name] ?? '';
        if (kind === 'check') return <label key={name} className="check"><input type="checkbox" checked={!!fields[name]} onChange={(e) => onField(name, e.target.checked)} />{label}</label>;
        return (
          <div key={name}>
            <label htmlFor={id}>{label}</label>
            {kind === 'area' ? <textarea id={id} rows="3" value={v} placeholder={ph} onChange={(e) => onField(name, e.target.value)} />
              : kind === 'select' ? <select id={id} value={v || options[0]} onChange={(e) => onField(name, e.target.value)}>{options.map((o) => <option key={o}>{o}</option>)}</select>
              : <input id={id} type={kind || 'text'} value={v} placeholder={ph} onChange={(e) => onField(name, e.target.value)} />}
          </div>
        );
      })}
      {error && <p role="alert" className="error">{error}</p>}
    </section>
  );
}
