class Pago {
    constructor(nombre, monto, metodo, fecha) {
        this.nombre = nombre;
        this.monto = monto;
        this.metodo = metodo;
        this.fecha = fecha;
    }
}

class GestorPagos {
    constructor(tablaSelector, botonBorrarSelector) {
        this.tablaBody = document.querySelector(`${tablaSelector} tbody`);
        this.botonBorrar = document.querySelector(botonBorrarSelector);
        this.pagos = this.cargarPagos();
        this.inicializar();
    }

    cargarPagos() {
        return JSON.parse(localStorage.getItem("pagos")) || [];
    }

    guardarPagos() {
        localStorage.setItem("pagos", JSON.stringify(this.pagos));
    }

    mostrarPagos() {
        this.tablaBody.innerHTML = ""; // Limpia tabla
        if (this.pagos.length === 0) {
            const fila = document.createElement("tr");
            fila.innerHTML = `<td colspan="4">No hay pagos registrados.</td>`;
            this.tablaBody.appendChild(fila);
            return;
        }

        this.pagos.forEach(pago => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${pago.nombre}</td>
                <td>$${parseFloat(pago.monto).toLocaleString("es-CO")}</td>
                <td>${pago.metodo}</td>
                <td>${pago.fecha}</td>
            `;
            this.tablaBody.appendChild(fila);
        });
    }

    borrarPagos() {
        if (confirm("¿Seguro que deseas borrar todos los pagos guardados?")) {
            localStorage.removeItem("pagos");
            this.pagos = [];
            this.mostrarPagos();
        }
    }

    inicializar() {
        this.mostrarPagos();
        this.botonBorrar.addEventListener("click", () => this.borrarPagos());
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new GestorPagos("#tablaPagos", "#borrarPagos");
});
