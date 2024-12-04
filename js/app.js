const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("../db");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

// Ruta para crear una nueva reserva
app.post("/reservar", (req, res) => {
  const { id_usuario, fecha_reservacion, hora_reservacion, estado } = req.body;

  const query =
    "INSERT INTO reservaciones (id_usuario, fecha_reservacion, hora_reservacion, estado) VALUES (?, ?, ?, ?)";

  db.query(
    query,
    [id_usuario, fecha_reservacion, hora_reservacion, estado],
    (err, result) => {
      if (err) {
        console.error("Error al crear la reserva:", err.stack);
        return res.status(500).json({ error: "Error al crear la reserva" });
      }
      res
        .status(201)
        .json({ message: "Reserva creada", id_reservacion: result.insertId });
    }
  );
});

// Ruta para elegir la mesa (sin el campo numero_personas)
app.post("/mesaReservaciones", (req, res) => {
  const reservaciones = req.body;
  const query = ` INSERT INTO mesaReservaciones (id_usuario, nombre_usuario, email, telefono, fecha_reservacion, hora_reservacion, estado) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  reservaciones.forEach((reservacion) => {
    db.query(
      query,
      [
        reservacion.id_usuario,
        reservacion.nombre_usuario,
        reservacion.email,
        reservacion.telefono,
        reservacion.fecha_reservacion,
        reservacion.hora_reservacion,
        reservacion.estado,
      ],
      (err, result) => {
        if (err) {
          console.error("Error al crear la reservación:", err.stack);
          return res
            .status(500)
            .json({ error: "Error al crear la reservación" });
        }
      }
    );
  });
  res.status(201).json({ message: "Reservación guardada con éxito" });
});

// Ruta para registrar un nuevo usuario
app.post("/registro", (req, res) => {
  const {
    nombre_usuario,
    contrasena,
    email,
    nombre_completo,
    telefono,
    direccion,
  } = req.body;

  const query =
    "INSERT INTO usuarios (nombre_usuario, contrasena, email, nombre_completo, telefono, direccion) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(
    query,
    [nombre_usuario, contrasena, email, nombre_completo, telefono, direccion],
    (err, result) => {
      if (err) {
        console.error("Error al registrar el usuario:", err.stack);
        return res.status(500).json({ error: "Error al registrar el usuario" });
      }
      res
        .status(201)
        .json({ message: "Usuario registrado", id_usuario: result.insertId });
    }
  );
});

// Ruta para validar el login
app.post("/login", (req, res) => {
  const { nombre_usuario, contrasena } = req.body;
  const query =
    "SELECT * FROM usuarios WHERE nombre_usuario = ? AND contrasena = ?";
  db.query(query, [nombre_usuario, contrasena], (err, results) => {
    if (err) {
      console.error("Error al iniciar sesión:", err.stack);
      return res.status(500).json({ error: "Error al iniciar sesión" });
    }
    if (results.length > 0) {
      res
        .status(200)
        .json({ message: "Inicio de sesión exitoso", usuario: results[0] });
    } else {
      res
        .status(401)
        .json({ error: "Nombre de usuario o contraseña incorrectos" });
    }
  });
});

// Ruta para recibir opiniones
app.post("/opiniones", (req, res) => {
  const { username, rating, comment, date } = req.body;
  console.log("Datos recibidos:", req.body); // Log adicional para verificar los datos recibidos

  const query = `INSERT INTO opiniones (username, rating, comment, date) VALUES (?, ?, ?, ?)`;

  db.query(query, [username, rating, comment, date], (err, result) => {
    if (err) {
      console.error("Error al guardar la opinión:", err); // Log de error detallado
      console.log("Consulta SQL fallida:", query); // Log de la consulta SQL
      console.log("Valores:", [username, rating, comment, date]); // Log de los valores usados
      return res.status(500).json({ error: "Error al guardar la opinión" });
    }
    res.status(201).json({ message: "Opinión guardada con éxito" });
  });
});

// Ruta para obtener opiniones
app.get("/opiniones", (req, res) => {
  const query = "SELECT * FROM opiniones ORDER BY date DESC";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener opiniones:", err.stack);
      return res.status(500).json({ error: "Error al obtener opiniones" });
    }
    res.status(200).json(results);
  });
});


//Ruta para obtener reservaciones por parte del admin
app.get('/reservaciones', (req, res) => {
  const query = 'SELECT * FROM reservaciones';
  db.query(query, (err, results) => {
      if (err) {
          console.error('Error al obtener las reservaciones:', err.stack);
          return res.status(500).json({ error: 'Error al obtener las reservaciones' });
      }
      res.status(200).json(results);
  });
});

// Servidor escuchando en el puerto especificado
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
