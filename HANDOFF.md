# HANDOFF — apps (apps.cosmart.com.ar)

Actualizado: 2026-10-18.

## Qué es
Repo de las apps de COSMART para emprendedores. Cada app vive en su carpeta (`calendario/`, y más adelante el planner, etc.) y el sitio tendrá un catálogo por categorías (Organización, Productividad...). Dominio previsto: `apps.cosmart.com.ar` (Cloudflare Pages; DNS/proyecto Pages los configura Vaneh o se pide autorización explícita).

## App 1: Calendario de contenidos (`calendario/`)
Se armó recortando el panel de cliente del Hub (`AquiVane/hub`, `app/index.html` + `js/app.js` + `js/data.js` + `css/style.css`). Trae: Banco de contenidos (lista por defecto, importar/exportar Excel + plantilla), Calendario, Banco de ideas (con links de referencia clickeables), Métricas por mes con gráficos, Archivados (archivar mes completo y restaurar), Guiones con teleprompter, Dashboard (sin tareas, sin voz con IA), Mis cuentas (se cargan una vez y el formulario las trae), Cómo se usa + recorrido inicial.
Se SACÓ a propósito: Asignar a, menciones/mails en comentarios, tareas, pauta, sitio web, reportes, Puertos COSMART.
Menú lateral: "Más para tu negocio" con tarjetas de venta (Plata en Orden `academy.vamatienda.com.ar/plata-en-orden/`, Productos Ganadores, IA para Emprendedores, Estrategia de Contenido 2026/27, Planner "Próximamente") y tarjeta destacada "Aprendé marketing con Vane" -> lista de espera `training.cosmart.com.ar/cursos/capacitacion-marketing/proximamente` (no manda mails).

### ESTADO (18/10): frontend conectado al backend real, SIN desplegar
El frontend ya habla con `cosmart-training-core` (`/api/apps/*`, ver `cosmart-workers/HANDOFF.md`, entrada 18/10). **No hay modo demo ni seed**: `js/firebase.js` apunta al worker real.
- **Pantallas**: `login.html` (ingresar / crear cuenta / olvidé mi contraseña), `suscripcion.html` (plan mensual USD 7 o anual USD 77 con "1 mes de regalo" si se elige en los primeros 3 días del registro; pago con Card Payment Brick de Mercado Pago, en pesos al dólar del día, o PayPal Subscriptions; 3 días de prueba con tarjeta), `reset-password.html` (link del mail), `index.html` (la app).
- **Regla**: sin suscripción NO se usa la app. `index.html` pide `/api/apps/me` al iniciar y, si `suscripcion.activo` es falso, manda a `suscripcion.html`; el backend además devuelve 402 en los datos.
- **Datos**: `js/data.js` traduce las rutas del Hub (`/data/:id/:tipo`) a `/api/apps/data/:tipo` (aislado por la sesión). Lo que no existe en esta app (equipo, admin, notificaciones) se resuelve vacío sin red. **Sin subida de archivos** (se pegan links); el campo de imágenes y el logo están ocultos.
- **Mi suscripción** (en Mis cuentas): estado, plan, y botón Cancelar (usa `/api/apps/baja`).
- **Desarrollo local**: `node dev/mock-api.js` (API simulada en :8790) + `python3 -m http.server 8791` en la raíz, y en la consola del navegador `localStorage.setItem('cal_api_dev','http://localhost:8790')` (solo funciona en localhost).
- Claves PÚBLICAS de pago en `js/firebase.js` (MP `APP_USR-...` y el client-id de PayPal, tomados del carrito de Training). ⚠️ Verificar que el client-id de PayPal pertenezca a la MISMA app cuyo secret está en `mp-productos-ganadores` y que tenga habilitado Subscriptions.

### Pendiente real
1. Crear el repo `AquiVane/apps` (el conector no puede crear repos) y subir esto (`git push` desde `/home/user/apps` en la sesión).
2. Deploy MANUAL de `cosmart-training-core` (avisar a Vaneh) y probar un cobro real con tarjeta de prueba / PayPal sandbox.
3. Cloudflare Pages + DNS de `apps.cosmart.com.ar` (la app queda en `/calendario/`).
4. Limpiar de `js/app.js` / `js/data.js` el código del Hub que ya no se usa (tareas, pauta, web, reportes, ramas DEMO).
5. Catálogo del sitio por categorías (Organización, Productividad) y el Planner ("Próximamente" en el menú).
6. Plantilla de Excel: todavía trae las columnas "Pauta" y "Asignado a" (no existen en esta app).

### Decisiones de Vaneh (18/10)
Nombre: "Calendario de contenidos" (no cambiar). Precio: plan anual. Es una app de COSMART (que los emprendedores la conozcan a ella). Cuenta propia por emprendedor, datos aislados.

### Textos
Aprobados por Vaneh (18/10): aviso de prueba, planes, mensaje al terminar la prueba y el tip de "La voz de tu marca" con el link a IA para Emprendedores (`training.cosmart.com.ar/iaprincipiantes`). El prompt para la IA NO se agrega: las instrucciones ya están en la plantilla de Excel.

