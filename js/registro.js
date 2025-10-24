document.addEventListener("DOMContentLoaded", () => {
const form = document.querySelector(".registration-form");

form.addEventListener("submit", async (e) => {
e.preventDefault(); // Evita el envío tradicional

// Captura los datos del formulario
const formData = {
    nombres: form.querySelector("#nombres").value,
    apellidos: form.querySelector("#apellidos").value,
    telefono: form.querySelector("#telefono").value,
    emergencia_nombre: form.querySelector("#nombre_emergencia").value,
    emergencia_apellido: form.querySelector("#apellido_emergencia").value,
    emergencia_telefono: form.querySelector("#telefono_emergencia").value,
    ciudad: form.querySelector("#ciudad").value,
    correo: form.querySelector("#correo").value,
    contrasena: form.querySelector("#contrasena").value,
    confirmar: form.querySelector("#confirmar").value,
};

// Validación básica
if (formData.contrasena !== formData.confirmar) {
    alert("Las contraseñas no coinciden.");
    return;
}

try {
    const response = await fetch("http://localhost:3000/api/registro", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
    });

    const result = await response.json();
    if (response.ok) {
    alert("Registro exitoso 🎉");
    form.reset();
    } else {
    alert("Error: " + result.message);
    }
} catch (error) {
    console.error("Error al enviar datos:", error);
    alert("Hubo un problema al registrar. Intenta más tarde.");
}
});
});

// Backend con Node.js + Express 
/*
// archivo: server.js
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a la base de datos
const db = mysql.createConnection({
  host: "localhost",
  user: "tu_usuario",
  password: "tu_contraseña",
  database: "pawpal_db",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Conectado a la base de datos 🐾");
});

// Ruta para recibir el registro
app.post("/api/registro", (req, res) => {
  const {
    nombres,
    apellidos,
    telefono,
    emergencia_nombre,
    emergencia_apellido,
    emergencia_telefono,
    ciudad,
    correo,
    contrasena,
  } = req.body;

  const sql = `INSERT INTO usuarios 
    (nombres, apellidos, telefono, emergencia_nombre, emergencia_apellido, emergencia_telefono, ciudad, correo, contrasena) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    sql,
    [
      nombres,
      apellidos,
      telefono,
      emergencia_nombre,
      emergencia_apellido,
      emergencia_telefono,
      ciudad,
      correo,
      contrasena,
    ],
    (err, result) => {
      if (err) {
        console.error("Error al insertar:", err);
        res.status(500).json({ message: "Error al registrar usuario" });
      } else {
        res.status(200).json({ message: "Usuario registrado correctamente" });
      }
    }
  );
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});

*/
