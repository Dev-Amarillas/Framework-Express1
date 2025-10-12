const con = require("../../db/config");
const { validationResult } = require("express-validator");
const path = require("path");
const multer = require("multer");

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/movimientos"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// --- Listar movimientos ---
async function index(req, res) {
  let c;
  try {
    c = await con.conectarBD();
    const [rows] = await c.execute("SELECT * FROM movimientos");
    res.json({ datos: rows });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al obtener movimientos: " + error.message });
  } finally {
    await con.desconectarDB(c);
  }
}

// --- Crear movimiento ---
async function store(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  const { tipo, descripcion, monto, fecha, id_area } = req.body;
  let c;
  try {
    c = await con.conectarBD();
    const [result] = await c.execute(
      "INSERT INTO movimientos (tipo, descripcion, monto, fecha, id_area) VALUES (?, ?, ?, ?, ?)",
      [tipo, descripcion, monto, fecha, id_area]
    );
    res.json({ id: result.insertId, tipo, descripcion, monto, fecha, id_area });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al crear movimiento: " + error.message });
  } finally {
    await con.desconectarDB(c);
  }
}

// --- Mostrar movimiento ---
async function show(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  const { id } = req.params;
  let c;
  try {
    c = await con.conectarBD();
    const [rows] = await c.execute("SELECT * FROM movimientos WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ mensaje: "Movimiento no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al buscar movimiento: " + error.message });
  } finally {
    await con.desconectarDB(c);
  }
}

// --- Actualizar movimiento ---
async function update(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  const { id } = req.params;
  const { tipo, descripcion, monto, fecha, id_area } = req.body;
  let c;
  try {
    c = await con.conectarBD();
    const [result] = await c.execute(
      "UPDATE movimientos SET tipo = ?, descripcion = ?, monto = ?, fecha = ?, id_area = ? WHERE id = ?",
      [tipo, descripcion, monto, fecha, id_area, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ mensaje: "Movimiento no encontrado" });
    res.json({ id, tipo, descripcion, monto, fecha, id_area });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar movimiento: " + error.message });
  } finally {
    await con.desconectarDB(c);
  }
}

// --- Eliminar movimiento ---
async function destroy(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  const { id } = req.params;
  let c;
  try {
    c = await con.conectarBD();
    const [result] = await c.execute("DELETE FROM movimientos WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ mensaje: "Movimiento no encontrado" });
    res.json({ mensaje: "Movimiento eliminado correctamente", id });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al eliminar movimiento: " + error.message });
  } finally {
    await con.desconectarDB(c);
  }
}

// --- Subir archivo ---
async function uploadFile(req, res) {
  if (!req.file) return res.status(400).json({ error: "No se subió ningún archivo" });
  res.json({
    mensaje: "Archivo subido correctamente",
    nombreArchivo: req.file.filename,
    ruta: path.join("uploads/movimientos", req.file.filename)
  });
}

module.exports = { index, store, show, update, destroy, uploadFile, upload };
