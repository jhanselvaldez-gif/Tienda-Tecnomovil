/* contacto.js: validación del formulario y animación del registro de eventos */
(function () {
  const form = document.getElementById("formulario-contacto");
  if (form) {
    const ASUNTOS = ["producto", "pedido", "garantia", "otro"];
    const mensajeFinal = document.getElementById("mensaje-contacto");

    function revisar(campo, idError, textoError) {
      document.getElementById(idError).textContent = textoError;
      if (textoError) campo.setAttribute("aria-invalid", "true"); else campo.removeAttribute("aria-invalid");
      return !textoError;
    }

    form.addEventListener("submit", e => {
      e.preventDefault();
      const nombre = document.getElementById("nombre");
      const correo = document.getElementById("correo");
      const asunto = document.getElementById("asunto");
      const mensaje = document.getElementById("mensaje");
      const privacidad = document.getElementById("privacidad-aceptada");
      const n = nombre.value.trim(), c = correo.value.trim(), m = mensaje.value.trim();

      const resultados = [
        revisar(nombre, "error-nombre", n.length >= 2 && n.length <= 60 ? "" : "Escribe tu nombre (entre 2 y 60 letras)."),
        revisar(correo, "error-correo", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c) && c.length <= 100 ? "" : "Escribe un correo válido."),
        revisar(mensaje, "error-mensaje", m.length >= 10 && m.length <= 500 ? "" : "El mensaje debe tener entre 10 y 500 caracteres."),
        revisar(privacidad, "error-privacidad", privacidad.checked ? "" : "Debes aceptar el aviso de privacidad.")
      ];
      if (!ASUNTOS.includes(asunto.value)) { mensajeFinal.textContent = "Elige un asunto válido."; return; }
      if (resultados.includes(false)) {
        mensajeFinal.textContent = "Revisa los campos marcados.";
        form.querySelector('[aria-invalid="true"]').focus();
        return;
      }
      // Simulación: el mensaje no se envía ni se guarda en ningún lado
      mensajeFinal.textContent = "Gracias, " + n + ". Recibimos tu mensaje (simulado: no se guardó ningún dato).";
      form.reset();
    });
  }

  // El registro de eventos aparece fila por fila al llegar a la tabla
  const tabla = document.querySelector(".tabla-registro");
  if (tabla && "IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    tabla.classList.add("registro-animado");
    const filas = tabla.querySelectorAll("tbody tr");
    const observador = new IntersectionObserver(entradas => {
      if (entradas[0].isIntersecting) {
        filas.forEach((fila, i) => { fila.style.animationDelay = i * 250 + "ms"; fila.classList.add("aparece"); });
        observador.disconnect();
      }
    }, { threshold: 0.1 });
    observador.observe(tabla);
  }
})();