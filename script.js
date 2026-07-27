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
   Marcas: las flechas controlan la dirección del carrusel mientras
   el puntero está sobre ellas (izquierda = retrocede, derecha = avanza).
   En táctil, deslizar el dedo sobre el carrusel hace lo mismo según
   el sentido del deslizamiento.
   ========================================================================== */
(() => {
  const tracks = document.querySelectorAll(".brands-track");
  const marquee = document.querySelector(".brands-marquee");
  const btnLeft = document.querySelector(".brands-arrow-left");
  const btnRight = document.querySelector(".brands-arrow-right");
  if (!tracks.length || !marquee || !btnLeft || !btnRight) return;

  const setDirection = (direction) => {
    tracks.forEach((t) => {
      t.style.animationDirection = direction;
    });
  };

  btnLeft.addEventListener("mouseenter", () => setDirection("reverse"));
  btnLeft.addEventListener("focus", () => setDirection("reverse"));
  btnLeft.addEventListener("mouseleave", () => setDirection("normal"));
  btnLeft.addEventListener("blur", () => setDirection("normal"));

  btnRight.addEventListener("mouseenter", () => setDirection("normal"));
  btnRight.addEventListener("focus", () => setDirection("normal"));
  btnRight.addEventListener("mouseleave", () => setDirection("normal"));
  btnRight.addEventListener("blur", () => setDirection("normal"));

  // Táctil: el sentido del dedo al deslizar marca la dirección del carrusel
  let lastTouchX = null;

  marquee.addEventListener(
    "touchstart",
    (e) => {
      lastTouchX = e.touches[0].clientX;
    },
    { passive: true }
  );

  marquee.addEventListener(
    "touchmove",
    (e) => {
      const x = e.touches[0].clientX;
      const delta = x - lastTouchX;
      if (Math.abs(delta) > 2) {
        setDirection(delta < 0 ? "normal" : "reverse");
        lastTouchX = x;
      }
    },
    { passive: true }
  );

  marquee.addEventListener("touchend", () => setDirection("normal"));
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
