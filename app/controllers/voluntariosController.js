const { conectarBD, desconectarDB } = require("../../db/config.js");
const { validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");

// =============================
// --- Listar todos los voluntarios ---
// =============================
async function index(req, res) {
  let c;
  try {
    c = await conectarBD();
    const [rows] = await c.execute("SELECT * FROM voluntarios");
    if (!rows.length)
      return res.status(404).json({ mensaje: "No hay voluntarios registrados" });
    res.json({ datos: rows });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener voluntarios", detalle: error.message });
  } finally {
    if (c) await desconectarDB(c);
  }
}

// =============================
// --- Crear voluntario ---
// =============================
async function store(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errores: errors.array() });

  const { nombre, apellido_pat, apellido_mat, telefono, direccion, estado } = req.body;
  const foto = req.file ? req.file.filename : null;
  const estadoBoolean = estado === 'true'? 1 : 0;

  console.log("Body recibido:", req.body);
  console.log("Archivo recibido:", req.file);

  let c;
  try {
    c = await conectarBD();

    // Inserta los datos en MySQL
    const [result] = await c.execute(
      "INSERT INTO voluntarios (nombre, apellido_pat, apellido_mat, telefono, direccion, estado, foto) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [nombre, apellido_pat, apellido_mat, telefono, direccion, estadoBoolean, foto]
    );

    res.json({
      id: result.insertId,
      nombre,
      apellido_pat,
      apellido_mat,
      telefono,
      direccion,
      estado,
      foto,
    });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al crear voluntario", detalle: error.message });
  } finally {
    if (c) await desconectarDB(c);
  }
}

// =============================
// --- Mostrar voluntario por ID ---
// =============================
async function show(req, res) {
  const { id } = req.params;
  let c;
  try {
    c = await conectarBD();
    const [rows] = await c.execute("SELECT * FROM voluntarios WHERE id = ?", [id]);
    if (!rows.length)
      return res.status(404).json({ mensaje: "Voluntario no encontrado" });
    res.json({ datos: rows[0] });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al buscar voluntario", detalle: error.message });
  } finally {
    if (c) await desconectarDB(c);
  }
}

// =============================
// --- Actualizar voluntario ---
// =============================
async function update(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errores: errors.array() });

  const { id } = req.params;
  const { nombre, apellido_pat, apellido_mat, telefono, direccion, estado } = req.body;
  const nuevaFoto = req.file ? req.file.filename : undefined;

  let c;
  try {
    c = await conectarBD();

    // Obtener la foto actual
    const [rows] = await c.execute("SELECT foto FROM voluntarios WHERE id = ?", [id]);
    if (!rows.length)
      return res.status(404).json({ mensaje: "Voluntario no encontrado" });

    const fotoAnterior = rows[0].foto;

    // Si hay nueva foto, eliminar la anterior
    if (nuevaFoto && fotoAnterior) {
      const oldPath = path.join("uploads", "voluntarios", fotoAnterior);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    // Preparar query dinámico
    const query = nuevaFoto
      ? "UPDATE voluntarios SET nombre=?, apellido_pat=?, apellido_mat=?, telefono=?, direccion=?, estado=?, foto=? WHERE id=?"
      : "UPDATE voluntarios SET nombre=?, apellido_pat=?, apellido_mat=?, telefono=?, direccion=?, estado=? WHERE id=?";
    const params = nuevaFoto
      ? [nombre, apellido_pat, apellido_mat, telefono, direccion, estado, nuevaFoto, id]
      : [nombre, apellido_pat, apellido_mat, telefono, direccion, estado, id];

    const [result] = await c.execute(query, params);
    if (result.affectedRows === 0)
      return res.status(404).json({ mensaje: "Voluntario no encontrado" });

    const fotoFinal = nuevaFoto || fotoAnterior;

    res.json({
      id,
      nombre,
      apellido_pat,
      apellido_mat,
      telefono,
      direccion,
      estado,
      foto: fotoFinal,
    });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al actualizar voluntario", detalle: error.message });
  } finally {
    if (c) await desconectarDB(c);
  }
}

// =============================
// --- Eliminar voluntario ---
// =============================
async function destroy(req, res) {
  const { id } = req.params;
  let c;
  try {
    c = await conectarBD();

    // Buscar foto existente
    const [rows] = await c.execute("SELECT foto FROM voluntarios WHERE id = ?", [id]);
    if (rows.length && rows[0].foto) {
      const oldPath = path.join("uploads", "voluntarios", rows[0].foto);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    // Eliminar registro
    const [result] = await c.execute("DELETE FROM voluntarios WHERE id = ?", [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ mensaje: "Voluntario no encontrado" });

    res.json({ mensaje: "Voluntario eliminado correctamente", id });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al eliminar voluntario", detalle: error.message });
  } finally {
    if (c) await desconectarDB(c);
  }
}

module.exports = { index, store, show, update, destroy };
