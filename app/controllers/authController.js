const { conectarBD, desconectarDB } = require("../../db/config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//  LOGIN 
async function login(req, res) {
  const { usuario, contrasena } = req.body;

  if (!usuario || !contrasena)
    return res.status(400).json({ mensaje: "Usuario y contraseña requeridos" });

  let c;
  try {
    c = await conectarBD();

    // Buscar usuario por nombre de usuario o correo
    const [rows] = await c.execute(
      "SELECT * FROM administradores WHERE usuario = ? OR correo = ? LIMIT 1",
      [usuario, usuario]
    );

    if (!rows.length)
      return res.status(404).json({ mensaje: "Usuario no encontrado" });

    const admin = rows[0];

    // Comparar contraseñas ya encriptadas ajja
    const match = await bcrypt.compare(contrasena, admin.contrasena);
    if (!match) return res.status(401).json({ mensaje: "Contraseña incorrecta" });

    // Crea token con el jwt
    const token = jwt.sign(
      { id: admin.id, usuario: admin.usuario, correo: admin.correo },
      process.env.JWT_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRATION || "2h" }
    );

    res.json({
      mensaje: "Inicio de sesión exitoso",
      token,
      admin: {
        id: admin.id,
        nombre: admin.nombre,
        usuario: admin.usuario,
        correo: admin.correo,
        imagen: admin.imagen,
      },
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error en login", detalle: error.message });
  } finally {
    if (c) await desconectarDB(c);
  }
}

//  REGISTRO 
async function register(req, res) {
  const { nombre, usuario, correo, contrasena } = req.body;

  if (!nombre || !usuario || !correo || !contrasena)
    return res.status(400).json({ mensaje: "Todos los campos son requeridos" });

  let c;
  try {
    c = await conectarBD();

    // Verifica si ya existe
    const [existe] = await c.execute(
      "SELECT id FROM administradores WHERE usuario = ? OR correo = ?",
      [usuario, correo]
    );
    if (existe.length)
      return res.status(409).json({ mensaje: "El usuario o correo ya existe" });

    // Encripta la contraseñas
    const hash = await bcrypt.hash(contrasena, 10);

    const [result] = await c.execute(
      "INSERT INTO administradores (nombre, usuario, correo, contrasena) VALUES (?, ?, ?, ?)",
      [nombre, usuario, correo, hash]
    );

    res.json({
      mensaje: "Administrador registrado exitosamente",
      id: result.insertId,
      usuario,
      correo,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error en registro", detalle: error.message });
  } finally {
    if (c) await desconectarDB(c);
  }
}

module.exports = { login, register };
