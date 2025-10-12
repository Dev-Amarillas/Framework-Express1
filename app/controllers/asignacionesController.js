const con = require("../../db/config");
const { validationResult } = require("express-validator");
const path = require("path");
const multer = require("multer");

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/asignaciones"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// --- Listar asignaciones ---
async function index(req, res) {
  let c;
  try {
    c = await con.conectarBD();
    const [rows] = await c.execute("SELECT * FROM asignaciones");
    res.json({ datos: rows });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al obtener asignaciones: " + error.message });
  } finally {
    await con.desconectarDB(c);
  }
}

// --- Crear asignación ---
async function store(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  const { id_voluntario, id_area, fecha, descripcion } = req.body;
  let c;
  try {
    c = await con.conectarBD();
    const [result] = await c.execute(
      "INSERT INTO asignaciones (id_voluntario, id_area, fecha, descripcion) VALUES (?, ?, ?, ?)",
      [id_voluntario, id_area, fecha, descripcion]
    );
    res.json({ id: result.insertId, id_voluntario, id_area, fecha, descripcion });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al crear asignación: " + error.message });
  } finally {
    await con.desconectarDB(c);
  }
}

// --- Mostrar asignación ---
async function show(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  const { id } = req.params;
  let c;
  try {
    c = await con.conectarBD();
    const [rows] = await c.execute("SELECT * FROM asignaciones WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ mensaje: "Asignación no encontrada" });
    res.json(rows[0]);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al buscar asignación: " + error.message });
  } finally {
    await con.desconectarDB(c);
  }
}

// --- Actualizar asignación ---
async function update(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  const { id } = req.params;
  const { id_voluntario, id_area, fecha, descripcion } = req.body;
  let c;
  try {
    c = await con.conectarBD();
    const [result] = await c.execute(
      "UPDATE asignaciones SET id_voluntario = ?, id_area = ?, fecha = ?, descripcion = ? WHERE id = ?",
      [id_voluntario, id_area, fecha, descripcion, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ mensaje: "Asignación no encontrada" });
    res.json({ id, id_voluntario, id_area, fecha, descripcion });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar asignación: " + error.message });
  } finally {
    await con.desconectarDB(c);
  }
}

// --- Eliminar asignación ---
async function destroy(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  const { id } = req.params;
  let c;
  try {
    c = await con.conectarBD();
    const [result] = await c.execute("DELETE FROM asignaciones WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ mensaje: "Asignación no encontrada" });
    res.json({ mensaje: "Asignación eliminada correctamente", id });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al eliminar asignación: " + error.message });
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
    ruta: path.join("uploads/asignaciones", req.file.filename)
  });
}

module.exports = { index, store, show, update, destroy, uploadFile, upload };
