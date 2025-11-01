/*****************************************************
 * 🧩 PAWPAL - PORTAL ADMIN DE PQRs (POO)
 * Gestión, filtrado y control de acceso con LocalStorage
 *****************************************************/

class PQR {
  constructor(id, usuario, descripcion, estado = "pendiente") {
    this.id = id;
    this.usuario = usuario;
    this.descripcion = descripcion;
    this.estado = estado;
  }
}

class PQRManager {
  constructor(storageKey = "pqrs") {
    this.storageKey = storageKey;
    this.pqrs = this.cargar();
  }

  cargar() {
    const guardados = JSON.parse(localStorage.getItem(this.storageKey));
    if (guardados && guardados.length) return guardados;
    // Si no hay datos, inicializamos con algunos por defecto
    const iniciales = [
      new PQR(1, "Laura", "La niñera llegó tarde", "pendiente"),
      new PQR(2, "Carlos", "Excelente servicio", "resuelto"),
      new PQR(3, "Ana", "Problema con el pago", "revision"),
      new PQR(4, "Pedro", "No se presentó la niñera", "pendiente"),
      new PQR(5, "Sofía", "Niñera muy amable", "resuelto")
    ];
    localStorage.setItem(this.storageKey, JSON.stringify(iniciales));
    return iniciales;
  }

  guardar() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.pqrs));
  }

  filtrar(usuarioFiltro, estadoFiltro) {
    return this.pqrs.filter(pqr => {
      const coincideUsuario = pqr.usuario.toLowerCase().includes(usuarioFiltro.toLowerCase());
      const coincideEstado = estadoFiltro === "todos" || pqr.estado === estadoFiltro;
      return coincideUsuario && coincideEstado;
    });
  }

  cambiarEstado(id, nuevoEstado) {
    const pqr = this.pqrs.find(p => p.id === id);
    if (pqr) {
      pqr.estado = nuevoEstado;
      this.guardar();
    }
  }
}

class PQRUI {
  constructor(manager) {
    this.manager = manager;
    this.tabla = document.getElementById("tablaPQR");
    this.inputBuscar = document.getElementById("buscarUsuario");
    this.selectEstado = document.getElementById("filtrarEstado");

    this.inicializarEventos();
    this.mostrar(manager.pqrs);
  }

  inicializarEventos() {
    this.inputBuscar.addEventListener("input", () => this.aplicarFiltros());
    this.selectEstado.addEventListener("change", () => this.aplicarFiltros());
  }

  aplicarFiltros() {
    const texto = this.inputBuscar.value;
    const estado = this.selectEstado.value;
    const filtrados = this.manager.filtrar(texto, estado);
    this.mostrar(filtrados);
  }

  mostrar(lista) {
    this.tabla.innerHTML = "";
    lista.forEach(pqr => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${pqr.id}</td>
        <td>${pqr.usuario}</td>
        <td>${pqr.descripcion}</td>
        <td class="estado ${pqr.estado}">
          <select class="estado-select" data-id="${pqr.id}">
            <option value="pendiente" ${pqr.estado === "pendiente" ? "selected" : ""}>Pendiente</option>
            <option value="revision" ${pqr.estado === "revision" ? "selected" : ""}>Revisión</option>
            <option value="resuelto" ${pqr.estado === "resuelto" ? "selected" : ""}>Resuelto</option>
          </select>
        </td>
      `;
      // Evento para cambiar estado desde el select
      fila.querySelector(".estado-select").addEventListener("change", (e) => {
        const id = parseInt(e.target.dataset.id);
        const nuevoEstado = e.target.value;
        this.manager.cambiarEstado(id, nuevoEstado);
        this.aplicarFiltros();
      });

      this.tabla.appendChild(fila);
    });
  }
}

class AuthValidator {
  static validarAcceso() {
    const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
    if (!usuarioActual || usuarioActual.rol !== "admin") {
      alert("Acceso denegado. Solo los administradores pueden ingresar al portal de PQR.");
      window.location.href = "login.html";
    }
  }
}

// ======== Inicialización ========
document.addEventListener("DOMContentLoaded", () => {
  AuthValidator.validarAcceso();
  const pqrManager = new PQRManager();
  new PQRUI(pqrManager);
});
