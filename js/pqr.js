// Datos simulados de PQR
let pqrs = JSON.parse(localStorage.getItem("pqrs")) || [
  { id: 1, usuario: "Laura", descripcion: "La niñera llegó tarde", estado: "pendiente" },
  { id: 2, usuario: "Carlos", descripcion: "Excelente servicio", estado: "resuelto" },
  { id: 3, usuario: "Ana", descripcion: "Problema con el pago", estado: "revision" },
  { id: 4, usuario: "Pedro", descripcion: "No se presentó la niñera", estado: "pendiente" },
  { id: 5, usuario: "Sofía", descripcion: "Niñera muy amable", estado: "resuelto" }
];

const tablaPQR = document.getElementById("tablaPQR");
const buscarUsuario = document.getElementById("buscarUsuario");
const filtrarEstado = document.getElementById("filtrarEstado");

// Función para renderizar la tabla
function mostrarPQR(filtrados) {
  tablaPQR.innerHTML = "";
  filtrados.forEach(pqr => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${pqr.id}</td>
      <td>${pqr.usuario}</td>
      <td>${pqr.descripcion}</td>
      <td class="estado ${pqr.estado}">
        <select class="estado-select" data-id="${pqr.id}" onchange="cambiarEstado(${pqr.id}, this.value)">
          <option value="pendiente" ${pqr.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
          <option value="revision" ${pqr.estado === 'revision' ? 'selected' : ''}>Revisión</option>
          <option value="resuelto" ${pqr.estado === 'resuelto' ? 'selected' : ''}>Resuelto</option>
        </select>
      </td>
    `;
    tablaPQR.appendChild(fila);
  });
}

// Filtros
function filtrarPQR() {
  const texto = buscarUsuario.value.toLowerCase();
  const estado = filtrarEstado.value;

  const resultado = pqrs.filter(pqr => {
    const coincideUsuario = pqr.usuario.toLowerCase().includes(texto);
    const coincideEstado = estado === "todos" || pqr.estado === estado;
    return coincideUsuario && coincideEstado;
  });

  mostrarPQR(resultado);
}

// Listeners
buscarUsuario.addEventListener("input", filtrarPQR);
filtrarEstado.addEventListener("change", filtrarPQR);

// Función para cambiar el estado de un PQR
function cambiarEstado(id, nuevoEstado) {
  const pqr = pqrs.find(p => p.id === id);
  if (pqr) {
    pqr.estado = nuevoEstado;
    // Aquí podrías guardar los cambios en localStorage o enviar a un servidor
    localStorage.setItem("pqrs", JSON.stringify(pqrs));
    filtrarPQR(); // Re-renderizar la tabla con los filtros actuales
  }
}

// Mostrar todos al cargar
mostrarPQR(pqrs);


// ======== VALIDACIÓN DE ACCESO (solo admin) ========

// Simulación de login guardado (puedes cambiarlo según tu login real)
const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));

// Si no hay usuario logueado o no es admin, redirigir
if (!usuarioActual || usuarioActual.rol !== "admin") {
  alert("Acceso denegado. Solo los administradores pueden ingresar al portal de PQR.");
  window.location.href = "login.html";
}
