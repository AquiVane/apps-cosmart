# apps-cosmart

Tienda de apps (repo público: se publica con Cloudflare Pages).

Regla: en este repo nunca van claves, secretos ni lógica de cobro o licencia. Todo eso se valida en el servidor (workers de COSMART).

Estructura prevista: la portada es la tienda; cada app tiene su landing en `/<nombre>` y su página de producto en `/tienda/<nombre>`.
