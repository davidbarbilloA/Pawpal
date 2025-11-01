/*****************************************************
 * 🐾 PAWPAL - REGISTRO DE USUARIOS CON POO (FULL)
 * Incluye frontend (formulario) + backend (servidor)
 *****************************************************/

// ==========================
// 🌐 BACKEND (Node.js + Express + MySQL)
// ==========================
if (typeof require !== "undefined" && typeof module !== "undefined") {
  const express = require("express");
  const cors = require("cors");
  const mysql = require("mysql2");

  class Database {
    constructor(config) {
      this.connection = mysql.createConnection(config);
    }

    conectar() {
      this.connection.connect((err) => {
        if (err) throw err;
        console.log("✅ Conectado a la base de datos 🐾");
      });
    }

    ejecutar(query, params = []) {
      return new Promise((resolve, reject) => {
        this.connection.query(query, params, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
    }
  }

  class Servidor {
    constructor() {
      this.app = express();
      this.port = 3000;
      this.db = new Database({
        host: "localhost",
        user: "tu_usuario",
        password: "tu_contraseña",
        database: "pawpal_db",
      });

      this.configurarMiddlewares();
      this.definirRutas();
    }

    configurarMiddlewares() {
      this.app.use(cors());
      this.app.use(express.json());
    }

    definirRutas() {
      this.app.post("/api/registro", async (req, res) => {
        try {
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

          const sql = `
            INSERT INTO usuarios 
            (nombres, apellidos, telefono, emergencia_nombre, emergencia_apellido, emergencia_telefono, ciudad, correo, contrasena)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

          await this.db.ejecutar(sql, [
            nombres,
            apellidos,
            telefono,
            emergencia_nombre,
            emergencia_apellido,
            emergencia_telefono,
            ciudad,
            correo,
            contrasena,
          ]);

          res.status(200).json({ message: "Usuario registrado correctamente 🐶" });
        } catch (error) {
          console.error("❌ Error al insertar:", error);
          res.status(500).json({ message: "Error al registrar usuario" });
        }
      });
    }

    iniciar() {
      this.db.conectar();
      this.app.listen(this.port, () =>
        console.log(`🚀 Servidor corriendo en http://localhost:${this.port}`)
      );
    }
  }

  // Descomenta esta línea si quieres que el servidor se inicie directamente:
  // new Servidor().iniciar();
}

// ==========================
// 💻 FRONTEND (Formulario en HTML con Fetch)
// ==========================

class RegistroAPI {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async registrar(datos) {
    const response = await fetch(this.baseURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Error al registrar");
    return result;
  }
}

class RegistroForm {
  constructor(selector) {
    this.form = document.querySelector(selector);
    if (!this.form) return;

    this.api = new RegistroAPI("http://localhost:3000/api/registro");
    this.inicializarEventos();
  }

  inicializarEventos() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
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

  async handleSubmit(e) {
    e.preventDefault();
    const datos = this.obtenerDatos();
    if (!this.validarDatos(datos)) return;

    try {
      const result = await this.api.registrar(datos);
      alert("✅ Registro exitoso: " + result.message);
      this.form.reset();
    } catch (error) {
      console.error("Error al registrar:", error);
      alert("⚠️ Hubo un problema al registrar. Intenta más tarde.");
    }
  }
}

// Inicializar solo si hay DOM disponible (navegador)
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    new RegistroForm(".registration-form");
  });
}
