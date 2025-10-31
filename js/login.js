document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const identifier = form.identifier.value.trim();
    const password = form.password.value.trim();

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const isPhone = /^\+?\d{7,15}$/.test(identifier);

    if (!isEmail && !isPhone) {
      alert("Por favor ingresa un correo o número de teléfono válido.");
      return;
    }

    if (password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    // 🔒 Simulación temporal (sin backend) - Credenciales de admin
    const adminCredentials = {
      email: "admin@pawpal.com",
      password: "admin123",
      phone: "+573001234567"
    };

    let userRole = "user"; // Por defecto usuario normal

    // Verificar si es admin
    if ((identifier === adminCredentials.email || identifier === adminCredentials.phone) && password === adminCredentials.password) {
      userRole = "admin";
    }

    // Guardar usuario actual en localStorage
    const usuarioActual = {
      identifier: identifier,
      rol: userRole,
      loginTime: new Date().toISOString()
    };

    localStorage.setItem("usuarioActual", JSON.stringify(usuarioActual));

    // Mostrar mensaje de éxito sin el rol
    alert(`Inicio de sesión exitoso como ${identifier}`);
    window.location.href = "index.html";
  });
});
