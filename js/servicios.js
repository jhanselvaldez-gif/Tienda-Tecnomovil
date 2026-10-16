/* servicios.js: seguimiento de pedido por etapas */
(function () {
  const formulario = document.getElementById("formulario-pedido");
  if (!formulario) return;

  const campo = document.getElementById("codigo-pedido");
  const mensaje = document.getElementById("mensaje-pedido");
  const resultado = document.getElementById("resultado-pedido");
  const titulo = document.getElementById("pedido-titulo");
  const resumen = document.getElementById("pedido-resumen");
  const barra = document.getElementById("pedido-progreso");
  const estimado = document.getElementById("pedido-estimado");
  const etapas = document.querySelectorAll("#etapas-pedido li");

  const SEGUNDOS_POR_ETAPA = 30; // los pedidos nuevos avanzan una etapa cada 30 s (demostración)
  const ESTIMADOS = ["24 a 48 horas", "menos de 24 horas", "menos de 12 horas", "las próximas horas"];
  const PEDIDOS_DEMO = {
    "TM-1001": { id: "iphone-15-pro-max", cantidad: 1, etapa: 2 },
    "TM-1002": { id: "samsung-a36", cantidad: 2, etapa: 4 },
    "TM-1003": { id: "moto-g35", cantidad: 1, etapa: 5 }
  };
  let refresco = null;

  function detenerRefresco() { clearInterval(refresco); refresco = null; }

  function buscarPedido(codigo) {
    if (PEDIDOS_DEMO[codigo]) {
      const d = PEDIDOS_DEMO[codigo];
      return { producto: obtenerProducto(d.id), cantidad: d.cantidad, etapa: d.etapa };
    }
    const real = leerPedidos().find(p => p.codigo === codigo);
    if (!real) return null;
    const segundos = (Date.now() - real.fecha) / 1000;
    return { producto: obtenerProducto(real.id), cantidad: real.cantidad, etapa: Math.min(5, 1 + Math.floor(segundos / SEGUNDOS_POR_ETAPA)) };
  }

  function pintar(codigo) {
    const pedido = buscarPedido(codigo);
    if (!pedido || !pedido.producto) return false;
    titulo.textContent = "Pedido " + codigo;
    resumen.textContent = pedido.cantidad + " × " + pedido.producto.nombre;
    barra.value = pedido.etapa * 20;
    etapas.forEach((li, i) => {
      const n = i + 1;
      li.classList.toggle("completada", n < pedido.etapa);
      li.classList.toggle("actual", n === pedido.etapa);
      if (n === pedido.etapa) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
    });
    estimado.textContent = pedido.etapa === 5 ? "Tu pedido fue entregado." : "Llegada estimada: " + ESTIMADOS[pedido.etapa - 1] + ".";
    resultado.hidden = false;
    if (pedido.etapa === 5) detenerRefresco();
    return true;
  }

  function buscar(entrada) {
    const codigo = entrada.trim().toUpperCase();
    detenerRefresco();
    resultado.hidden = true;
    if (!/^TM-\d{4,6}$/.test(codigo)) {
      campo.setAttribute("aria-invalid", "true");
      mensaje.textContent = "El código debe tener el formato TM-1234.";
      return;
    }
    campo.removeAttribute("aria-invalid");
    refresco = setInterval(() => pintar(codigo), 5000); // se actualiza solo
    if (!pintar(codigo)) {
      detenerRefresco();
      mensaje.textContent = "No encontramos un pedido con ese código. Revisa que esté bien escrito.";
      return;
    }
    mensaje.textContent = "Pedido encontrado.";
  }

  formulario.addEventListener("submit", e => { e.preventDefault(); buscar(campo.value); });

  const codigoUrl = new URLSearchParams(location.search).get("codigo");
  if (codigoUrl) { campo.value = codigoUrl.slice(0, 12); buscar(campo.value); }
})();