// Mostrar el botón de PQR solo si el usuario es admin y mensaje de bienvenida
document.addEventListener("DOMContentLoaded", () => {
  const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
  const adminSection = document.getElementById("admin-section");
  const welcomeMessage = document.getElementById("welcome-message");

  const loginBtn = document.getElementById("login-btn");
  const registerBtn = document.getElementById("register-btn");
  const logoutBtn = document.getElementById("logout-btn");

  if (usuarioActual) {
    // Mostrar mensaje de bienvenida
    if (usuarioActual.rol === "admin") {
      welcomeMessage.innerHTML = '<select class="admin-dropdown" onchange="if(this.value === \'logout\') { logout(); this.selectedIndex = 0; }"><option>👤 Hola Admin</option><option value="logout">Cerrar Sesión</option></select>';
    } else {
      const displayName = usuarioActual.identifier.includes("@") ?
        usuarioActual.identifier.split("@")[0] :
        usuarioActual.identifier;
      welcomeMessage.innerHTML = `Hola, ${displayName}`;
    }
    welcomeMessage.style.display = "block";

    // Ocultar botones de login y registro
    if (loginBtn) loginBtn.style.display = "none";
    if (registerBtn) registerBtn.style.display = "none";

    // Mostrar logout solo para no-admins
    if (logoutBtn) {
      logoutBtn.style.display = usuarioActual.rol === "admin" ? "none" : "inline-block";
    }

    // Mostrar botón admin solo si es administrador
    if (usuarioActual.rol === "admin") {
      adminSection.style.display = "block";
    } else {
      adminSection.style.display = "none";
    }
  } else {
    // Usuario no logueado
    if (adminSection) adminSection.style.display = "none";
    if (welcomeMessage) welcomeMessage.style.display = "none";
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (registerBtn) registerBtn.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";
  }
});

// Función para cerrar sesión
function logout() {
  localStorage.removeItem("usuarioActual");
  window.location.href = "login.html";
}
