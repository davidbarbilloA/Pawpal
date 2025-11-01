/*****************************************************
 * 🐾 PAWPAL - REGISTRO DE USUARIOS CON POO (SOLO JS)
 * Usa LocalStorage como base de datos simulada.
 *****************************************************/

// ======== Clase Usuario ==========
class Usuario {
  constructor({
    nombres,
    apellidos,
    telefono,
    emergencia_nombre,
    emergencia_apellido,
    emergencia_telefono,
    ciudad,
    correo,
    contrasena
  }) {
    this.nombres = nombres;
    this.apellidos = apellidos;
    this.telefono = telefono;
    this.emergencia_nombre = emergencia_nombre;
    this.emergencia_apellido = emergencia_apellido;
    this.emergencia_telefono = emergencia_telefono;
    this.ciudad = ciudad;
    this.correo = correo;
    this.contrasena = contrasena;
    this.fechaRegistro = new Date().toLocaleString();
  }
}

// ======== Clase GestorUsuarios (simula BD con LocalStorage) ==========
class GestorUsuarios {
  static obtenerTodos() {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
  }

  static guardar(usuario) {
    const usuarios = this.obtenerTodos();
    const existe = usuarios.some(u => u.correo === usuario.correo);
    if (existe) throw new Error("El correo ya está registrado 🛑");

    usuarios.push(usuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }
}

// ======== Clase FormularioRegistro ==========
class FormularioRegistro {
  constructor(selector) {
    this.form = document.querySelector(selector);
    if (!this.form) {
      console.error("❌ No se encontró el formulario con el selector:", selector);
      return;
    }
    this.inicializarEventos();
  }

  inicializarEventos() {
    this.form.addEventListener("submit", (e) => this.registrarUsuario(e));
  }

  obtenerDatos() {
    return {
      nombres: this.form.querySelector("#nombres").value.trim(),
      apellidos: this.form.querySelector("#apellidos").value.trim(),
      telefono: this.form.querySelector("#telefono").value.trim(),
      emergencia_nombre: this.form.querySelector("#nombre_emergencia").value.trim(),
      emergencia_apellido: this.form.querySelector("#apellido_emergencia").value.trim(),
      emergencia_telefono: this.form.querySelector("#telefono_emergencia").value.trim(),
      ciudad: this.form.querySelector("#ciudad").value.trim(),
      correo: this.form.querySelector("#correo").value.trim(),
      contrasena: this.form.querySelector("#contrasena").value.trim(),
      confirmar: this.form.querySelector("#confirmar").value.trim(),
    };
  }

  validarDatos(datos) {
    if (datos.contrasena !== datos.confirmar) {
      alert("❌ Las contraseñas no coinciden.");
      return false;
    }
    if (!datos.correo.includes("@")) {
      alert("❌ El correo no es válido.");
      return false;
    }
    return true;
  }

  registrarUsuario(e) {
    e.preventDefault();
    const datos = this.obtenerDatos();
    if (!this.validarDatos(datos)) return;

    try {
      const nuevoUsuario = new Usuario(datos);
      GestorUsuarios.guardar(nuevoUsuario);
      alert("✅ Usuario registrado correctamente 🐶");
      this.form.reset();
    } catch (error) {
      alert(error.message);
    }
  }
}

// ======== Inicialización ========
document.addEventListener("DOMContentLoaded", () => {
  new FormularioRegistro(".registration-form");
});
