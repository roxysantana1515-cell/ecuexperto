# CLAUDE.md — Notas del proyecto ECU Experto

Contexto para Claude Code al asistir en este proyecto. Léelo antes de hacer cambios.

## Qué es
Sitio web de **ECU Experto**, taller de electrónica y programación automotriz en
Santiago, Chile. Es un **sitio estático** (HTML/CSS/JS puro), sin framework ni paso de build.
La persona que lo mantiene **no es técnica**: pide los cambios en español y Claude los ejecuta.

## Objetivo del sitio
Que un cliente que llega desde Instagram entienda los servicios, confíe en el taller y
**agende por WhatsApp** (canal de contacto principal en Chile). Diseño **mobile-first**.

## Archivos
- `index.html` — contenido y estructura (una sola página con secciones).
- `styles.css` — diseño. Tema claro, industrial-automotor. Fuentes: Barlow / Barlow Condensed.
- `script.js` — al inicio está el objeto **`CONFIG`** con TODOS los datos del taller
  (WhatsApp, teléfono, correo, dirección, Instagram, mensaje predeterminado). Cambiar datos = editar ahí.
- `img/` — fotos del sitio. `img/brands/` — logos oficiales de marcas (SVG monocromo).
- `logo-web.png` — logo optimizado que usa el sitio. Los originales pesados
  (`logo.png`, `IMG_2408.PNG`, `Logo SVG.svg`) están excluidos del deploy vía `.vercelignore`.

## Convenciones importantes (respetarlas)
- **Idioma:** todo el contenido en español de Chile, cercano y profesional.
- **Sin guiones largos (—):** el cliente los considera "de IA". Usar comas, dos puntos o punto.
- **Taller multimarca CON especialidad en Grupo VAG.** Mantener el equilibrio: no presentarlo
  como si solo atendiera VAG. Atiende todas las marcas; VAG es la especialidad destacada.
- **WhatsApp es el CTA principal.** Botón flotante siempre visible + botones en todo el sitio.
- Marcas VAG mostradas: Audi, Volkswagen, SEAT, Škoda, Cupra (logos en `img/brands/`,
  se ven en blanco por `filter: brightness(0) invert(1)` sobre la banda oscura).

## Cómo hacer cambios frecuentes
- **Datos de contacto:** editar `CONFIG` en `script.js`.
- **Textos:** editar directamente en `index.html`.
- **Imagen de inicio (hero):** foto real del laboratorio, `img/laboratorio.jpg` (1600x1320, proporción
  800:660). Para cambiarla, reemplazar ese archivo manteniendo esa proporción.
- **Banda "Reparamos a nivel de componentes":** foto `img/componentes.jpg` (2400x873, horizontal).
  Ocupa todo el ancho; el encuadre se ajusta con `object-position` en `.photo-band img`.
  Medida recomendada para reemplazarla: 2400x800, con lo importante al centro y a la derecha.
- **Imagen de Garantía:** ilustración propia de tablero y escáner (`img/diagnostico-escaner.svg`).
  `img/hero-ecu.svg` quedó de respaldo y ya no se usa en la página.
- **Carrusel de marcas:** lo mueve `script.js` (posición continua, sin reinicios). No volver a
  animarlo con `animation-direction` en CSS, porque produce saltos al cambiar de dirección.
- **Colores/tamaños:** variables CSS `:root` al inicio de `styles.css`.

## Publicar (deploy)
Repo GitHub: `robinsonpractica/ecu-experto`. Conectado a **Vercel** (deploy automático).
Flujo: `git add -A` → `git commit -m "..."` → `git push`. Vercel republica solo en ~1 min.
No hace falta subir archivos a mano.

## Previsualizar
Basta abrir `index.html` en el navegador. Para revisar responsive, usar el modo móvil del
navegador (F12 → ícono de teléfono). Nota: las capturas headless directas en móvil pueden
verse mal por el viewport; un iframe a 390px o el navegador real reflejan el resultado correcto.