### Cambios 20/10 (Vaneh)
- La prueba pasó de 7 a **3 días** (`APP.trialDias` en `cosmart-workers/.../apps-calendario.js`; el regalo del anual sigue siendo 7 días desde el registro).
- La portada NO lleva directo al registro (el botón se sacó): Vaneh quiere primero la **portada de la tienda de apps** y la **landing de venta del Calendario** (todo lleva a la compra). Ella pasa el material; ver HANDOFF de `training` para las reglas de landings de producto (sin lead magnets ni desvíos).
- Políticas: redactar el párrafo de suscripción/renovación automática y actualizar términos y privacidad (pendiente de aprobación de texto).

### Cambios 20/10 (2da tanda)
- **Regalo del anual: 3 días** desde el registro (antes 7). La prueba también es de 3 días.
- **Excel a la vista**: la barra Plantilla / Importar / Exportar Excel ahora está SIEMPRE visible arriba de Contenidos (antes estaba escondida en el menú "⋯" en el celular).
- **Importar Excel**: lee la hoja de datos (la llamada Contenidos, o la primera que no sea "Instrucciones"), así que funciona con plantillas viejas y nuevas. La plantilla `calendario/plantillas/Plantilla_Calendario_Contenidos.xlsx` trae Contenidos primero e Instrucciones segunda. La plantilla es PROPIA de la app (20/10, pedido de Vaneh): sin referencias al Hub, sin las columnas "Pauta" ni "Asignado a" (ni en la plantilla ni en el Exportar Excel, que ahora trae 19 columnas).
- **Políticas**: `calendario/terminos.html` y `calendario/privacidad.html` (aprobadas por Vaneh: contacto info@cosmart.com.ar, 30 días de aviso por cambio de precio, datos 90 días tras cancelar, ley argentina aunque se use desde otro país de Latinoamérica). El registro enlaza a esas páginas.

## 20/10 (tarde) — prueba sin tarjeta, cuentas aparte y botón de PayPal
- **Cuentas de la app 100 % separadas de Training/Academy** (backend `cosmart-training-core`): usuario en `appuser:<mail>` y sesión `apps:<mail>`. Antes compartían la clave `<mail>` y quien ya tenía cuenta en Training recibía "ese mail ya está utilizado". Cuentas de prueba creadas antes de este cambio quedan huérfanas (hay que registrarse de nuevo).
- **Prueba de 3 días SIN tarjeta desde el registro** (`pruebaHasta`). Entra directo a la app. Pasados los 3 días: paywall (402 → `suscripcion.html`). Si se suscribe durante la prueba, el primer cobro arranca al terminar (MP: `free_trial` por los días que quedan; PayPal: plan sin ciclo de prueba + `start_time`).
- `suscripcion.html`: PayPal solo con el botón dorado de PayPal (antes salían PayPal Credit azul y "Debit or Credit Card" negro, desparejos) y en español.
- **Pendiente (esperando que Vaneh apruebe el texto):** a los ~3 minutos de uso aparece una ventana con la oferta de suscripción y su explicación (se puede cerrar durante la prueba) + aviso de días de prueba restantes.

## 20/10 (noche) — instalación, oferta, tour y precios
- **Instalar como app**: `calendario/manifest.webmanifest` + `sw.js` (mínimo, sin caché) + `icons/` (C del imán sin fondo) + `js/instalar.js`. La primera vez que entra desde un celular se muestra "Instalá tu calendario en el celular" (Android: botón "Instalar ahora" real vía `beforeinstallprompt`; iPhone: pasos de Safari → Compartir → Agregar a inicio); al cerrarlo arranca el recorrido. Se vuelve a abrir desde "Cómo se usa". Flag `cal_install_v1`.
- **Prueba sin tarjeta**: aviso "Te quedan N días de prueba · Suscribirme" arriba y, a los 3 min de uso (una vez por visita), ventana de oferta (`mostrarOfertaPrueba`). "Mi suscripción" muestra la prueba.
- **Precios** (decisión de Vaneh 20/10): regular USD 10/mes y USD 120/año; **oferta USD 7/mes y USD 77/año** si se suscribe dentro de los 3 días desde el registro (se queda con ese precio). Backend `apps-calendario.js` (`mensualLista`/`anualLista`). ⚠️ El backend con esto está en `main` pero **sin desplegar** (el core tiene `claude/biensmart-habitos` por delante: no desplegar desde `main` hasta que esa sesión mergee). El front funciona con ambos (si el backend no manda `mensualLista`, no muestra el precio regular).
- **Recorrido**: el paso de Contenidos señala las pestañas y el de Importar/Exportar señala la barra de Excel (antes señalaba "Nuevo contenido" y el menú de abajo quedaba tapado). La tarjeta del recorrido va arriba si lo señalado está en la mitad inferior. Mientras no hay contenidos se muestra un contenido de **Ejemplo** (solo visual).
- `dev/mock-api.js` actualizado al modelo nuevo (prueba sin tarjeta, oferta 3 días).
