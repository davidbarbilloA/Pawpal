document.addEventListener("DOMContentLoaded", () => {
    const tablaBody = document.querySelector("#tablaPagos tbody");
    const botonBorrar = document.getElementById("borrarPagos");

    // Cargar pagos desde localStorage
    const pagos = JSON.parse(localStorage.getItem("pagos")) || [];

    if (pagos.length === 0) {
        const fila = document.createElement("tr");
        fila.innerHTML = `<td colspan="4">No hay pagos registrados.</td>`;
        tablaBody.appendChild(fila);
    } else {
        pagos.forEach(pago => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${pago.nombre}</td>
                <td>$${parseFloat(pago.monto).toLocaleString("es-CO")}</td>
                <td>${pago.metodo}</td>
                <td>${pago.fecha}</td>
            `;
            tablaBody.appendChild(fila);
        });
    }

    // Borrar todos los pagos
    botonBorrar.addEventListener("click", () => {
        if (confirm("¿Seguro que deseas borrar todos los pagos guardados?")) {
            localStorage.removeItem("pagos");
            location.reload();
        }
    });
});
