const con = require("../../db/config");
const { validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");

// --- Listar áreas ---
async function index(req, res) {
  let c;
  try {
    c = await con.conectarBD();
    const [rows] = await c.execute("SELECT * FROM areas");
    res.json({ datos: rows });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al obtener áreas: " + error.message });
  } finally {
    await con.desconectarDB(c);
  }
}

// --- Crear área ---
async function store(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  const { nombre, descripcion, estado } = req.body;

  console.log('Body recibido:', req.body);
  console.log('Archivo recibido:', req.file);

  let c;
  try {
    c = await conectarBD();
    const [result] = await c.execute(
      "INSERT INTO areas (nombre, descripcion, estado) VALUES (?, ?, ?)",
      [nombre, descripcion, estado ?? 1]
    );
    res.json({ id: result.insertId, nombre, descripcion, estado: estado ?? 1 });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear área: ", detalle: error.message });
  } finally {
    if (c) await desconectarDB(c);
  }
}

// --- Mostrar área ---
async function show(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  const { id } = req.params;
  let c;
  try {
    c = await con.conectarBD();
    const [rows] = await c.execute("SELECT * FROM areas WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ mensaje: "Área no encontrada" });
    res.json(rows[0]);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al buscar área: " + error.message });
  } finally {
    await con.desconectarDB(c);
  }
}

// --- Actualizar área ---
async function update(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  const { id } = req.params;
  const { nombre, descripcion, estado } = req.body;
  let c;
  try {
    c = await con.conectarBD();
    const [result] = await c.execute(
      "UPDATE areas SET nombre = ?, descripcion = ?, estado = ? WHERE id = ?",
      [nombre, descripcion, estado, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ mensaje: "Área no encontrada" });
    res.json({ id, nombre, descripcion, estado });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar área: " + error.message });
  } finally {
    await con.desconectarDB(c);
  }
}

// --- Eliminar área ---
async function destroy(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  const { id } = req.params;
  let c;
  try {
    c = await con.conectarBD();
    const [result] = await c.execute("DELETE FROM areas WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ mensaje: "Área no encontrada" });
    res.json({ mensaje: "Área eliminada correctamente", id });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al eliminar área: " + error.message });
  } finally {
    await con.desconectarDB(c);
  }
}

module.exports = { index, store, show, update, destroy,};
