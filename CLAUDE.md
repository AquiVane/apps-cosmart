# Instrucciones para Claude Code en este repo

Este repo (`AquiVane/apps-cosmart` (repo PÚBLICO: nunca van secretos; las claves públicas de MP/PayPal del navegador son las únicas permitidas)) es el frontend de **apps.cosmart.com.ar**: apps de COSMART para emprendedores, organizadas por categorías (Organización, Productividad, etc.). Trabajás para Vaneh (COSMART).

## Al empezar cualquier sesión

Leé **`HANDOFF.md`** (raíz) ANTES de tocar código. Tiene lo ya decidido, lo pendiente real y los errores concretos para no repetir. No le preguntes a Vaneh lo que ya está contestado ahí. Al terminar la sesión, actualizalo vos mismo.

## Reglas duras (pedidos explícitos de Vaneh)

- Vaneh se comunica **solo en español rioplatense**. Nunca respondas en inglés.
- **Nunca hagas cambios no pedidos.** Si algo te parece mejorable, preguntá antes.
- **Los textos van primero al chat para que ella los apruebe**, antes de implementarlos.
- **Mobile primero, siempre.** Nada puede sobresalir del ancho de la pantalla ni arrastrarse de costado. Controles finos y delicados (campos de fecha 26–30 px), nunca altos. En iPhone/Safari el `<input type=date>` se sale del borde si no se le saca `appearance` y se lo clava al ancho del contenedor (ver `css/style.css`, final del archivo).
- **Cuidado con el orden del CSS**: una regla base (`display:none`) escrita DEBAJO de un `@media` lo pisa. Los overrides móviles van al final.
- **Sin emojis de sistema.** Íconos de línea (lucide): azul o rojo sobre fondo claro, blanco sobre fondo oscuro/azul/rojo.
- **Colores**: rojo COSMART brillante `#F80808` para botones de acción; menú lateral en rojo carmín más profundo con TODO en blanco (textos, íconos, bordes); azul COSMART `#1A4DAA` para pestañas con letras blancas. Nada de naranja. En modo oscuro, el menú va burdeos rosado.
- Revisar que todos los botones funcionen. Optimizar tokens.
- Cada app con marca propia necesita su propio AI Operating System (ver CLAUDE.md de `training`); las de COSMART usan el de COSMART.
- Pagos: siempre vía `mp-productos-ganadores` (ver `cosmart-workers`), checkout embebido, nunca sacar a la persona del sitio.
- **Apps independientes (regla de Vaneh, 20/10/2026):** cada app nueva es 100 % independiente de las demás: cuentas, sesiones, datos y accesos propios, sin relación con ninguna otra app ni con Training/Academy. La única excepción es lo que vive DENTRO de Training (cursos, ebooks, etc.): ahí los productos se van sumando a la misma cuenta porque son una sola plataforma. Una persona que compra solo una app no tiene acceso a nada más de COSMART. Implementación de referencia: Calendario (`appuser:<mail>` en USERS y sesión `apps:<mail>` en `cosmart-training-core`). El mismo mail puede existir en dos apps distintas.

- **Checkout: el pago carga apenas abre la página (regla de Vaneh, 21/10/2026).** El Brick de Mercado Pago y los botones de PayPal se arman al cargar la página, nunca al hacer scroll ni después de escribir el email/nombre: al llegar abajo ya tienen que estar listos. El email/nombre se validan recién al pagar (en `onSubmit` / `onClick`), y escribir datos NO vuelve a armar el Brick. Pedir SDK y preferencia en paralelo lo antes posible (ver `habitos/index.html` de BienSmart y `js/checkout-robusto.js`).
