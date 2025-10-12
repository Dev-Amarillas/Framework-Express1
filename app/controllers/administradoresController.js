const con = require("../../db/config");
const { validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");

// === Listar administradores ===
async function index(req, res) {
  let c;
  try {
    c = await con.conectarBD();
    const [rows] = await c.execute("SELECT * FROM administradores");
    res.json({ datos: rows });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al obtener administradores: " + error.message });
  } finally {
    await con.desconectarDB(c);
  }
}

// === Crear administrador (sin imagen) ===
async function store(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  const { nombre, usuario, correo, contrasena } = req.body;
  let c;
  try {
    c = await con.conectarBD();
    const [result] = await c.execute(
      "INSERT INTO administradores (nombre, usuario, correo, contrasena) VALUES (?, ?, ?, ?)",
      [nombre, usuario, correo, contrasena]
    );
    res.json({ id: result.insertId, nombre, usuario, correo });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al crear administrador: " + error.message });
  } finally {
    await con.desconectarDB(c);
  }
}

// === Mostrar por ID ===
async function show(req, res) {
  const { id } = req.params;
  let c;
  try {
    c = await con.conectarBD();
    const [rows] = await c.execute("SELECT * FROM administradores WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ mensaje: "Administrador no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al buscar administrador: " + error.message });
  } finally {
    await con.desconectarDB(c);
  }
}

// === Actualizar ===
async function update(req, res) {
  const { id } = req.params;
  const { nombre, usuario, correo, contrasena } = req.body;
  let c;
  try {
    c = await con.conectarBD();
    const [result] = await c.execute(
      "UPDATE administradores SET nombre=?, usuario=?, correo=?, contrasena=? WHERE id=?",
      [nombre, usuario, correo, contrasena, id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ mensaje: "Administrador no encontrado" });
    res.json({ id, nombre, usuario, correo });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar administrador: " + error.message });
  } finally {
    await con.desconectarDB(c);
  }
}

// === Eliminar ===
async function destroy(req, res) {
  const { id } = req.params;
  let c;
  try {
    c = await con.conectarBD();
    const [result] = await c.execute("DELETE FROM administradores WHERE id = ?", [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ mensaje: "Administrador no encontrado" });
    res.json({ mensaje: "Administrador eliminado correctamente", id });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al eliminar administrador: " + error.message });
  } finally {
    await con.desconectarDB(c);
  }
}

// === Subir archivo por ID ===
async function uploadFile(req, res) {
  const { id } = req.params;

  if (!req.file) return res.status(400).json({ error: "No se subió ningún archivo" });

  const nombreArchivo = req.file.filename;
  const rutaRelativa = path.join("uploads", "administradores", nombreArchivo);

  let c;
  try {
    c = await con.conectarBD();
    const [rows] = await c.execute("SELECT id FROM administradores WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ mensaje: "Administrador no encontrado" });

    await c.execute("UPDATE administradores SET imagen = ? WHERE id = ?", [nombreArchivo, id]);

    res.json({
      mensaje: "Imagen subida correctamente",
      archivo: nombreArchivo,
      ruta: rutaRelativa
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al guardar imagen en DB: " + error.message });
  } finally {
    await con.desconectarDB(c);
  }
}

module.exports = { index, store, show, update, destroy, uploadFile };
