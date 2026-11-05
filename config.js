/*
 * ============================================================
 *  CONFIGURACIÓN DEL LIBRO — edita solo este archivo
 * ============================================================
 *  - Fechas en formato "AAAA-MM-DD". Cada página se abre a la
 *    hora indicada en `horaApertura` (hora local del móvil).
 *  - `carta`: cada elemento del array es un párrafo.
 *  - `pista`: el acertijo que la lleva al escondite.
 *  - `escondite`: SOLO para ti (no se muestra en la web). Es un
 *    recordatorio de dónde esconder la tarjeta impresa.
 *  - `reto`: el texto que va en la tarjeta escondida
 *    (imprímelas desde tarjetas.html). En la web solo se muestra
 *    después de que ella complete el capítulo.
 * ============================================================
 */
window.CONFIG = {
  ella: "Irene",
  el: "Miguel",
  horaApertura: 8,
  tituloLibro: "Las Páginas Perdidas de Nuestra Historia",

  paginas: [
    {
      id: "intro",
      tipo: "intro",
      fecha: "2026-11-09",
      etiqueta: "Prólogo",
      titulo: "El libro sin páginas",
      carta: [
        "Mi querida Irene:",
        "Existe un libro muy especial. En él está escrita nuestra historia: cómo empezó, lo que vivimos hoy y todo lo que todavía nos espera.",
        "Pero algo ha pasado. Alguien ha arrancado sus páginas y las ha escondido por toda la casa. Sin ellas, el libro está incompleto… y solo tú puedes recuperarlas.",
        "Cada mañana, a las 8:00, se abrirá un nuevo capítulo. En él encontrarás una carta mía y una pista. La pista te llevará hasta el lugar donde está escondida la página, y allí descubrirás tu reto.",
        "Cuando lo completes, haz una foto como prueba y súbela aquí. Solo así el capítulo quedará restaurado y podrás seguir con el siguiente.",
        "Tres días. Tres capítulos. Pasado, presente y futuro. ¿Lista para empezar?"
      ],
      firma: "Con todo mi amor, Miguel"
    },
    {
      id: "cap1",
      tipo: "reto",
      fecha: "2026-11-10",
      etiqueta: "Capítulo I",
      titulo: "El Pasado",
      subtitulo: "Donde todo empezó",
      carta: [
        "Irene:",
        "En aquel otoño de 2022 conecté por primera vez con una persona maravillosa, no solo por fuera, sino también por dentro.",
        "Lo primero que me gustó de ti fue tu seguridad y tu buen hacer. Ver que te preocupabas por mí sin apenas conocerme, y que me integrabas en un grupo de gente que para mí eran desconocidos.",
        "Poco a poco, eso se fue transformando en confianza: risas, bromas… Y esa confianza terminó convirtiéndose en complicidad. En querer pasar tiempo contigo, en pensar en ti, en no poder despegarme del móvil por las noches porque no quería dejar de hablar contigo.",
        "Me enamoré de lo a gusto que me sentía contigo, de lo guapa que eres (y de lo feo que me sentía yo a tu lado; las comparaciones son odiosas), de lo rápido que quisiste presentarme a tu familia y de lo rápido que me hiciste desear que todo esto no terminara en Helsinki, hasta el punto de querer irme a Madrid ese mismo año.",
        "En definitiva, me enamoré de ti por cómo eres y por cómo demuestras tu amor: de forma sincera y apasionada. Esas mariposas en el estómago eran la razón por la que no quería separarme de ti."
      ],
      firma: "Miguel",
      pista: [
        "Toda historia empieza en un libro,",
        "y la nuestra también, mi amor.",
        "Busca entre tus páginas favoritas:",
        "ahí espera el primer capítulo de los dos."
      ],
      escondite: "Dentro de su libro favorito (estantería). Cámbialo si escondes la tarjeta en otro sitio y adapta la pista.",
      reto: {
        titulo: "Recrea nuestro pasado",
        texto: [
          "Busca una foto nuestra de los primeros tiempos juntos.",
          "Recréala lo mejor que puedas: la misma pose, la misma cara, una ropa parecida… ¡y tráeme contigo, porque salgo en ella!",
          "Haz la foto y súbela al libro para restaurar este capítulo."
        ]
      },
      textoSubida: "Sube aquí la foto recreada"
    },
    {
      id: "cap2",
      tipo: "reto",
      fecha: "2026-11-11",
      etiqueta: "Capítulo II",
      titulo: "El Presente",
      subtitulo: "Lo que somos hoy",
      carta: [
        "Mi querida Irene:",
        "[Miguel: escribe aquí lo que sientes ahora mismo por ella.]"
      ],
      firma: "Tuyo, Miguel",
      pista: [
        "Donde cada día empieza con café",
        "y cada noche acaba en una cena,",
        "el frío guarda un secreto cálido:",
        "abre la puerta y mira bien."
      ],
      escondite: "En la nevera (pegada dentro de la puerta o bajo un imán). Cámbialo si quieres y adapta la pista.",
      reto: {
        titulo: "3 objetos, 3 recuerdos",
        texto: [
          "Busca por la casa 3 objetos que representen nuestra vida juntos hoy.",
          "Junto a cada uno, escribe en un papelito el recuerdo o el momento que te trae.",
          "Colócalos todos juntos con sus recuerdos, haz una foto y súbela al libro."
        ]
      },
      textoSubida: "Sube aquí la foto de tus 3 objetos y sus recuerdos"
    },
    {
      id: "cap3",
      tipo: "reto",
      fecha: "2026-11-12",
      etiqueta: "Capítulo III",
      titulo: "El Futuro",
      subtitulo: "Lo que nos espera",
      carta: [
        "Mi querida Irene:",
        "[Miguel: escribe aquí lo que esperas del futuro juntos.]"
      ],
      firma: "Te quiere, Miguel",
      pista: [
        "Donde cerramos los ojos para soñar",
        "y el mañana se dibuja en silencio,",
        "bajo tu almohada te espera",
        "el último capítulo de este cuento."
      ],
      escondite: "Debajo de su almohada. Cámbialo si quieres y adapta la pista.",
      reto: {
        titulo: "Nuestra lista de sueños",
        texto: [
          "Escribe a mano nuestra lista de deseos: todas las cosas que quieres que vivamos juntos.",
          "Viajes, planes, locuras, pequeños caprichos… ¡todo vale! (mínimo 5).",
          "Haz una foto de la lista y súbela al libro. Y guárdala bien: la vamos a cumplir."
        ]
      },
      textoSubida: "Sube aquí la foto de nuestra lista de sueños"
    },
    {
      id: "final",
      tipo: "final",
      fecha: "2026-11-13",
      etiqueta: "Epílogo",
      titulo: "Nuestra historia, completa",
      carta: [
        "Mi querida Irene:",
        "Lo has conseguido. Las páginas perdidas han vuelto a su sitio y nuestro libro vuelve a estar completo.",
        "Recorriste nuestro pasado, guardaste nuestro presente y escribiste nuestro futuro. Pero hay algo que quiero que sepas: este libro nunca estará terminado, porque cada día que paso contigo escribimos una página nueva.",
        "Gracias por jugar conmigo, por reírte, por buscar y por ser tú. Te quiero."
      ],
      firma: "Para siempre tuyo, Miguel",
      tituloGaleria: "Las páginas recuperadas"
    }
  ]
};
