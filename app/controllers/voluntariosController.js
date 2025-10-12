const con = require("../../db/config");
const { validationResult } = require("express-validator");
const path = require("path");
const multer = require("multer");

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/voluntarios"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// --- Listar voluntarios ---
async function index(req, res) {
  let c;
  try {
    c = await con.conectarBD();
    const [rows] = await c.execute("SELECT * FROM voluntarios");
    res.json({ datos: rows });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al obtener voluntarios: " + error.message });
  } finally {
    await con.desconectarDB(c);
  }
}

// --- Crear voluntario ---
async function store(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  const { nombre, telefono, correo, direccion, id_area } = req.body;
  let c;
  try {
    c = await con.conectarBD();
    const [result] = await c.execute(
      "INSERT INTO voluntarios (nombre, telefono, correo, direccion, id_area) VALUES (?, ?, ?, ?, ?)",
      [nombre, telefono, correo, direccion, id_area]
    );
    res.json({ id: result.insertId, nombre, telefono, correo, direccion, id_area });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al crear voluntario: " + error.message });
  } finally {
    await con.desconectarDB(c);
  }
}

// --- Mostrar voluntario ---
async function show(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  const { id } = req.params;
  let c;
  try {
    c = await con.conectarBD();
    const [rows] = await c.execute("SELECT * FROM voluntarios WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ mensaje: "Voluntario no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al buscar voluntario: " + error.message });
  } finally {
    await con.desconectarDB(c);
  }
}

// --- Actualizar voluntario ---
async function update(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  const { id } = req.params;
  const { nombre, telefono, correo, direccion, id_area } = req.body;
  let c;
  try {
    c = await con.conectarBD();
    const [result] = await c.execute(
      "UPDATE voluntarios SET nombre = ?, telefono = ?, correo = ?, direccion = ?, id_area = ? WHERE id = ?",
      [nombre, telefono, correo, direccion, id_area, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ mensaje: "Voluntario no encontrado" });
    res.json({ id, nombre, telefono, correo, direccion, id_area });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar voluntario: " + error.message });
  } finally {
    await con.desconectarDB(c);
  }
}

// --- Eliminar voluntario ---
async function destroy(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  const { id } = req.params;
  let c;
  try {
    c = await con.conectarBD();
    const [result] = await c.execute("DELETE FROM voluntarios WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ mensaje: "Voluntario no encontrado" });
    res.json({ mensaje: "Voluntario eliminado correctamente", id });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al eliminar voluntario: " + error.message });
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
    ruta: path.join("uploads/voluntarios", req.file.filename)
  });
}

module.exports = { index, store, show, update, destroy, uploadFile, upload };
