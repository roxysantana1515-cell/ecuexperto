/* ==========================================================================
   ECU EXPERTO — script.js
   --------------------------------------------------------------------------
   ⚙️  CONFIGURA AQUÍ LOS DATOS DEL TALLER (todo se actualiza solo en la web).
   ========================================================================== */
const CONFIG = {
  // Número de WhatsApp en formato internacional SIN espacios ni "+".
  // Chile: 56 + 9 + número. Ej: +56 9 1234 5678  ->  "56912345678"
  whatsapp: "56962951636",

  // Teléfono para mostrar y para el enlace tel:
  telefonoMostrar: "+56 9 6295 1636",
  telefonoLink: "+56962951636",

  // Correo oficial del taller (para el botón "enviar por correo")
  email: "ecu.experto1@gmail.com",

  // Dirección física (texto que se muestra en el footer)
  direccion: "Santa Elena 778, Santiago, RM",

  // Instagram del taller (URL completa)
  instagram: "https://instagram.com/ecu.experto.cl",

  // Link de pago (Getnet). Pega aquí la dirección web de pago que te entrega Getnet
  // (empieza con https://, por ejemplo la de micrositios.getnet.cl).
  // Si lo dejas vacío (""), los botones de pago NO se muestran en la página.
  linkPago: "",

  // Mensaje inicial al tocar cualquier botón de WhatsApp (sin usar el formulario)
  saludoWhatsApp:
    "¡Hola! Me gustaría revisar la falla de mi auto\n" +
    "Marca:\n" +
    "Modelo:\n" +
    "Año:\n" +
    "Falla que presenta:",
};

/* ==========================================================================
   Utilidades
   ========================================================================== */
const waBase = () => `https://wa.me/${CONFIG.whatsapp}`;

function waLink(mensaje) {
  return `${waBase()}?text=${encodeURIComponent(mensaje)}`;
}

/* ==========================================================================
   Aplicar CONFIG al DOM (enlaces, teléfono, dirección, etc.)
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {

  // Todos los botones/enlaces de WhatsApp genéricos
  document.querySelectorAll("[data-wa-link]").forEach((el) => {
    el.setAttribute("href", waLink(CONFIG.saludoWhatsApp));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });

  // Link de pago: solo se muestran los botones si hay una dirección https válida
  const linkPago = (CONFIG.linkPago || "").trim();
  if (/^https:\/\//i.test(linkPago)) {
    document.querySelectorAll("[data-pay-link]").forEach((el) => {
      el.setAttribute("href", linkPago);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
      el.hidden = false;
    });
    document.querySelectorAll("[data-pay-box]").forEach((el) => { el.hidden = false; });
  }

  // Teléfono
  document.querySelectorAll("[data-phone-link]").forEach((el) => {
    el.setAttribute("href", `tel:${CONFIG.telefonoLink}`);
    el.textContent = CONFIG.telefonoMostrar;
  });

  // Email
  document.querySelectorAll("[data-email-link]").forEach((el) => {
    el.setAttribute("href", `mailto:${CONFIG.email}`);
    el.textContent = CONFIG.email;
  });

  // Dirección
  document.querySelectorAll("[data-address]").forEach((el) => {
    el.textContent = CONFIG.direccion;
  });

  // Instagram
  document.querySelectorAll("[data-instagram]").forEach((el) => {
    el.setAttribute("href", CONFIG.instagram);
  });

  // Año del footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

/* ==========================================================================
   Menú móvil
   ========================================================================== */
(() => {
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("mobileMenu");
  if (!toggle || !menu) return;

  const close = () => {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
})();

/* ==========================================================================
   Scroll reveal (aparición al hacer scroll)
   ========================================================================== */
(() => {
  const items = document.querySelectorAll(".reveal");
  if (!items.length || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("in"), i * 70);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
  );
  items.forEach((el) => io.observe(el));
})();

/* ==========================================================================
   Carrusel de marcas
   --------------------------------------------------------------------------
   El movimiento lo calcula JavaScript con UNA sola posición continua, así
   que nunca se reinicia ni da saltos:
   - Avanza solo y sin cortes (bucle infinito).
   - Flecha izquierda/derecha (hover, foco o clic): cambia el sentido con
     una frenada y aceleración suaves, pasando por cero sin brusquedad.
   - Puntero sobre el carrusel: baja la velocidad de forma suave.
   - Arrastrar con mouse o dedo: lo mueve a mano, y al soltar sigue con inercia.
   ========================================================================== */
