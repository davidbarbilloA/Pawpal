/**
 * Clase que gestiona el proceso de registro de usuarios utilizando localStorage.
 */
class RegistrationManager {
    constructor(formSelector, redirectPage) {
        // Inicializa las propiedades de la clase
        this.form = document.querySelector(formSelector);
        this.redirectPage = redirectPage; // 'login.html'
        
        if (this.form) {
            this.init();
        } else {
            console.error("No se encontró el formulario de registro con el selector: " + formSelector);
        }
    }

    /**
     * Inicializa los listeners de eventos.
     */
    init() {
        // Usamos una función flecha para mantener el contexto 'this' (la instancia de la clase)
        this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    }

    /**
     * Captura los datos del formulario y los devuelve como un objeto.
     * @returns {Object} Objeto con los datos del formulario.
     */
    getFormData() {
        return {
            nombres: this.form.querySelector("#nombres").value.trim(),
            apellidos: this.form.querySelector("#apellidos").value.trim(),
            telefono: this.form.querySelector("#telefono").value.trim(),
            emergencia_nombre: this.form.querySelector("#nombre_emergencia").value.trim(),
            emergencia_apellido: this.form.querySelector("#apellido_emergencia").value.trim(),
            emergencia_telefono: this.form.querySelector("#telefono_emergencia").value.trim(),
            ciudad: this.form.querySelector("#ciudad").value.trim(),
            correo: this.form.querySelector("#correo").value.trim(),
            contrasena: this.form.querySelector("#contrasena").value,
            confirmar: this.form.querySelector("#confirmar").value,
        };
    }

    /**
     * Valida la coincidencia de contraseñas.
     * @param {Object} formData - Datos del formulario.
     * @returns {boolean} True si las contraseñas coinciden.
     */
    validatePasswords(formData) {
        if (formData.contrasena !== formData.confirmar) {
            alert("Las contraseñas no coinciden.");
            return false;
        }
        return true;
    }

    /**
     * Intenta guardar el usuario en localStorage.
     * @param {Object} formData - Datos del formulario.
     * @returns {boolean} True si el registro fue exitoso.
     */
    saveUserToLocalStorage(formData) {
        try {
            // 1. Obtener usuarios existentes
            let users = JSON.parse(localStorage.getItem('users')) || [];

            // 2. Verificar si el correo ya existe
            const userExists = users.some(user => user.correo === formData.correo);
            if (userExists) {
                alert("Error: El correo electrónico ya está registrado.");
                return false;
            }

            // 3. Crear y añadir el nuevo usuario
            const newUser = {
                nombres: formData.nombres,
                apellidos: formData.apellidos,
                correo: formData.correo,
                contrasena: formData.contrasena,
                // Puedes añadir más campos aquí si es necesario
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            return true; // Éxito
        } catch (error) {
            console.error("Error al guardar en localStorage:", error);
            alert("Hubo un problema al registrar localmente. Intenta más tarde.");
            return false; // Falla
        }
    }

    /**
     * Redirige al usuario a la página de destino.
     */
    redirect() {
        window.location.href = this.redirectPage;
    }

    /**
     * Manejador principal del evento de envío del formulario.
     */
    handleSubmit(e) {
        e.preventDefault();

        const formData = this.getFormData();

        // 1. Validar
        if (!this.validatePasswords(formData)) {
            return;
        }

        // 2. Guardar y verificar éxito
        if (this.saveUserToLocalStorage(formData)) {
            // 3. Éxito y redirección
            alert("Registro exitoso 🎉. Serás redirigido a Iniciar Sesión.");
            this.form.reset();
            this.redirect();
        }
    }
}

// Inicialización de la clase al cargar el documento
document.addEventListener("DOMContentLoaded", () => {
    // Se crea una instancia de la clase para manejar el formulario de registro
    const registrationApp = new RegistrationManager(".registration-form", "login.html");
});
>>>>>>> 7f2881beb64b207b3c69858a90923396ee864244
