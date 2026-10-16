
export const PUBLISHER_ID = 'ca-pub-1249143170747032';

const slot = (slotId, minHeight) => ({
  enabled: true,
  clientId: PUBLISHER_ID,
  slotId,
  format: 'auto',
  responsive: true,
  minHeight,
});

export const adsConfig = {
  header: slot('2880470238', 90),
  'calculator-bottom': slot('2880470238', 250),
  'results-middle': slot('2880470238', 250),
  sidebar: slot('2880470238', 600),
  footer: slot('2880470238', 90),
};
