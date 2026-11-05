(function () {
  "use strict";

  const CFG = window.CONFIG;
  const params = new URLSearchParams(location.search);
  const PREVIEW = params.get("modo") === "miguel";
  const DB_NAME = PREVIEW ? "libro-prueba" : "libro-irene";
  const STORE = "fotos";
  const MAX_LADO = 1600; // px, para que las fotos no llenen la memoria del móvil

  const app = document.getElementById("app");
  const fotos = {}; // id -> { blob, url, fecha }
  let timer = null;

  // ------------------------------------------------------------------
  // Utilidades DOM
  // ------------------------------------------------------------------
  function el(tag, attrs, ...children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v === null || v === undefined || v === false) continue;
        if (k === "class") node.className = v;
        else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
        else node.setAttribute(k, v === true ? "" : v);
      }
    }
    for (const c of children.flat()) {
      if (c === null || c === undefined || c === false) continue;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    }
    return node;
  }

  // ------------------------------------------------------------------
  // Fechas y bloqueos
  // ------------------------------------------------------------------
  function fechaApertura(pagina) {
    const [y, m, d] = pagina.fecha.split("-").map(Number);
    return new Date(y, m - 1, d, CFG.horaApertura, 0, 0);
  }

  const retos = CFG.paginas.filter((p) => p.tipo === "reto");

  function estado(pagina) {
    if (pagina.tipo === "reto" && fotos[pagina.id]) return "completado";
    if (!PREVIEW && new Date() < fechaApertura(pagina)) return "fecha";
    if (!PREVIEW) {
      if (pagina.tipo === "reto") {
        const idx = retos.indexOf(pagina);
        if (idx > 0 && !fotos[retos[idx - 1].id]) return "anterior";
      }
      if (pagina.tipo === "final" && retos.some((r) => !fotos[r.id])) return "anterior";
    }
    return "abierto";
  }

  function textoFecha(pagina) {
    const f = fechaApertura(pagina);
    const dia = f.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
    const hora = f.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
    return `${dia} a las ${hora}`;
  }

  function cuentaAtras(destino) {
    let ms = Math.max(0, destino - new Date());
    const d = Math.floor(ms / 86400000); ms -= d * 86400000;
    const h = Math.floor(ms / 3600000); ms -= h * 3600000;
    const m = Math.floor(ms / 60000); ms -= m * 60000;
    const s = Math.floor(ms / 1000);
    const pad = (n) => String(n).padStart(2, "0");
    return (d > 0 ? `${d}d ` : "") + `${pad(h)}h ${pad(m)}m ${pad(s)}s`;
  }

  // ------------------------------------------------------------------
  // Almacenamiento de fotos (IndexedDB, solo en este dispositivo)
  // ------------------------------------------------------------------
  function abrirDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function tx(modo, fn) {
    const db = await abrirDB();
    return new Promise((resolve, reject) => {
      const t = db.transaction(STORE, modo);
      const store = t.objectStore(STORE);
      const res = fn(store);
      t.oncomplete = () => resolve(res && res.result);
      t.onerror = () => reject(t.error);
    });
  }

  async function cargarFotos() {
    const db = await abrirDB();
    await new Promise((resolve, reject) => {
      const t = db.transaction(STORE, "readonly");
      const req = t.objectStore(STORE).openCursor();
      req.onsuccess = () => {
        const cur = req.result;
        if (cur) {
          const v = cur.value;
          fotos[cur.key] = { blob: v.blob, fecha: v.fecha, url: URL.createObjectURL(v.blob) };
          cur.continue();
        }
      };
      t.oncomplete = resolve;
      t.onerror = () => reject(t.error);
    });
  }

  async function guardarFoto(id, blob) {
    const fecha = new Date().toISOString();
    await tx("readwrite", (s) => s.put({ blob, fecha }, id));
    if (fotos[id]) URL.revokeObjectURL(fotos[id].url);
    fotos[id] = { blob, fecha, url: URL.createObjectURL(blob) };
  }

  async function borrarTodo() {
    await tx("readwrite", (s) => s.clear());
    for (const k of Object.keys(fotos)) {
      URL.revokeObjectURL(fotos[k].url);
      delete fotos[k];
    }
  }

  // Reduce la foto para ahorrar espacio. Si el navegador no puede
  // decodificarla (p. ej. HEIC en algunos móviles), guarda el original.
  function comprimir(file) {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const escala = Math.min(1, MAX_LADO / Math.max(img.naturalWidth, img.naturalHeight));
        const w = Math.round(img.naturalWidth * escala);
        const h = Math.round(img.naturalHeight * escala);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        canvas.toBlob((b) => {
          URL.revokeObjectURL(url);
          resolve(b || file);
        }, "image/jpeg", 0.85);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(file);
      };
      img.src = url;
    });
  }

  // ------------------------------------------------------------------
  // Efectos
  // ------------------------------------------------------------------
  function lluviaDeCorazones() {
    const capa = el("div", { class: "corazones", "aria-hidden": "true" });
    const simbolos = ["❤", "♥", "❣", "💕"];
    for (let i = 0; i < 28; i++) {
      const c = el("span", null, simbolos[i % simbolos.length]);
      c.style.left = Math.random() * 100 + "vw";
      c.style.animationDelay = Math.random() * 1.2 + "s";
      c.style.fontSize = 14 + Math.random() * 22 + "px";
      capa.appendChild(c);
    }
    document.body.appendChild(capa);
    setTimeout(() => capa.remove(), 4500);
  }

  // ------------------------------------------------------------------
  // Vistas
  // ------------------------------------------------------------------
  function bloqueCarta(pagina) {
    return el("article", { class: "carta" },
      pagina.carta.map((p, i) => el("p", { class: i === 0 ? "saludo" : null }, p)),
      el("p", { class: "firma" }, pagina.firma)
    );
  }

  function vistaIndice() {
    const items = CFG.paginas.map((p) => {
      const e = estado(p);
      const icono = { completado: "✓", abierto: "✦", fecha: "🔒", anterior: "🔒" }[e];
      let detalle;
      if (e === "fecha") detalle = `Se abre el ${textoFecha(p)}`;
      else if (e === "anterior") detalle = p.tipo === "final" ? "Recupera todas las páginas primero" : "Completa el capítulo anterior";
      else if (e === "completado") detalle = "Página recuperada";
      else detalle = p.subtitulo || "Disponible";

      const abrible = e === "abierto" || e === "completado";
      return el("li", null,
        el(abrible ? "a" : "div", {
          class: `indice-item estado-${e}`,
          href: abrible ? `#${p.id}` : null,
          "aria-disabled": abrible ? null : "true"
        },
          el("span", { class: "indice-icono", "aria-hidden": "true" }, icono),
          el("span", { class: "indice-texto" },
            el("span", { class: "indice-etiqueta" }, p.etiqueta),
            el("span", { class: "indice-titulo" }, p.titulo),
            el("span", { class: "indice-detalle" }, detalle)
          )
        )
      );
    });

    // Próxima apertura para la cuenta atrás
    const proxima = CFG.paginas.find((p) => estado(p) === "fecha");
    const cuenta = proxima
      ? el("div", { class: "cuenta" },
          el("span", null, `${proxima.etiqueta} se abre en`),
          el("strong", { id: "cuenta-valor" }, cuentaAtras(fechaApertura(proxima))))
      : null;

    const recuperadas = retos.filter((r) => fotos[r.id]).length;

    return el("section", { class: "pagina portada" },
      el("div", { class: "ornamento", "aria-hidden": "true" }, "❦"),
      el("h1", null, CFG.tituloLibro),
      el("p", { class: "dedicatoria" }, `Para ${CFG.ella}, de ${CFG.el}`),
      el("div", { class: "progreso", role: "img", "aria-label": `${recuperadas} de ${retos.length} páginas recuperadas` },
        retos.map((r) => el("span", { class: fotos[r.id] ? "lleno" : "" }, "♥"))
      ),
      cuenta,
      el("h2", { class: "indice-titulo-seccion" }, "Índice"),
      el("ol", { class: "indice" }, items)
    );
  }

  function vistaBloqueada(pagina, e) {
    return el("section", { class: "pagina centrada" },
      el("div", { class: "candado", "aria-hidden": "true" }, "🔒"),
      el("h1", null, pagina.titulo),
      e === "fecha"
        ? [el("p", null, `Esta página se abrirá el ${textoFecha(pagina)}.`),
           el("p", { class: "cuenta" }, el("strong", { id: "cuenta-valor" }, cuentaAtras(fechaApertura(pagina))))]
        : el("p", null, "Antes tienes que recuperar la página anterior."),
      el("a", { class: "boton secundario", href: "#" }, "← Volver al índice")
    );
  }

  function vistaIntro(pagina) {
    const primero = retos[0];
    return el("section", { class: "pagina" },
      el("p", { class: "etiqueta" }, pagina.etiqueta),
      el("h1", null, pagina.titulo),
      bloqueCarta(pagina),
      el("div", { class: "acciones" },
        el("a", { class: "boton", href: "#" }, "Ir al índice"),
        estado(primero) === "abierto" ? el("a", { class: "boton secundario", href: `#${primero.id}` }, `Empezar ${primero.etiqueta}`) : null
      )
    );
  }

  function vistaReto(pagina) {
    const hecho = !!fotos[pagina.id];
    const idx = retos.indexOf(pagina);
    const siguiente = CFG.paginas[CFG.paginas.indexOf(pagina) + 1];

    const pista = el("aside", { class: "pista" },
      el("h2", null, "La pista"),
      el("div", { class: "verso" }, pagina.pista.map((l) => el("p", null, l))),
      !hecho ? el("p", { class: "nota" }, "Sigue la pista: allí encontrarás escrito tu reto.") : null
    );

    let zona;
    if (hecho) {
      zona = el("div", { class: "completado" },
        el("h2", null, "✓ Página recuperada"),
        el("figure", { class: "polaroid" },
          el("img", { src: fotos[pagina.id].url, alt: `Prueba del ${pagina.etiqueta}` }),
          el("figcaption", null, pagina.reto.titulo)
        ),
        el("div", { class: "reto-revelado" },
          el("h3", null, "El reto era…"),
          pagina.reto.texto.map((t) => el("p", null, t))
        ),
        siguiente
          ? (estado(siguiente) === "abierto"
              ? el("a", { class: "boton", href: `#${siguiente.id}` }, `Continuar: ${siguiente.etiqueta} →`)
              : el("p", { class: "nota" }, `${siguiente.etiqueta} se abrirá el ${textoFecha(siguiente)}.`))
          : null,
        el("details", { class: "cambiar" },
          el("summary", null, "Cambiar la foto"),
          formularioSubida(pagina, true)
        )
      );
    } else {
      zona = el("div", { class: "subida" },
        el("h2", null, "Tu prueba"),
        el("p", null, "Cuando hayas completado el reto, haz una foto y súbela aquí."),
        formularioSubida(pagina, false)
      );
    }

    return el("section", { class: "pagina" },
      el("p", { class: "etiqueta" }, `${pagina.etiqueta} · página ${idx + 1} de ${retos.length}`),
      el("h1", null, pagina.titulo),
      pagina.subtitulo ? el("p", { class: "subtitulo" }, pagina.subtitulo) : null,
      bloqueCarta(pagina),
      pista,
      zona,
      el("a", { class: "volver", href: "#" }, "← Volver al índice")
    );
  }

  function formularioSubida(pagina, reemplazar) {
    const inputId = `foto-${pagina.id}${reemplazar ? "-r" : ""}`;
    const preview = el("img", { class: "previa", alt: "Vista previa de la foto", hidden: true });
    const estadoMsg = el("p", { class: "mensaje", role: "status" });
    const boton = el("button", { type: "submit", class: "boton", disabled: true }, reemplazar ? "Guardar nueva foto" : "Entregar prueba ♥");
    let archivo = null;

    const input = el("input", {
      type: "file",
      id: inputId,
      accept: "image/*",
      class: "visually-hidden",
      onchange: () => {
        archivo = input.files && input.files[0];
        if (!archivo) return;
        if (!archivo.type.startsWith("image/")) {
          estadoMsg.textContent = "Eso no parece una foto. Prueba con otra imagen.";
          archivo = null;
          boton.disabled = true;
          return;
        }
        preview.src = URL.createObjectURL(archivo);
        preview.hidden = false;
        boton.disabled = false;
        estadoMsg.textContent = "";
      }
    });

    return el("form", {
      class: "formulario",
      onsubmit: async (ev) => {
        ev.preventDefault();
        if (!archivo) return;
        boton.disabled = true;
        estadoMsg.textContent = "Guardando la página…";
        try {
          const blob = await comprimir(archivo);
          await guardarFoto(pagina.id, blob);
          lluviaDeCorazones();
          render();
          window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err) {
          console.error(err);
          estadoMsg.textContent = "No se pudo guardar la foto. Inténtalo de nuevo (si usas modo incógnito, ábrelo en una ventana normal).";
          boton.disabled = false;
        }
      }
    },
      input,
      el("label", { for: inputId, class: "boton secundario" }, "📷 Elegir o hacer foto"),
      preview,
      boton,
      estadoMsg
    );
  }

  function vistaFinal(pagina) {
    return el("section", { class: "pagina" },
      el("p", { class: "etiqueta" }, pagina.etiqueta),
      el("h1", null, pagina.titulo),
      bloqueCarta(pagina),
      el("h2", { class: "galeria-titulo" }, pagina.tituloGaleria),
      el("div", { class: "galeria" },
        retos.map((r, i) => fotos[r.id]
          ? el("figure", { class: "polaroid", style: `--giro:${[-3, 2, -1.5][i % 3]}deg` },
              el("img", { src: fotos[r.id].url, alt: `${r.etiqueta}: ${r.titulo}` }),
              el("figcaption", null, `${r.etiqueta} · ${r.titulo}`))
          : null)
      ),
      el("div", { class: "fin", "aria-hidden": "true" }, "~ Fin… o quizá solo el principio ~"),
      el("a", { class: "volver", href: "#" }, "← Volver al índice")
    );
  }

  // ------------------------------------------------------------------
  // Router
  // ------------------------------------------------------------------
  function render() {
    clearInterval(timer);
    const id = location.hash.replace("#", "");
    const pagina = CFG.paginas.find((p) => p.id === id);
    let vista, destinoCuenta = null;

    if (!pagina) {
      vista = vistaIndice();
      const proxima = CFG.paginas.find((p) => estado(p) === "fecha");
      if (proxima) destinoCuenta = fechaApertura(proxima);
    } else {
      const e = estado(pagina);
      if (e === "fecha" || e === "anterior") {
        vista = vistaBloqueada(pagina, e);
        if (e === "fecha") destinoCuenta = fechaApertura(pagina);
      } else if (pagina.tipo === "intro") vista = vistaIntro(pagina);
      else if (pagina.tipo === "reto") vista = vistaReto(pagina);
      else vista = vistaFinal(pagina);
    }

    app.replaceChildren(vista);
    vista.classList.add("entrar");

    if (destinoCuenta) {
      timer = setInterval(() => {
        if (new Date() >= destinoCuenta) return render();
        const nodo = document.getElementById("cuenta-valor");
        if (nodo) nodo.textContent = cuentaAtras(destinoCuenta);
      }, 1000);
    }
  }

  // ------------------------------------------------------------------
  // Inicio
  // ------------------------------------------------------------------
  async function iniciar() {
    if (PREVIEW) {
      const banner = document.getElementById("banner-preview");
      banner.hidden = false;
      document.getElementById("btn-reset-preview").addEventListener("click", async () => {
        await borrarTodo();
        render();
      });
    }
    try {
      await cargarFotos();
    } catch (err) {
      console.error("No se pudo abrir el almacenamiento", err);
    }
    // Pide al navegador que no borre las fotos por falta de espacio
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().catch(() => {});
    }
    window.addEventListener("hashchange", () => {
      render();
      window.scrollTo(0, 0);
    });
    render();
  }

  iniciar();
})();
