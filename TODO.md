# TODO: Sistema de autenticación completo con mensajes de bienvenida

## Archivos modificados:
- [x] js/login.js: Sistema de autenticación con credenciales de admin (email: admin@pawpal.com, password: admin123, phone: +573001234567).
- [x] js/script.js: Lógica para mostrar mensaje de bienvenida y botón admin basado en rol del usuario.
- [x] index.html: Agregado contenedor para mensaje de bienvenida.
- [x] pqr.html: Botón de admin oculto por defecto, visible solo para usuarios con rol admin.

## Credenciales de administrador:
- **Email:** admin@pawpal.com
- **Contraseña:** admin123
- **Teléfono:** +573001234567

## Funcionalidad implementada:
1. Sistema de login con roles (user/admin).
2. Almacenamiento de sesión en localStorage.
3. Mensaje de bienvenida "¡Hola [usuario]!" en la página principal.
4. Botón "Portal de PQR" visible solo para administradores.
5. Portal PQR accesible únicamente para usuarios con rol admin.

## Nuevos cambios:
- [x] index.html: Agregar sección admin con botón PQR en el header.
- [x] js/script.js: Ajustar texto de saludo a "Hola, (usuario)" sin exclamación.
