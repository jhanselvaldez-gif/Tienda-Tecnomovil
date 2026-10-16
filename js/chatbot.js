/* chatbot.js: asistente virtual que consulta el inventario */
(function () {
  const botonAbrir = document.getElementById("chatbot-abrir");
  const ventana = document.getElementById("chatbot-ventana");
  const botonCerrar = document.getElementById("chatbot-cerrar");
  const zonaMensajes = document.getElementById("chatbot-mensajes");
  const zonaSugerencias = document.querySelector(".chatbot-sugerencias");
  const formulario = document.getElementById("chatbot-form");
  const entrada = document.getElementById("chatbot-entrada");
  if (!botonAbrir || !ventana || !formulario) return;

  let ultimoProducto = null; // para entender preguntas como "¿y cuánto cuesta?"
  let saludado = false;

  const SUGERENCIAS = ["¿Qué pasó con la tienda?", "¿Qué hay disponible?", "Quiero 2 iPhone 13", "Gama alta",
    "Agotados", "Tengo 30000", "Garantía", "Rastrear mi pedido"];
  const NUMEROS = { un: 1, uno: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10 };
  const MARCAS = [
    { marca: "Apple", palabras: ["apple", "iphone", "iphones"] },
    { marca: "Samsung", palabras: ["samsung", "galaxy"] },
    { marca: "Xiaomi", palabras: ["xiaomi", "redmi"] },
    { marca: "Motorola", palabras: ["motorola", "moto"] },
    { marca: "Honor", palabras: ["honor"] }
  ];
  const TEMAS = [
    { palabras: ["paso", "borrado", "ataque", "hackeo", "usb", "incidente", "historia", "misterio"],
      texto: "Una noche borraron la web, las redes y el catálogo de Tecnomovil, y apareció un USB con un mensaje en la tienda. Reconstruimos todo desde cero y más seguros: copias de seguridad, verificación en dos pasos y vigilancia de accesos.",
      enlace: { texto: "Leer la historia", href: "historia.html" } },
    { palabras: ["pedido", "pedidos", "seguimiento", "rastrear", "rastreo", "envio", "envios", "entrega", "delivery"],
      texto: "Puedes seguir tu pedido en Servicios, escribiendo tu código (formato TM-1234). Para probar usa TM-1001.",
      enlace: { texto: "Ir al seguimiento", href: "servicios.html#seguimiento" } },
    { palabras: ["garantia", "garantias"],
      texto: "Todos los equipos incluyen garantía y puedes extenderla. Los reacondicionados pasan por una revisión y vienen certificados.",
      enlace: { texto: "Ver servicios", href: "servicios.html" } },
    { palabras: ["imei", "original", "originales", "autentico", "verificado", "verificados"],
      texto: "Revisamos el IMEI de cada celular y entregamos un certificado de autenticidad para que sepas que es original.",
      enlace: { texto: "Ver servicios", href: "servicios.html" } },
    { palabras: ["seguridad", "seguro", "segura", "privacidad", "contrasena", "contrasenas", "datos personales"],
      texto: "Nunca te pedimos cédula, tarjeta ni contraseñas. Esta web no envía tus datos a ningún servidor y revisa todo lo que escribes. Te recomendamos activar la verificación en dos pasos en tu celular nuevo.",
      enlace: { texto: "Aviso de privacidad", href: "contacto.html#privacidad" } },
    { palabras: ["contacto", "contactar", "escribir", "correo", "soporte", "asesor"],
      texto: "Puedes escribirnos desde la página de contacto.",
      enlace: { texto: "Ir a contacto", href: "contacto.html" } },
    { palabras: ["descuento", "descuentos", "cupon", "oferta", "ofertas", "promocion", "promociones", "codigo"],
      texto: "Hay un código de descuento escondido en la web. Pista: haz clic varias veces seguidas en el © del pie de página." }
  ];
  const ATRIBUTOS = ["precio", "cuesta", "cuanto", "costo", "vale", "valor", "almacenamiento", "memoria", "gb", "capacidad", "ram",
    "5g", "android", "ios", "sistema", "disponible", "disponibles", "quedan", "queda", "stock", "hay", "unidades", "nuevo",
    "reacondicionado", "estado", "gama", "comprar", "informacion", "detalles", "caracteristicas", "ficha", "datos", "especificaciones"];
  const GENERICAS = ["celular", "celulares", "telefono", "telefonos", "movil", "equipo", "recomienda", "recomiendas", "recomendacion", "recomendar"];

  /* ---------- Utilidades ---------- */
  const tiene = (t, palabras) => palabras.some(p => (" " + t + " ").includes(" " + p + " "));
  const plural = (n, uno, varios) => n + " " + (n === 1 ? uno : varios);
  const enlaceCatalogo = (parametros, texto) => ({ texto: texto || "Ver en el catálogo", href: "catalogo.html" + (parametros ? "?" + parametros : "") });

  function linea(p) {
    const s = stockDe(p.id);
    return "• " + p.nombre + " · " + p.almacenamiento + " GB · " + formatoPrecio(p.precio) + (s === 0 ? " · agotado" : " · quedan " + s);
  }
  function listar(lista, max) {
    return lista.slice(0, max).map(linea).join("\n") + (lista.length > max ? "\n… y " + (lista.length - max) + " más en el catálogo." : "");
  }
  function ficha(p) {
    return p.nombre + ": " + GAMAS[p.gama].toLowerCase() + ", " + p.almacenamiento + " GB, " + p.ram + " GB de RAM, " + p.so + ", " +
      (p.cincoG ? "con 5G" : "sin 5G") + ", " + p.estado.toLowerCase() + ". Precio: " + formatoPrecio(p.precio) + ".";
  }

  /* ---------- Buscar el modelo, la cantidad y el presupuesto en el texto ---------- */
  function buscarProducto(t) {
    const texto = " " + t + " ";
    let mejor = null, aliasMejor = "";
    PRODUCTOS.forEach(p => p.alias.forEach(a => {
      if (a.length > aliasMejor.length && texto.includes(" " + a + " ")) { mejor = p; aliasMejor = a; }
    }));
    return mejor ? { producto: mejor, alias: aliasMejor } : null;
  }
  function quitar(t, alias) { return (" " + t + " ").replace(" " + alias + " ", " ").trim(); }

  function extraerCantidad(resto) {
    const palabras = resto.split(" ");
    for (let i = 0; i < palabras.length; i++) {
      const w = palabras[i];
      if (/^\d+$/.test(w)) {
        const n = parseInt(w, 10);
        if (["gb", "ram"].includes(palabras[i + 1])) continue; // es almacenamiento, no cantidad
        if (n >= 1 && n <= 99) return n;
      } else if (NUMEROS[w]) return NUMEROS[w];
    }
    return null;
  }
  function extraerMonto(t) {
    const palabras = t.split(" ");
    for (let i = 0; i < palabras.length; i++) {
      if (/^\d+$/.test(palabras[i]) && !["gb", "tb"].includes(palabras[i + 1])) {
        const n = parseInt(palabras[i], 10);
        if (n >= 1000) return n;
      }
    }
    return null;
  }

  /* ---------- Alternativas: misma gama, almacenamiento parecido y con existencias ---------- */
  function alternativas(p, necesarias) {
    return PRODUCTOS.filter(x => x.id !== p.id && x.gama === p.gama && stockDe(x.id) > 0)
      .sort((a, b) =>
        (stockDe(b.id) >= necesarias) - (stockDe(a.id) >= necesarias) ||
        Math.abs(a.almacenamiento - p.almacenamiento) - Math.abs(b.almacenamiento - p.almacenamiento) ||
        Math.abs(a.precio - p.precio) - Math.abs(b.precio - p.precio))
      .slice(0, 2);
  }
  function textoAlternativas(p, necesarias, titulo) {
    const lista = alternativas(p, necesarias);
    if (!lista.length) return "Tampoco tengo otro modelo de la misma gama con existencias en este momento.";
    return (titulo || "Te recomiendo estas opciones de la misma gama y con almacenamiento parecido:") + "\n" + lista.map(linea).join("\n");
  }

  /* ---------- Respuestas ---------- */
  function respuestaProducto(p, resto) {
    const cantidad = extraerCantidad(resto);
    const stock = stockDe(p.id);
    const pide = {
      precio: tiene(resto, ["precio", "cuesta", "cuanto", "costo", "vale", "valor"]),
      almacenamiento: tiene(resto, ["almacenamiento", "memoria", "gb", "capacidad"]),
      ram: tiene(resto, ["ram"]),
      cincoG: tiene(resto, ["5g"]),
      so: tiene(resto, ["android", "ios", "sistema"]),
      gama: tiene(resto, ["gama"]),
      estado: tiene(resto, ["nuevo", "reacondicionado", "estado"])
    };
    const partes = [];
    if (!Object.values(pide).some(Boolean)) partes.push(ficha(p));
    else {
      if (pide.precio) partes.push("El " + p.nombre + " cuesta " + formatoPrecio(p.precio) + ".");
      if (pide.almacenamiento) partes.push("Tiene " + p.almacenamiento + " GB de almacenamiento.");
      if (pide.ram) partes.push("Trae " + p.ram + " GB de RAM.");
      if (pide.cincoG) partes.push(p.cincoG ? "Sí, es compatible con 5G." : "No, este modelo no tiene 5G.");
      if (pide.so) partes.push("Su sistema operativo es " + p.so + ".");
      if (pide.gama) partes.push("Es de " + GAMAS[p.gama].toLowerCase() + ".");
      if (pide.estado) partes.push("Estado: " + p.estado.toLowerCase() + ".");
    }

    if (stock === 0) {
      partes.push("Lo siento, el " + p.nombre + " está agotado por ahora.");
      partes.push(textoAlternativas(p, cantidad || 1));
    } else if (cantidad === null) {
      partes.push("Disponibles: " + plural(stock, "unidad", "unidades") + (stock <= 2 ? " (¡quedan pocas!)" : "") + ".");
    } else if (cantidad <= stock) {
      partes.push("Sí, tengo " + plural(cantidad, "unidad", "unidades") + " del " + p.nombre + ". Si las compras, quedarían " + (stock - cantidad) +
        ". Total: " + formatoPrecio(p.precio * cantidad) + ".");
    } else {
      const faltan = cantidad - stock;
      partes.push("Solo me quedan " + plural(stock, "unidad", "unidades") + " del " + p.nombre + " y pides " + cantidad + ", así que faltarían " + faltan + ".");
      partes.push(textoAlternativas(p, faltan, "Para completar las que faltan te recomiendo (misma gama y almacenamiento parecido):"));
    }
    return [{ texto: partes.join("\n"), enlace: enlaceCatalogo("q=" + encodeURIComponent(p.nombre), "Ver " + p.nombre + " en el catálogo") }];
  }

  function respuestaPresupuesto(monto) {
    const conStock = PRODUCTOS.filter(p => stockDe(p.id) > 0);
    const opciones = conStock.filter(p => p.precio <= monto).sort((a, b) => b.precio - a.precio).slice(0, 3);
    if (!opciones.length) {
      const barato = conStock.sort((a, b) => a.precio - b.precio)[0];
      return [{ texto: "Con " + formatoPrecio(monto) + " no alcanza para ningún modelo disponible. El más económico es:\n" + (barato ? linea(barato) : "ninguno por ahora.") }];
    }
    return [{ texto: "Con " + formatoPrecio(monto) + " te recomiendo:\n" + opciones.map(linea).join("\n"), enlace: enlaceCatalogo("max=" + monto) }];
  }

  function detectarGama(t) {
    if (tiene(t, ["media alta"])) return "media-alta";
    if (tiene(t, ["gama alta", "alta gama", "premium"])) return "alta";
    if (tiene(t, ["gama media"])) return "media";
    if (tiene(t, ["gama baja", "economico", "economicos", "barato", "baratos"])) return "baja";
    return null;
  }

  function responder(original) {
    const limpio = original.slice(0, 200).replace(/(\d)[.,](?=\d{3}(\D|$))/g, "$1");
    const t = normalizar(limpio);
    if (!t) return [{ texto: "Escríbeme tu pregunta o toca una de las sugerencias." }];

    // 1) ¿Menciona un modelo?
    const hallado = buscarProducto(t);
    if (hallado) { ultimoProducto = hallado.producto; return respuestaProducto(hallado.producto, quitar(t, hallado.alias)); }

    // 2) Temas generales
    const tema = TEMAS.find(x => tiene(t, x.palabras));
    if (tema) return [{ texto: tema.texto, enlace: tema.enlace }];

    // 3) Agotados, presupuesto, marca y gama
    if (tiene(t, ["agotado", "agotados", "agotada", "acabo"])) {
      const agotados = PRODUCTOS.filter(p => stockDe(p.id) === 0);
      return [{ texto: agotados.length ? "Modelos agotados:\n" + listar(agotados, 8) : "Por ahora todos los modelos tienen existencias." }];
    }
    const monto = extraerMonto(t);
    if (monto) return respuestaPresupuesto(monto);
    const marca = MARCAS.find(m => tiene(t, m.palabras));
    if (marca) return [{ texto: "Modelos " + marca.marca + ":\n" + listar(PRODUCTOS.filter(p => p.marca === marca.marca), 8), enlace: enlaceCatalogo("q=" + marca.marca) }];
    const gama = detectarGama(t);
    if (gama) return [{ texto: GAMAS[gama] + ":\n" + listar(PRODUCTOS.filter(p => p.gama === gama), 6), enlace: enlaceCatalogo("gama=" + gama) }];

    // 4) Inventario general
    if (/que (hay|tienen|tiene|venden|modelos)|modelos|catalogo|inventario/.test(t) || (!ultimoProducto && tiene(t, ["disponible", "disponibles", "stock"]))) {
      const stock = leerStock();
      const total = PRODUCTOS.reduce((suma, p) => suma + stock[p.id], 0);
      const agotados = PRODUCTOS.filter(p => stock[p.id] === 0).length;
      return [{ texto: "Ahora mismo hay " + (PRODUCTOS.length - agotados) + " modelos con existencias (" + total + " unidades en total) y " + agotados +
        " agotados. Dime un modelo y la cantidad que quieres, por ejemplo \"quiero 3 Samsung A36\".", enlace: enlaceCatalogo("") }];
    }

    // 5) Seguimiento de la conversación sobre el último modelo
    const cantidad = extraerCantidad(t);
    const esGenerica = tiene(t, GENERICAS);
    if (ultimoProducto && (tiene(t, ATRIBUTOS) || (cantidad !== null && !esGenerica))) return respuestaProducto(ultimoProducto, t);
    if (esGenerica) return [{ texto: "Claro, te ayudo a elegir. Dime tu presupuesto (por ejemplo \"tengo 30000\"), la gama que buscas (baja, media o alta) o el modelo que te interesa, y te digo si hay existencias.", enlace: enlaceCatalogo("") }];

    if (tiene(t, ["hola", "buenas", "buenos", "hey", "saludos"])) return [{ texto: "¡Hola! Pregúntame por un modelo, su precio o cuántas unidades quedan." }];
    if (tiene(t, ["gracias", "ok", "perfecto", "listo", "vale"])) return [{ texto: "¡Con gusto! Si necesitas algo más, aquí estoy." }];
    return [{ texto: "No estoy seguro de haberte entendido. Prueba con un modelo (\"iPhone 13\"), una cantidad (\"quiero 2 Moto G35\"), un presupuesto (\"tengo 25000\") o toca una sugerencia." }];
  }

  /* ---------- Ventana del chat ---------- */
  function agregarMensaje(texto, quien, enlace) {
    const burbuja = document.createElement("div");
    burbuja.className = "mensaje mensaje-" + quien;
    const p = document.createElement("p");
    p.textContent = texto; // textContent: el texto del usuario nunca se interpreta como HTML
    burbuja.append(p);
    if (enlace) {
      const a = document.createElement("a");
      a.href = enlace.href;
      a.textContent = enlace.texto;
      burbuja.append(a);
    }
    zonaMensajes.append(burbuja);
    zonaMensajes.scrollTop = zonaMensajes.scrollHeight;
  }

  function enviar(texto) {
    const limpio = texto.trim().slice(0, 200);
    if (!limpio) return;
    agregarMensaje(limpio, "usuario");
    entrada.value = "";
    setTimeout(() => responder(limpio).forEach(m => agregarMensaje(m.texto, "bot", m.enlace)), 350);
  }

  function alternar(abrir) {
    ventana.hidden = !abrir;
    botonAbrir.setAttribute("aria-expanded", String(abrir));
    if (abrir) {
      if (!saludado) {
        saludado = true;
        agregarMensaje("Hola, soy el asistente de Tecnomovil. Pregúntame por un modelo, su precio o cuántas unidades quedan. Por ejemplo: \"quiero 2 iPhone 13\".", "bot");
      }
      entrada.focus();
    } else botonAbrir.focus();
  }

  zonaSugerencias.replaceChildren(...SUGERENCIAS.map(texto => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = texto;
    b.addEventListener("click", () => enviar(texto));
    return b;
  }));
  botonAbrir.addEventListener("click", () => alternar(ventana.hidden));
  botonCerrar.addEventListener("click", () => alternar(false));
  ventana.addEventListener("keydown", e => { if (e.key === "Escape") alternar(false); });
  formulario.addEventListener("submit", e => { e.preventDefault(); enviar(entrada.value); });
})();