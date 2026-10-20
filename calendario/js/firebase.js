// ══════════════════════════════════════════════════════════════
//  Calendario de contenidos -- configuración del backend
//  El backend vive en cosmart-training-core (rutas /api/apps/*).
// ══════════════════════════════════════════════════════════════
const EN_LOCAL = ['localhost', '127.0.0.1'].includes(window.location.hostname);
// Solo en desarrollo local se puede apuntar a otro backend: localStorage.setItem('cal_api_dev', 'http://localhost:8790')
let _dev = null;
try { _dev = EN_LOCAL ? localStorage.getItem('cal_api_dev') : null; } catch (e) {}
export const WORKER_URL = _dev || 'https://cosmart-training-core.conglomeradocosmart.workers.dev';
export const DEMO_MODE = false;

// Claves PÚBLICAS de los medios de pago (las mismas del carrito de Training). Los secrets viven en el worker de MP.
export const MP_PUBLIC_KEY = 'APP_USR-057d290b-5af9-4b00-8a08-6753dc47aec4';
export const PAYPAL_CLIENT_ID = 'AYuQX3JJShvSkgNn0C195h3GEHGiKNtx44X3wd_5PEoBI1iinpysmDzNRqdZ7blNuZvFWIwcwhc9qiOP';
