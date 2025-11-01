class NavAuthController {
  constructor() {
    this.usuario = JSON.parse(localStorage.getItem("usuarioActual"));
    this.authContainer = document.querySelector(".auth-bottons");
    this.init();
  }

  init() {
    if (!this.authContainer) return;

    // Limpiar solo los botones creados dinámicamente
    this.authContainer.querySelectorAll(".dynamic-btn").forEach(btn => btn.remove());

    if (!this.usuario) {
      // 🔹 Si no hay sesión, dejamos los botones originales (no hacemos nada)
      return;
    }

    // 🔸 Si hay sesión, limpiamos los botones de login/registro
    this.authContainer.innerHTML = "";

    // 🔹 Agregar botones según el rol
    const fragment = document.createDocumentFragment();

    if (this.usuario.rol === "admin") {
      fragment.appendChild(this.crearBoton("Portal de PQR", "admin_revision.html"));
      fragment.appendChild(this.crearBoton("Portal de Pagos", "portal_pagos.html"));
    } else {
      fragment.appendChild(this.crearBoton("Portal de Pagos", "portal_pagos.html"));
      fragment.appendChild(this.crearBoton("Historial de Pagos", "historial_pagos.html"));
    }

    fragment.appendChild(this.crearBoton("Cerrar Sesión", "#", "logout"));
    this.authContainer.appendChild(fragment);

    this.agregarEventoLogout();
  }

  crearBoton(texto, link, id = "") {
    const a = document.createElement("a");
    a.textContent = texto;
    a.href = link;
    a.classList.add("btn", "dynamic-btn");
    if (id) a.id = id;
    return a;
  }

  agregarEventoLogout() {
    const logoutBtn = document.getElementById("logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("usuarioActual");
        window.location.href = "index.html";
      });
    }
  }
}

// Activar el controlador cuando cargue la página
document.addEventListener("DOMContentLoaded", () => new NavAuthController());
