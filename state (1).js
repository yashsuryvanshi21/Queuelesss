/**
 * QueueLess — shared state via localStorage
 * All pages read/write from the same key so they stay in sync.
 */

const QL_KEY = 'queueless_state';

function getState() {
  try {
    const raw = localStorage.getItem(QL_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return {
    queue: [],
    current: null,
    nextTok: 1,
    served: 0,
    adminIn: false
  };
}

function saveState(s) {
  try { localStorage.setItem(QL_KEY, JSON.stringify(s)); } catch(e) {}
}

function clearState() {
  const fresh = { queue:[], current:null, nextTok:1, served:0, adminIn:false };
  saveState(fresh);
  return fresh;
}

/* Listen for changes from other tabs */
function onStateChange(cb) {
  window.addEventListener('storage', e => {
    if (e.key === QL_KEY) cb(getState());
  });
}

/* Helpers */
function nowTime() {
  const d = new Date();
  return d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
}

const AVG_MINS = 3;

function buildQR(el, text, size) {
  if (!el || typeof QRCode === 'undefined') return;
  el.innerHTML = '';
  try {
    new QRCode(el, {
      text, width: size, height: size,
      colorDark: '#042C53', colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
  } catch(e) {
    el.innerHTML = `<div style="font-size:10px;color:#8EA8C3;padding:8px;text-align:center;">QR</div>`;
  }
}

function tokenQRText(t) { return 'QUEUELESS-TOKEN-' + t; }
