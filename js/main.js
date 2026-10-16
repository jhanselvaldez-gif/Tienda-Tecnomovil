/* main.js: pantalla de error inicial, easter egg y contador de favoritos */

function actualizarContadorFavoritos() {
  const contador = document.getElementById("contador-favoritos");
  if (contador) contador.textContent = leerFavoritos().length;
}

function iniciarPantallaError() {
  const pantalla = document.getElementById("pantalla-error");
  if (!pantalla) return;
  let yaRestaurado = false;
  try { yaRestaurado = sessionStorage.getItem("tm_restaurado") === "si"; } catch (e) { /* nada */ }
  if (yaRestaurado) { pantalla.remove(); return; }

  pantalla.classList.add("activa");
  document.body.classList.add("bloqueado");
  const boton = document.getElementById("boton-restaurar");
  const zonaProgreso = document.getElementById("error-progreso");
  const barra = document.getElementById("barra-recuperacion");
  const estado = document.getElementById("error-estado");
  const pasos = ["Buscando copias de seguridad...", "Verificando la integridad de los archivos...",
    "Restaurando el catálogo...", "Aplicando protecciones de seguridad...", "Sistema restaurado."];
  boton.focus();

  boton.addEventListener("click", () => {
    boton.disabled = true;
    zonaProgreso.hidden = false;
    let valor = 0;
    const intervalo = setInterval(() => {
      valor += 5;
      barra.value = valor;
      estado.textContent = pasos[Math.min(4, Math.floor(valor / 20))];
      if (valor >= 100) {
        clearInterval(intervalo);
        setTimeout(() => {
          pantalla.classList.add("saliendo");
          document.body.classList.remove("bloqueado");
          try { sessionStorage.setItem("tm_restaurado", "si"); } catch (e) { /* nada */ }
          setTimeout(() => pantalla.remove(), 500);
        }, 500);
      }
    }, 100);
  });
}

/* Easter egg: 5 clics seguidos en el © del pie de página */
function iniciarEasterEgg() {
  const objetivo = document.querySelector(".pie small");
  if (!objetivo) return;
  let clics = 0, temporizador;
  objetivo.addEventListener("click", () => {
    clics++;
    clearTimeout(temporizador);
    temporizador = setTimeout(() => { clics = 0; }, 3000);
    if (clics >= 5) { clics = 0; mostrarSecreto(); }
  });
}

function mostrarSecreto() {
  if (document.getElementById("dialogo-secreto")) return;
  const dialogo = document.createElement("dialog");
  dialogo.id = "dialogo-secreto";
  dialogo.className = "terminal";
  dialogo.setAttribute("aria-label", "Archivo secreto");
  const salida = document.createElement("pre");
  salida.className = "terminal-salida";
  const cerrar = document.createElement("button");
  cerrar.type = "button";
  cerrar.className = "boton boton-secundario";
  cerrar.textContent = "Cerrar terminal";
  dialogo.append(salida, cerrar);
  document.body.append(dialogo);

  const texto = [
    "> acceso_secreto.exe", "> Desencriptando el mensaje del USB...", "",
    "\"Tu negocio ha sido borrado de la existencia digital.",
    "Si quieres recuperarlo, deberás reinventarlo.\"", "",
    "> Reinventado: Tecnomovil, más segura que nunca.",
    "> Código secreto desbloqueado: " + CODIGO_DESCUENTO,
    "> Úsalo al comprar en el catálogo: 10% de descuento (ficticio)."
  ].join("\n");

  let tipeo = null;
  cerrar.addEventListener("click", () => dialogo.close());
  dialogo.addEventListener("close", () => { clearInterval(tipeo); dialogo.remove(); });
  dialogo.showModal();

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { salida.textContent = texto; return; }
  let i = 0;
  tipeo = setInterval(() => {
    salida.textContent = texto.slice(0, ++i);
    if (i >= texto.length) clearInterval(tipeo);
  }, 25);
}

iniciarPantallaError();
iniciarEasterEgg();
actualizarContadorFavoritos();