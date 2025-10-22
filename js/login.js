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

    // 🔒 Simulación temporal (sin backend)
    alert(`Inicio de sesión exitoso como ${identifier}`);
    window.location.href = "index.html";
  });
});