(() => {
  const marquee = document.querySelector(".brands-marquee");
  const tracks = document.querySelectorAll(".brands-track");
  const btnLeft = document.querySelector(".brands-arrow-left");
  const btnRight = document.querySelector(".brands-arrow-right");
  if (!marquee || !tracks.length) return;

  // Si la persona pidió menos movimiento, queda quieto y se desliza a mano
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  marquee.classList.add("is-js");

  const BASE = 55;      // px por segundo, ritmo normal
  const FAST = 190;     // px por segundo, con una flecha activa
  const SLOW = 0.3;     // fracción del ritmo normal al pasar el puntero
  const EASE = 3.2;     // mayor = cambios de velocidad más rápidos

  let pos = 0;          // posición continua (px)
  let vel = BASE;       // velocidad actual (px/s), puede ser negativa
  let arrowDir = 0;     // -1 / 0 / +1 según la flecha activa
  let hovering = false;
  let dragging = false;
  let width = tracks[0].offsetWidth || 1;
  let last = null;
  let raf = null;

  new ResizeObserver(() => { width = tracks[0].offsetWidth || 1; }).observe(tracks[0]);

  const frame = (t) => {
    if (last === null) last = t;
    const dt = Math.min((t - last) / 1000, 0.05);
    last = t;

    if (!dragging) {
      const target = arrowDir !== 0
        ? arrowDir * FAST
        : BASE * (hovering ? SLOW : 1);
      vel += (target - vel) * (1 - Math.exp(-dt * EASE));
      pos += vel * dt;
    }

    pos = ((pos % width) + width) % width;
    const tr = `translate3d(${-pos}px,0,0)`;
    tracks.forEach((el) => { el.style.transform = tr; });
    raf = requestAnimationFrame(frame);
  };

  const start = () => { if (raf === null) { last = null; raf = requestAnimationFrame(frame); } };
  const stop = () => { if (raf !== null) { cancelAnimationFrame(raf); raf = null; } };

  // Solo anima mientras el carrusel está a la vista
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? start() : stop()));
    }).observe(marquee);
  } else {
    start();
  }

  // Flechas: hover / foco cambian el sentido; clic da un impulso
  const bindArrow = (btn, dir) => {
    if (!btn) return;
    const on = () => { arrowDir = dir; };
    const off = () => { if (arrowDir === dir) arrowDir = 0; };
    btn.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") on(); });
    btn.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") off(); });
    btn.addEventListener("focus", on);
    btn.addEventListener("blur", off);
    btn.addEventListener("click", () => { vel = dir * 520; });
  };
  bindArrow(btnLeft, -1);
  bindArrow(btnRight, 1);

  // Puntero sobre el carrusel: frena suave (solo mouse)
  marquee.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") hovering = true; });
  marquee.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") hovering = false; });

  // Arrastre con mouse o dedo, con inercia al soltar
  let lastX = 0;
  let lastT = 0;
  marquee.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragging = true;
    lastX = e.clientX;
    lastT = performance.now();
    marquee.setPointerCapture(e.pointerId);
    marquee.classList.add("is-dragging");
  });
  marquee.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const now = performance.now();
    const dx = e.clientX - lastX;
    const dtm = Math.max(now - lastT, 1) / 1000;
    pos -= dx;
    vel = Math.max(-900, Math.min(900, -dx / dtm));
    lastX = e.clientX;
    lastT = now;
  });
  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false;
    marquee.classList.remove("is-dragging");
    if (marquee.hasPointerCapture && marquee.hasPointerCapture(e.pointerId)) {
      marquee.releasePointerCapture(e.pointerId);
    }
  };
  marquee.addEventListener("pointerup", endDrag);
  marquee.addEventListener("pointercancel", endDrag);
})();

/* ==========================================================================
   Formulario de contacto
   --------------------------------------------------------------------------
   Al enviar, arma un mensaje ordenado y abre WhatsApp con todo listo.
   (Es el canal más rápido y usado en Chile.)

   👉  ¿Quieres además recibir la consulta por CORREO automáticamente?
       Crea una cuenta gratis en https://formspree.io , y descomenta el
       bloque marcado "ENVÍO POR CORREO (Formspree)" más abajo, reemplazando
       TU_ID_FORMSPREE por el ID que te entrega Formspree.
   ========================================================================== */
(() => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const buildMessage = () => {
    const g = (id) => (document.getElementById(id)?.value || "").trim();
    const nombre = g("nombre");
    const telefono = g("telefono");
    const marca = g("marca");
    const modelo = g("modelo");
    const anio = g("anio");
    const descripcion = g("descripcion");

    return (
      `*Nueva consulta desde la web*\n\n` +
      `👤 *Nombre:* ${nombre}\n` +
      `📱 *Teléfono/WhatsApp:* ${telefono}\n` +
      `🚗 *Vehículo:* ${marca} ${modelo} ${anio}\n\n` +
      `🔧 *Caso o falla:*\n${descripcion}`
    );
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const mensaje = buildMessage();

    /* ---- ENVÍO POR CORREO (Formspree) — OPCIONAL ----
    fetch("https://formspree.io/f/TU_ID_FORMSPREE", {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: new FormData(form),
    }).catch(() => {});
    ---------------------------------------------------- */

    // Abrir WhatsApp con la consulta lista
    window.open(waLink(mensaje), "_blank", "noopener");
  });

  // Enlace alternativo: enviar por correo (mailto con los datos del formulario)
  const emailAlt = document.getElementById("emailAlt");
  if (emailAlt) {
    emailAlt.addEventListener("click", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const asunto = "Nueva consulta desde la web de ECU Experto";
      const cuerpo = buildMessage()
        .replace(/\*/g, "")
        .replace(/👤|📱|🚗|🔧/g, "")
        .trim();
      window.location.href =
        `mailto:${CONFIG.email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
    });
  }
})();
