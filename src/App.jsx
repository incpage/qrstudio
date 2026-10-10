import { useState } from 'react';
import { TYPES, QR } from './config/qrConfig.js';
import { useQRCode } from './hooks/useQRCode.js';
import QRContentForm from './components/QRContentForm.jsx';
import QRCodeCustomization from './components/QRCodeCustomization.jsx';
import QRCodePreview from './components/QRCodePreview.jsx';

const defaults = { size: QR.defaultSize, margin: QR.defaultMargin, ecc: QR.defaultEcc, fg: QR.defaultFg, bg: QR.defaultBg, transparent: false, logo: null, logoRatio: QR.defaultLogoRatio };

export default function App() {
  const [type, setType] = useState('url');
  const [fields, setFields] = useState({});
  const [a, setA] = useState(defaults);
  const { payload, png, error } = useQRCode(type, fields, a);
  const changeType = (t) => { setType(t); setFields({}); }; // never carry stale fields across types
  return (
    <div className="app">
      <header><img src="/logo.jpeg" alt="incpage" height="44" /><span className="brand">QR Studio</span></header>
      <main className="grid">
        <div className="col">
          <QRContentForm type={type} fields={fields} onType={changeType} onField={(k, v) => setFields((f) => ({ ...f, [k]: v }))} error={error && !png ? error : ''} />
          <QRCodeCustomization a={a} set={(p) => setA((x) => ({ ...x, ...p }))} />
        </div>
        <QRCodePreview png={png} payload={payload} error={error} type={type} typeLabel={TYPES[type].label} appearance={a} />
      </main>
      <footer>Generated locally in your browser. Nothing you enter is sent anywhere or saved.</footer>
    </div>
  );
}
