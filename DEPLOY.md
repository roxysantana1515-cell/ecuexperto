# Publicar ECU Experto en Vercel

Sitio estático (HTML/CSS/JS). No requiere compilación.

## Opción A — Subir la carpeta (más fácil, sin instalar nada)
1. Entra a https://vercel.com y crea una cuenta (puedes usar tu Google).
2. Botón **Add New… → Project → Deploy** (o arrastra la carpeta en https://vercel.com/new).
3. Arrastra **toda la carpeta "Pagina web"**.
4. En "Framework Preset" deja **Other** y presiona **Deploy**.
5. En 1–2 minutos tendrás un enlace tipo `https://ecu-experto.vercel.app`.

## Opción B — Desde la terminal (CLI)
```bash
npm i -g vercel
cd "C:/Users/robin/Desktop/Pagina web"
vercel          # primera vez: inicia sesión y confirma opciones (todo por defecto)
vercel --prod   # publica la versión definitiva
```

## Dominio propio (opcional)
En el panel del proyecto: **Settings → Domains → Add**. Puedes conectar un dominio `.cl`
(por ejemplo `ecuexperto.cl`) siguiendo los pasos de DNS que indica Vercel.

## Archivos del sitio
- `index.html`, `styles.css`, `script.js` → la página.
- `logo-web.png` → logo optimizado.
- `img/` → fotos.
- `vercel.json` → configuración (caché de imágenes, URLs limpias).
- `.vercelignore` → excluye del deploy los archivos pesados de respaldo
  (`IMG_2408.PNG`, `logo.png`, `Logo SVG.svg`).

## Para editar datos del taller
Todo está en la parte superior de `script.js` (objeto `CONFIG`): WhatsApp, teléfono,
correo, dirección e Instagram. Tras cambiarlo, vuelve a hacer deploy (o `vercel --prod`).
