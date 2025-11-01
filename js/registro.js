document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".registration-form");

    form.addEventListener("submit", (e) => {
        e.preventDefault(); 

        // 1. Captura los datos del formulario
        const formData = {
            nombres: form.querySelector("#nombres").value.trim(),
            apellidos: form.querySelector("#apellidos").value.trim(),
            telefono: form.querySelector("#telefono").value.trim(),
            emergencia_nombre: form.querySelector("#nombre_emergencia").value.trim(),
            emergencia_apellido: form.querySelector("#apellido_emergencia").value.trim(),
            emergencia_telefono: form.querySelector("#telefono_emergencia").value.trim(),
            ciudad: form.querySelector("#ciudad").value.trim(),
            correo: form.querySelector("#correo").value.trim(),
            contrasena: form.querySelector("#contrasena").value,
            confirmar: form.querySelector("#confirmar").value,
        };
        
        // 2. Validación básica
        if (formData.contrasena !== formData.confirmar) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        // 3. Lógica de registro con localStorage
        try {
            // Obtener usuarios existentes o inicializar un array vacío
            let users = JSON.parse(localStorage.getItem('users')) || [];

            // 4. Verificar si el correo ya está registrado
            const userExists = users.some(user => user.correo === formData.correo);
            if (userExists) {
                alert("Error: El correo electrónico ya está registrado.");
                return;
            }

            // Crear el nuevo objeto de usuario (sin la confirmación de contraseña)
            const newUser = {
                nombres: formData.nombres,
                apellidos: formData.apellidos,
                correo: formData.correo,
                contrasena: formData.contrasena, // En un entorno real, ¡nunca guardarías contraseñas así!
                // ... el resto de datos que quieras guardar
            };

            // 5. Añadir el nuevo usuario y guardar en localStorage
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            // 6. Registro exitoso y redirección
            alert("Registro exitoso 🎉. Serás redirigido a Iniciar Sesión (Guardado en localStorage).");
            form.reset();
            window.location.href = "login.html"; 

        } catch (error) {
            console.error("Error al guardar en localStorage:", error);
            alert("Hubo un problema al registrar localmente. Intenta más tarde.");
        }
    });
});