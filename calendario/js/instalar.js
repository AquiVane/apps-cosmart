// Instalar la app en el celular (PWA). Android/Chrome: botón real de instalación; iPhone/Safari: pasos a seguir.
let promptDiferido = null;
const alRecibirPrompt = [];
addEventListener('beforeinstallprompt', e => { e.preventDefault(); promptDiferido = e; alRecibirPrompt.forEach(f => f()); });
addEventListener('appinstalled', () => { promptDiferido = null; document.getElementById('instalar-modal')?.remove(); });

const UA = navigator.userAgent || '';
export const yaInstalada = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const esIOS = () => /iPad|iPhone|iPod/.test(UA) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const esAndroid = () => /Android/.test(UA);
export const puedeInstalar = () => !yaInstalada() && (esIOS() || esAndroid() || !!promptDiferido);

const CLAVE = 'cal_install_v1';
const visto = () => { try { return !!localStorage.getItem(CLAVE); } catch (e) { return false; } };
const marcarVisto = () => { try { localStorage.setItem(CLAVE, '1'); } catch (e) {} };

export function abrirInstalar(alCerrar) {
  document.getElementById('instalar-modal')?.remove();
  const ios = esIOS();
  const pasosIOS = `
    <p class="ins-t">Si tenés iPhone (Safari):</p>
    <ol>
      <li>Abrí esta página desde <strong>Safari</strong> (solo podés descargarla desde este navegador). Podés seguir utilizándola online en cualquier otro navegador.</li>
      <li>Tocá el botón <strong>Compartir</strong> (el cuadrado con la flecha hacia arriba, abajo en el medio).</li>
      <li>Deslizá y elegí <strong>Agregar a inicio</strong>.</li>
      <li>Tocá <strong>Agregar</strong>. Listo, el ícono queda en tu pantalla.</li>
    </ol>`;
  const pasosAndroid = `
    <p class="ins-t">Si tenés Android (Chrome):</p>
    <ol>
      <li>Tocá el botón <strong>Instalar</strong>. (Si no aparece: tocá los tres puntitos ⋮ arriba a la derecha.)</li>
      <li>Elegí <strong>Instalar aplicación</strong> o <strong>Agregar a la pantalla principal</strong>.</li>
      <li>Confirmá. Va a quedar el ícono junto a tus otras apps.</li>
    </ol>`;
  const ov = document.createElement('div');
  ov.id = 'instalar-modal';
  ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-labelledby', 'ins-titulo');
  ov.style.cssText = 'position:fixed;inset:0;z-index:100001;background:rgba(6,15,34,.72);display:flex;align-items:center;justify-content:center;padding:16px;';
  ov.innerHTML = `
    <style>
      #instalar-modal .ins-card{background:#fff;color:#1e293b;border-radius:14px;max-width:420px;width:100%;max-height:calc(100vh - 32px);overflow:auto;padding:20px 18px;box-shadow:0 12px 40px rgba(0,0,0,.35);font-family:'DM Sans',system-ui,sans-serif;}
      #instalar-modal h2{margin:0 0 6px;font-size:18px;font-family:'Playfair Display',Georgia,serif;color:#0D2B6B;}
      #instalar-modal p{margin:0 0 10px;font-size:14px;line-height:1.5;color:#475569;}
      #instalar-modal .ins-t{font-weight:700;color:#0D2B6B;margin:14px 0 4px;}
      #instalar-modal ol{margin:0 0 6px;padding-left:20px;font-size:13.5px;line-height:1.5;color:#334155;}
      #instalar-modal li{margin-bottom:4px;}
      #instalar-modal .ins-btns{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;}
      #instalar-modal button{min-height:44px;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;padding:0 18px;font-family:inherit;flex:1 1 auto;}
      #instalar-modal .ins-ok{background:#F80808;color:#fff;border:none;}
      #instalar-modal button:focus-visible{outline:3px solid #8DB8FF;outline-offset:2px;}
      #instalar-modal .ins-no{background:#fff;color:#1A4DAA;border:2px solid #1A4DAA;}
    </style>
    <div class="ins-card">
      <h2 id="ins-titulo">Instalá tu calendario en el celular</h2>
      <p>Tenerlo como una app en tu pantalla de inicio es más rápido y se abre a pantalla completa.</p>
      ${ios ? pasosIOS : (esAndroid() ? pasosAndroid : '')}
      <div class="ins-btns">
        <button type="button" class="ins-ok" id="ins-instalar" style="display:none;">Instalar ahora</button>
        <button type="button" class="ins-no" id="ins-cerrar">${ios ? 'Cerrar' : 'Ahora no'}</button>
      </div>
    </div>`;
  document.body.appendChild(ov);
  const cerrar = () => { ov.remove(); marcarVisto(); if (alCerrar) alCerrar(); };
  const btn = ov.querySelector('#ins-instalar');
  const mostrarBoton = () => { if (promptDiferido && !ios) btn.style.display = ''; };
  mostrarBoton(); alRecibirPrompt.push(mostrarBoton); // si el navegador avisa un momento después, el botón aparece solo
  btn.onclick = async () => {
    if (!promptDiferido) return;
    try { promptDiferido.prompt(); await promptDiferido.userChoice; } catch (e) {}
    promptDiferido = null; cerrar();
  };
  ov.querySelector('#ins-cerrar').onclick = cerrar;
  ov.addEventListener('click', e => { if (e.target === ov) cerrar(); });
  document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape' && document.getElementById('instalar-modal')) { document.removeEventListener('keydown', esc); cerrar(); } });
  btn.style.display === '' ? btn.focus() : ov.querySelector('#ins-cerrar').focus();
}

// Primera vez que entra desde un celular (o con el navegador listo para instalar): invita. Devuelve true si mostró el cartel.
export function invitarInstalar(alCerrar) {
  if (visto() || !puedeInstalar()) return false;
  abrirInstalar(alCerrar);
  return true;
}
