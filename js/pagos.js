document.getElementById("paymentForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const monto = document.getElementById("monto").value.trim();
    const metodo = document.getElementById("metodo").value;
    const mensaje = document.getElementById("mensaje");

    if (!nombre || !monto || !metodo) {
        mensaje.textContent = "❌ Por favor, completa todos los campos.";
        mensaje.style.color = "red";
        return;
    }

    mensaje.textContent = "✅ Pago procesado correctamente.";
    mensaje.style.color = "#2e7d32";

    // Guardar temporalmente en localStorage
    const pago = {
        nombre,
        monto,
        metodo,
        fecha: new Date().toLocaleString()
    };

    let pagos = JSON.parse(localStorage.getItem("pagos")) || [];
    pagos.push(pago);
    localStorage.setItem("pagos", JSON.stringify(pagos));

    // Limpiar el formulario
    document.getElementById("paymentForm").reset();
});
