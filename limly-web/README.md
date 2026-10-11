# Limly · Kit Peru Tech Week

Web estática (HTML + CSS + JS, sin build ni dependencias) con 3 páginas:

1. **Inicio** (`#inicio`): qué es Limly, mapa de alcance, guion (10 s / 30 s / 1 min), preguntas para conversar, FAQ y registro de notas.
2. **Links y QR** (`#links`): enlaces del Linktree, QR en pantalla completa, compartir y descargar QR.
3. **Pasaporte** (`#pasaporte`): sube tu foto y descarga tu post 1080×1080, con generador de copys.

Idiomas: español, inglés y portugués (selector ES / EN / PT).

## Estructura

```
index.html          Estructura de las 3 páginas (los textos se cargan desde js/i18n.js)
css/styles.css      Estilos y paleta de marca
js/i18n.js          TODOS los textos en ES / EN / PT  ← aquí se editan los copys
js/app.js           Lógica: idiomas, guion, notas, QR, pasaporte (canvas) y generador de copys
assets/img/         Mascotas, logo y QR (WebP / PNG)
vercel.json         Configuración de Vercel
```

## Probar en tu computadora

Usa un servidor local (si abres `index.html` con doble clic, se ve bien pero la descarga del pasaporte no funciona por seguridad del navegador):

```
npx serve .
```
Luego abre http://localhost:3000. En Vercel todo funciona sin hacer nada extra.

## Subir a GitHub

### Opción A · Sin usar la terminal
1. Entra a https://github.com/new
2. Nombre del repositorio: `limly-web`. Déjalo **Public** o **Private** (ambos funcionan con Vercel). No marques "Add a README".
3. Clic en **Create repository**.
4. En la página que aparece, clic en **uploading an existing file**.
5. Arrastra **todo el contenido** de esta carpeta (no la carpeta en sí): `index.html`, `css`, `js`, `assets`, `vercel.json`, `README.md`, `CLAUDE.md`.
   - Si `.gitignore` no aparece (es un archivo oculto), no pasa nada; es opcional.
6. Clic en **Commit changes**.

### Opción B · Con la terminal
```
cd limly-web
git init
git add .
git commit -m "Limly kit Peru Tech Week"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/limly-web.git
git push -u origin main
```

### Opción C · Con Claude Code
Abre esta carpeta en Claude Code y escribe:
> Sube este proyecto a un repositorio nuevo de GitHub llamado limly-web y despliégalo en Vercel.

Claude Code usará `git`, `gh` (GitHub CLI) y `vercel` si los tienes instalados y te pedirá iniciar sesión cuando haga falta.

## Publicar en Vercel
1. Entra a https://vercel.com e inicia sesión **con tu cuenta de GitHub**.
2. Clic en **Add New… → Project**.
3. Busca `limly-web` y clic en **Import**.
4. Configuración:
   - Framework Preset: **Other**
   - Root Directory: `./`
   - Build Command: vacío · Output Directory: vacío
5. Clic en **Deploy**. En ~30 segundos tendrás un link tipo `limly-web.vercel.app`.
6. (Opcional) Dominio propio: **Project → Settings → Domains** y agrega, por ejemplo, `ptw.limly.io`. Vercel te dirá qué registro DNS crear.

Cada vez que subas cambios a GitHub, Vercel publica la nueva versión automáticamente.

## Privacidad (importante)

- **Notas de "Anota lo que te cuentan"**: se guardan solo en el `localStorage` del navegador de quien las escribe. No se envían a ningún servidor. Cada dispositivo tiene sus propias notas; si se borran los datos del navegador, se pierden. Para juntarlas, usar "Copiar todo" y pegarlas en el chat del equipo.
- **Foto del pasaporte**: se lee y se dibuja dentro del navegador (canvas). No se sube ni se guarda en ningún lado. Al recargar la página, desaparece.
- **Idioma elegido**: se recuerda en el navegador (`localStorage`).

## Editar textos
Todo el texto visible está en `js/i18n.js`, separado por idioma (`es`, `en`, `pt`). Cambia el texto en los tres idiomas para mantenerlos iguales.
