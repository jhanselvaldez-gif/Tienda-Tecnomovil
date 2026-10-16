/* catalogo.js: filtros, tarjetas, favoritos, compra e inventario */
(function () {
  const formulario = document.getElementById("formulario-filtros");
  const contenedor = document.getElementById("lista-productos");
  if (!formulario || !contenedor) return;

  const plantilla = document.getElementById("plantilla-tarjeta");
  const buscador = document.getElementById("buscador");
  const ordenSel = document.getElementById("orden");
  const contador = document.getElementById("contador-resultados");
  const sinResultados = document.getElementById("sin-resultados");
  const panel = document.querySelector(".filtros-detalle");
  const casillaFavoritos = document.getElementById("solo-favoritos");

  /* ----- Filtros ----- */
  function valoresMarcados(nombre) {
    return Array.from(formulario.querySelectorAll('input[name="' + nombre + '"]:checked')).map(i => i.value);
  }
  function numeroDe(id) {
    const v = parseInt(document.getElementById(id).value, 10);
    return Number.isFinite(v) && v >= 0 ? v : null;
  }
  function leerFiltros() {
    return {
      texto: normalizar(buscador.value),
      marcas: valoresMarcados("marca"),
      gamas: valoresMarcados("gama"),
      min: numeroDe("precio-min"),
      max: numeroDe("precio-max"),
      almacenamiento: document.getElementById("almacenamiento").value,
      ram: document.getElementById("ram").value,
      cincoG: document.getElementById("filtro-5g").checked,
      estado: formulario.querySelector('input[name="estado"]:checked').value,
      so: formulario.querySelector('input[name="so"]:checked').value,
      soloDisponibles: document.getElementById("solo-disponibles").checked,
      soloFavoritos: casillaFavoritos.checked
    };
  }
  function hayFiltros(f) {
    return Boolean(f.texto || f.marcas.length || f.gamas.length || f.min !== null || f.max !== null ||
      f.almacenamiento || f.ram || f.cincoG || f.estado || f.so || f.soloDisponibles || f.soloFavoritos);
  }
  function pasaFiltros(p, f, favoritos, stock) {
    if (f.texto && !normalizar(p.marca + " " + p.nombre).includes(f.texto)) return false;
    if (f.marcas.length && !f.marcas.includes(p.marca)) return false;
    if (f.gamas.length && !f.gamas.includes(p.gama)) return false;
    if (f.min !== null && p.precio < f.min) return false;
    if (f.max !== null && p.precio > f.max) return false;
    if (f.almacenamiento && p.almacenamiento !== Number(f.almacenamiento)) return false;
    if (f.ram && p.ram !== Number(f.ram)) return false;
    if (f.cincoG && !p.cincoG) return false;
    if (f.estado && p.estado !== f.estado) return false;
    if (f.so && p.so !== f.so) return false;
    if (f.soloDisponibles && stock[p.id] < 1) return false;
    if (f.soloFavoritos && !favoritos.includes(p.id)) return false;
    return true;
  }
  function ordenar(lista, orden) {
    const copia = lista.slice();
    if (orden === "precio-asc") copia.sort((a, b) => a.precio - b.precio);
    else if (orden === "precio-desc") copia.sort((a, b) => b.precio - a.precio);
    else if (orden === "nombre") copia.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
    return copia;
  }

  /* ----- Tarjetas ----- */
  function etiquetaFavorito(p, activo) {
    return (activo ? "Quitar " : "Agregar ") + p.nombre + (activo ? " de favoritos" : " a favoritos");
  }
  function crearTarjeta(p, disponibles, esFavorito, posicion) {
    const tarjeta = plantilla.content.firstElementChild.cloneNode(true);
    tarjeta.dataset.id = p.id;
    if (posicion) tarjeta.classList.add("div" + posicion); // ubica la tarjeta en la cuadrícula 5x5
    if (disponibles === 0) tarjeta.classList.add("sin-stock");

    const img = tarjeta.querySelector(".tarjeta-imagen");
    img.alt = p.nombre;
    img.addEventListener("error", () => { img.src = IMAGEN_VACIA; }, { once: true });
    img.src = CARPETA_IMG + p.imagen;

    tarjeta.querySelector(".tarjeta-gama").textContent = p.marca + " · " + GAMAS[p.gama];
    tarjeta.querySelector(".tarjeta-modelo").textContent = p.nombre;
    tarjeta.querySelector(".tarjeta-almacenamiento").textContent = p.almacenamiento + " GB de almacenamiento";
    tarjeta.querySelector(".tarjeta-precio").textContent = formatoPrecio(p.precio);
    tarjeta.querySelector(".tarjeta-specs").textContent =
      p.ram + " GB RAM · " + p.so + " · " + (p.cincoG ? "5G" : "Sin 5G") + " · " + p.estado;

    const stockTxt = tarjeta.querySelector(".tarjeta-stock");
    if (disponibles === 0) { stockTxt.textContent = "Agotado"; stockTxt.classList.add("agotado"); }
    else if (disponibles <= 2) { stockTxt.textContent = "¡Quedan " + disponibles + "!"; stockTxt.classList.add("poco"); }
    else stockTxt.textContent = disponibles + " disponibles";

    const botonFav = tarjeta.querySelector(".boton-favorito");
    botonFav.setAttribute("aria-pressed", String(esFavorito));
    botonFav.setAttribute("aria-label", etiquetaFavorito(p, esFavorito));
    botonFav.textContent = esFavorito ? "♥" : "♡";

    const botonCompra = tarjeta.querySelector(".boton-comprar");
    if (disponibles === 0) { botonCompra.disabled = true; botonCompra.textContent = "Agotado"; }
    return tarjeta;
  }

  function mostrar() {
    const f = leerFiltros();
    const orden = ordenSel.value;
    const favoritos = leerFavoritos();
    const stock = leerStock();
    const lista = ordenar(PRODUCTOS.filter(p => pasaFiltros(p, f, favoritos, stock)), orden);
    // La cuadrícula 5x5 (una columna por marca) solo se usa sin filtros ni orden especial
    const modoMarcas = !hayFiltros(f) && orden === "relevancia";
    contenedor.classList.toggle("modo-marcas", modoMarcas);
    contenedor.replaceChildren(...lista.map((p, i) =>
      crearTarjeta(p, stock[p.id], favoritos.includes(p.id), modoMarcas ? i + 1 : 0)));
    contador.textContent = "Mostrando " + lista.length + " de " + PRODUCTOS.length + " celulares";
    sinResultados.hidden = lista.length > 0;
  }

  /* ----- Eventos del catálogo ----- */
  formulario.addEventListener("input", mostrar);
  formulario.addEventListener("change", mostrar);
  formulario.addEventListener("submit", e => e.preventDefault());
  formulario.addEventListener("reset", () => setTimeout(mostrar, 0));
  ordenSel.addEventListener("change", mostrar);

  contenedor.addEventListener("click", e => {
    const tarjeta = e.target.closest("article");
    if (!tarjeta) return;
    const id = tarjeta.dataset.id;
    const botonFav = e.target.closest(".boton-favorito");
    const botonCompra = e.target.closest(".boton-comprar");
    if (botonFav) {
      const activo = alternarFavorito(id);
      actualizarContadorFavoritos();
      if (casillaFavoritos.checked) { mostrar(); return; }
      botonFav.setAttribute("aria-pressed", String(activo));
      botonFav.setAttribute("aria-label", etiquetaFavorito(obtenerProducto(id), activo));
      botonFav.textContent = activo ? "♥" : "♡";
    } else if (botonCompra && !botonCompra.disabled) {
      abrirCompra(id);
    }
  });

  document.getElementById("reiniciar-inventario").addEventListener("click", () => { reiniciarTienda(); mostrar(); });

  /* ----- Compra simulada ----- */
  const dialogo = document.getElementById("dialogo-compra");
  const formCompra = document.getElementById("formulario-compra");
  const cantidadInput = document.getElementById("compra-cantidad");
  const cuponInput = document.getElementById("compra-cupon");
  const totalTxt = document.getElementById("compra-total");
  const mensajeCompra = document.getElementById("compra-mensaje");
  const exito = document.getElementById("compra-exito");
  let productoEnCompra = null;

  function calcularCompra() {
    const cantidad = parseInt(cantidadInput.value, 10);
    const descuento = cuponInput.value.trim().toUpperCase() === CODIGO_DESCUENTO;
    const unidades = Number.isInteger(cantidad) && cantidad > 0 ? cantidad : 0;
    const base = productoEnCompra ? productoEnCompra.precio * unidades : 0;
    return { cantidad, descuento, total: Math.round(descuento ? base * 0.9 : base) };
  }
  function pintarTotal() {
    const { total, descuento } = calcularCompra();
    totalTxt.textContent = "Total: " + formatoPrecio(total) + (descuento ? " (10% de descuento aplicado)" : "");
  }
  function abrirCompra(id) {
    const p = obtenerProducto(id);
    const disponibles = stockDe(id);
    if (!p || disponibles < 1) return;
    productoEnCompra = p;
    document.getElementById("compra-producto").textContent = p.nombre + " · " + p.almacenamiento + " GB · " + formatoPrecio(p.precio);
    document.getElementById("compra-disponibles").textContent = "Disponibles: " + disponibles;
    cantidadInput.max = disponibles;
    cantidadInput.value = 1;
    cuponInput.value = "";
    mensajeCompra.textContent = "";
    formCompra.hidden = false;
    exito.hidden = true;
    pintarTotal();
    dialogo.showModal();
  }
  cantidadInput.addEventListener("input", pintarTotal);
  cuponInput.addEventListener("input", pintarTotal);
  document.getElementById("compra-cancelar").addEventListener("click", () => dialogo.close());
  document.getElementById("exito-cerrar").addEventListener("click", () => dialogo.close());
  dialogo.addEventListener("close", () => { productoEnCompra = null; });

  formCompra.addEventListener("submit", e => {
    e.preventDefault();
    if (!productoEnCompra) return;
    const { cantidad, descuento, total } = calcularCompra();
    const disponibles = stockDe(productoEnCompra.id);
    const cupon = cuponInput.value.trim();
    if (!Number.isInteger(cantidad) || cantidad < 1) { mensajeCompra.textContent = "Escribe una cantidad válida (1 o más)."; return; }
    if (cantidad > disponibles) { mensajeCompra.textContent = "Solo quedan " + disponibles + " unidades de este modelo."; return; }
    if (cupon && !descuento) { mensajeCompra.textContent = "El código de descuento no es válido."; return; }
    if (!descontarStock(productoEnCompra.id, cantidad)) { mensajeCompra.textContent = "No se pudo completar la compra. Intenta de nuevo."; return; }

    const codigo = crearPedido(productoEnCompra.id, cantidad, total);
    document.getElementById("exito-detalle").textContent = cantidad + " × " + productoEnCompra.nombre + ". Total: " + formatoPrecio(total) + ".";
    document.getElementById("exito-codigo").textContent = codigo;
    document.getElementById("exito-enlace").href = "servicios.html?codigo=" + codigo + "#seguimiento";
    formCompra.hidden = true;
    exito.hidden = false;
    mostrar(); // actualiza las existencias en pantalla
  });

  /* ----- Parámetros de la dirección (?q=, ?gama=, ?min=, ?max=) y #favoritos ----- */
  function aplicarParametros() {
    const params = new URLSearchParams(location.search);
    const q = params.get("q");
    if (q) buscador.value = q.slice(0, 60);
    const gamas = (params.get("gama") || "").split(",");
    formulario.querySelectorAll('input[name="gama"]').forEach(c => { if (gamas.includes(c.value)) c.checked = true; });
    const min = parseInt(params.get("min"), 10);
    const max = parseInt(params.get("max"), 10);
    if (Number.isFinite(min) && min >= 0) document.getElementById("precio-min").value = min;
    if (Number.isFinite(max) && max >= 0) document.getElementById("precio-max").value = max;
    if (location.hash === "#favoritos") casillaFavoritos.checked = true;
    if (hayFiltros(leerFiltros()) || window.matchMedia("(min-width: 1000px)").matches) panel.open = true;
  }
  window.addEventListener("hashchange", () => {
    if (location.hash === "#favoritos") { casillaFavoritos.checked = true; panel.open = true; mostrar(); }
  });

  aplicarParametros();
  mostrar();
})();