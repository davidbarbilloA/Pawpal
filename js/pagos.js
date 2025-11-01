/*****************************************************
 * 💳 PAWPAL - FORMULARIO DE PAGOS (POO)
 * Manejo del formulario, validación y almacenamiento
 *****************************************************/

class Pago {
  constructor(nombre, monto, metodo) {
    this.nombre = nombre;
    this.monto = monto;
    this.metodo = metodo;
    this.fecha = new Date().toLocaleString();
  }
}

class PagoManager {
  constructor(storageKey = "pagos") {
    this.storageKey = storageKey;
    this.pagos = this.cargarPagos();
  }

  cargarPagos() {
    return JSON.parse(localStorage.getItem(this.storageKey)) || [];
  }

  guardarPagos() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.pagos));
  }

  agregarPago(pago) {
    this.pagos.push(pago);
    this.guardarPagos();
  }
}

class PagoUI {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.mensaje = document.getElementById("mensaje");
    this.manager = new PagoManager();

    this.inicializarEventos();
  }

  inicializarEventos() {
    this.form.addEventListener("submit", (e) => this.procesarFormulario(e));
  }

  obtenerDatos() {
    return {
      nombre: document.getElementById("nombre").value.trim(),
      monto: document.getElementById("monto").value.trim(),
      metodo: document.getElementById("metodo").value
    };
  }

  validarDatos({ nombre, monto, metodo }) {
    if (!nombre || !monto || !metodo) {
      this.mostrarMensaje("❌ Por favor, completa todos los campos.", "red");
      return false;
    }
    return true;
  }

  mostrarMensaje(texto, color) {
    this.mensaje.textContent = texto;
    this.mensaje.style.color = color;
  }

  limpiarFormulario() {
    this.form.reset();
  }

  procesarFormulario(e) {
    e.preventDefault();
    const datos = this.obtenerDatos();

    if (!this.validarDatos(datos)) return;

    const nuevoPago = new Pago(datos.nombre, datos.monto, datos.metodo);
    this.manager.agregarPago(nuevoPago);

    this.mostrarMensaje("✅ Pago procesado correctamente.", "#2e7d32");
    this.limpiarFormulario();
  }
}

// ======== Inicialización ========
document.addEventListener("DOMContentLoaded", () => {
  new PagoUI("paymentForm");
});
