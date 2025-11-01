document.addEventListener("DOMContentLoaded", () => {
  const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
  const adminSection = document.getElementById("admin-section");
  const welcomeMessage = document.getElementById("welcome-message");
  const logoutBtn = document.getElementById("logout-btn");
  const portalPagosBtn = document.getElementById("portal-pagos-btn");

  if (usuarioActual) {
    // Mostrar mensaje de bienvenida
    if (usuarioActual.rol === "admin") {
      welcomeMessage.innerHTML = `
        <select class="admin-dropdown" onchange="if(this.value === 'logout') { logout(); this.selectedIndex = 0; }">
          <option>👤 Hola Admin</option>
          <option value="logout">Cerrar Sesión</option>
        </select>`;class Usuario {
  constructor(identifier, rol) {
    this.identifier = identifier;
    this.rol = rol;
  }

  static obtenerActual() {
    const data = localStorage.getItem("usuarioActual");
    if (!data) return null;
    const { identifier, rol } = JSON.parse(data);
    return new Usuario(identifier, rol);
  }

  static cerrarSesion() {
    localStorage.removeItem("usuarioActual");
    window.location.href = "login.html";
  }
}

class PortalApp {
  constructor() {
    this.usuarioActual = Usuario.obtenerActual();

    this.adminSection = document.getElementById("admin-section");
    this.welcomeMessage = document.getElementById("welcome-message");
    this.logoutBtn = document.getElementById("logout-btn");
    this.portalPagosBtn = document.getElementById("portal-pagos-btn");

    this.inicializar();
  }

  inicializar() {
    if (this.usuarioActual) {
      this.mostrarBienvenida();
      this.configurarBotones();
      this.mostrarSecciones();
    } else {
      this.ocultarTodo();
    }
  }

  mostrarBienvenida() {
    const { identifier, rol } = this.usuarioActual;

    if (rol === "admin") {
      this.welcomeMessage.innerHTML = `
        <select class="admin-dropdown" id="adminDropdown">
          <option>👤 Hola Admin</option>
          <option value="logout">Cerrar Sesión</option>
        </select>`;
      this.configurarDropdown();
    } else {
      const displayName = identifier.includes("@")
        ? identifier.split("@")[0]
        : identifier;
      this.welcomeMessage.innerHTML = `👋 Hola, ${displayName}`;
    }

    this.welcomeMessage.style.display = "block";
  }

  configurarDropdown() {
    const dropdown = document.getElementById("adminDropdown");
    dropdown.addEventListener("change", (e) => {
      if (e.target.value === "logout") {
        Usuario.cerrarSesion();
      }
    });
  }

  configurarBotones() {
    if (this.logoutBtn) {
      this.logoutBtn.style.display = "inline-block";
      this.logoutBtn.addEventListener("click", () => Usuario.cerrarSesion());
    }

    if (this.portalPagosBtn) {
      this.portalPagosBtn.style.display = "inline-block";
    }
  }

  mostrarSecciones() {
    if (this.adminSection) {
      this.adminSection.style.display =
        this.usuarioActual.rol === "admin" ? "block" : "none";
    }
  }

  ocultarTodo() {
    if (this.adminSection) this.adminSection.style.display = "none";
    if (this.welcomeMessage) this.welcomeMessage.style.display = "none";
    if (this.logoutBtn) this.logoutBtn.style.display = "none";
    if (this.portalPagosBtn) this.portalPagosBtn.style.display = "none";
  }
}

// Inicializar aplicación al cargar la página
document.addEventListener("DOMContentLoaded", () => new PortalApp());

    } else {
      const displayName = usuarioActual.identifier.includes("@")
        ? usuarioActual.identifier.split("@")[0]
        : usuarioActual.identifier;
      welcomeMessage.innerHTML = `👋 Hola, ${displayName}`;
    }
    welcomeMessage.style.display = "block";

    // Mostrar botón de logout
    logoutBtn.style.display = "inline-block";

    // Mostrar botón de pagos para todos los usuarios logueados
    portalPagosBtn.style.display = "inline-block";

    // Mostrar sección admin solo si el rol es admin
    if (usuarioActual.rol === "admin") {
      adminSection.style.display = "block";
    } else {
      adminSection.style.display = "none";
    }

  } else {
    // Usuario no logueado
    if (adminSection) adminSection.style.display = "none";
    if (welcomeMessage) welcomeMessage.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (portalPagosBtn) portalPagosBtn.style.display = "none";
  }
});

// Función para cerrar sesión
function logout() {
  localStorage.removeItem("usuarioActual");
  window.location.href = "login.html";
}
