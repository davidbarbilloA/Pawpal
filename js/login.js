class Usuario {
    constructor(identifier, rol) {
        this.identifier = identifier;
        this.rol = rol;
        this.loginTime = new Date().toISOString();
    }

    guardarEnLocalStorage() {
        localStorage.setItem("usuarioActual", JSON.stringify(this));
    }
}

class ValidadorLogin {
    static esEmail(valor) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
    }

    static esTelefono(valor) {
        return /^\+?\d{7,15}$/.test(valor);
    }

    static validarCampos(identifier, password) {
        if (!ValidadorLogin.esEmail(identifier) && !ValidadorLogin.esTelefono(identifier)) {
            alert("Por favor ingresa un correo o número de teléfono válido.");
            return false;
        }

        if (password.length < 6) {
            alert("La contraseña debe tener al menos 6 caracteres.");
            return false;
        }

        return true;
    }
}

class LoginApp {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        this.admin = {
            email: "admin@pawpal.com",
            password: "admin123",
            phone: "+573001234567"
        };
        this.inicializar();
    }

    inicializar() {
        this.form.addEventListener("submit", (event) => this.handleSubmit(event));
    }

    handleSubmit(event) {
        event.preventDefault();

        const identifier = this.form.identifier.value.trim();
        const password = this.form.password.value.trim();

        if (!ValidadorLogin.validarCampos(identifier, password)) return;

        const userRole = this.verificarRol(identifier, password);
        const usuario = new Usuario(identifier, userRole);
        usuario.guardarEnLocalStorage();

        alert(`Inicio de sesión exitoso como ${identifier}`);
        window.location.href = "index.html";
    }

    verificarRol(identifier, password) {
        const { email, phone, password: adminPass } = this.admin;
        if ((identifier === email || identifier === phone) && password === adminPass) {
            return "admin";
        }
        return "user";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new LoginApp("#loginForm");
});
