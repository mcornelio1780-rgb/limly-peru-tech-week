# Contexto para Claude Code · Limly web

Proyecto: web estática para embajadores de **Limly** ("Your AI Chief of Staff", limly.io) en **Peru Tech Week 2026**.
Sin framework ni build: `index.html` + `css/styles.css` + `js/i18n.js` + `js/app.js`. Despliegue en Vercel como sitio estático.

## Marca (respetar)
- Paleta primaria: #EAF5FF #CCE6FF #8CCFFF #2D8EFF #0A5BE0 #063A96 #F3F2EC #E7E6DF
- Secundaria: #FAFAF7 (fondo) #081020 (texto) #7EE48C #DCCBFF #FFE58A
- Tipografía de marca: Satoshi (Medium titulares, Regular subtítulos, Light texto). En web se usa **Outfit** de Google Fonts como sustituto; Satoshi va primero en el stack.
- Personalidad: amigable, inteligente, servicial, reflexiva. Nunca fría, robótica, corporativa ni demasiado técnica.
- Mascota: nube azul (assets/img). No deformarla ni cambiarle el color.

## Datos públicos aprobados
+6K usuarios · 28 países · 3 continentes · NPS 94 · 50+ integraciones · 30+ idiomas · respuesta < 2 s · audio 100 % en el dispositivo · US$0 en publicidad.
Planes: Free US$0 · Pro US$20/mes · Teams US$8/asiento · Business US$6/asiento.
Reconocimientos: Top 20 Web Summit Rio, Unicorn Factory Lisboa, AI Hub Europe, Top 20 COFIDE Launchpad, invitado NVIDIA, incubado en EE. UU.
NO publicar: ronda de inversión, valuación, MRR, EIN ni datos del data room.

## Enlaces
- Linktree: https://linktr.ee/limly.communication (QR en assets/img/qr-linktree.png)
- Web: https://www.limly.io · Instagram/TikTok: @limly.io
- Cal.com: https://cal.com/michellanyosa/reuni-o · WhatsApp: +51 995 422 760

## Cómo está armado
- Rutas por hash: `#inicio`, `#links`, `#pasaporte` (secciones internas: `#guion`, `#conversar`, `#alcance`…).
- i18n: elementos con `data-i="clave"` (innerHTML), `data-ip` (placeholder), `data-ia` (aria-label), `data-ialt` (alt). Listas (stats, FAQ, preguntas, copys) se generan en `renderStatic()` desde `T[lang]`.
- Pasaporte: canvas 1080×1080 en `draw()`. La foto nunca sale del navegador.
- Generador de copys: `makeSeed()` + `build()` combinan piezas de `T[lang].gen`. El botón "Escribir con IA" solo aparece dentro de Claude (`window.claude`); en Vercel queda oculto.
- Descargas: fuera de Claude se usa `<a download>`; dentro de Claude, la capacidad `downloads`.
- Notas: `localStorage` clave `limly-ptw-notes` (solo local). Idioma: `limly-lang`.

## Ideas pendientes
- Guardar las notas del equipo en un lugar común (Google Sheets, Supabase o Vercel Postgres) en vez de `localStorage`.
- Generador de copys con IA en Vercel mediante una función serverless (`/api/copy`) con la API de Anthropic y la key en variables de entorno, nunca en el frontend.
