# Guía para continuar el sitio de ECU Experto (sin ser técnica) 🙂

Esta web es una página estática (HTML/CSS/JS). No necesitas saber programar:
le pides los cambios a **Claude** en español y él edita, guarda y publica por ti.

El proyecto vive en 3 lugares:
- **Tu computador** → la carpeta donde trabajas.
- **GitHub** → respaldo del código en internet (repo `robinsonpractica/ecu-experto`).
- **Vercel** → donde la página queda publicada y visible para el público.

---

## 1. Preparar tu computador (SOLO LA PRIMERA VEZ)

Con Git y Claude ya instalados, abre la terminal (PowerShell) y escribe:

```
git clone https://github.com/robinsonpractica/ecu-experto.git
cd ecu-experto
```

- La primera vez que subas un cambio, se abrirá el navegador para **iniciar sesión en GitHub**.
  Se guarda y no vuelve a pedirlo.

---

## 2. Trabajar en el día a día

1. Abre la terminal dentro de la carpeta del proyecto:
   ```
   cd ecu-experto
   claude
   ```
2. Con Claude abierto, **pídele lo que necesites en palabras normales**, por ejemplo:
   - "Cámbiame el texto de la sección de garantía por esto: ..."
   - "Sube esta foto nueva al inicio" (déjala en la carpeta primero)
   - "Agrega un nuevo servicio llamado ..."
   - "Publica los cambios"
3. Claude hace las ediciones y, cuando le digas **"publica los cambios"**, los sube solo.

> Si prefieres retomar la conversación anterior con Claude, usa `claude --continue`.

---

## 3. ¿Cómo se ve publicada?

Cada vez que Claude publica (hace *push* a GitHub), **Vercel actualiza la web sola**
en ~1 minuto. Puedes ver el estado en https://vercel.com/dashboard → proyecto `ecu-experto`.

---

## 4. Datos del taller (WhatsApp, correo, dirección, redes)

Todo está junto al inicio del archivo **`script.js`**, en el bloque `CONFIG`.
Puedes pedirle a Claude: *"cambia el número de WhatsApp / el correo / la dirección"* y lo hace ahí.

Datos actuales:
- WhatsApp / teléfono: +56 9 6295 1636
- Correo: ecu.experto1@gmail.com
- Dirección: Santa Elena 778, Santiago, RM
- Instagram: @ecu.experto.cl

---

## 5. Archivos principales
- `index.html` → contenido y estructura de la página.
- `styles.css` → colores, tamaños y diseño.
- `script.js` → datos del taller y funcionamiento (WhatsApp, formulario).
- `img/` → fotos del sitio. `logo-web.png` → el logo.

¿Dudas? Ábrele esta guía a Claude y pídele que te explique cualquier paso. 🚗⚡
