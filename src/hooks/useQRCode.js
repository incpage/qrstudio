import { useEffect, useMemo, useState } from 'react';
import { buildPayload } from '../utils/qrPayloads.js';
import { validateAppearance } from '../utils/qrValidation.js';
import { renderPng } from '../utils/qrGenerator.js';

/** Builds the payload, then renders a debounced PNG. Clears the preview on any error (never stale). */
export function useQRCode(type, fields, appearance) {
  const built = useMemo(() => buildPayload(type, fields), [type, fields]);
  const appErr = validateAppearance(appearance);
  const [png, setPng] = useState(null);
  const [genErr, setGenErr] = useState('');
  const key = JSON.stringify(appearance);
  useEffect(() => {
    setPng(null);
    if (!built.ok || appErr) return undefined;
    let cancelled = false;
    const t = setTimeout(async () => {
      try { const url = await renderPng(built.payload, appearance); if (!cancelled) { setPng(url); setGenErr(''); } }
      catch (e) { if (!cancelled) { setPng(null); setGenErr(e.message || 'Could not generate QR code.'); } }
    }, 200);
    return () => { cancelled = true; clearTimeout(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [built, appErr, key]);
  const hasInput = Object.values(fields).some((v) => v);
  const error = hasInput ? (built.ok ? appErr || genErr : built.error) : '';
  return { payload: built.ok ? built.payload : '', png: error ? null : png, error };
}
