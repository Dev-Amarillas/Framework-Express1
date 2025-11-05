const con = require("../../db/config");
const { validationResult } = require("express-validator");

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

  const { voluntario_id, area_id, estado } = req.body;
  let c;
  try {
    c = await con.conectarBD();

    const [result] = await c.execute(
      "INSERT INTO asignaciones (voluntario_id, area_id, estado) VALUES (?, ?, ?)",
      [voluntario_id, area_id, estado ?? true]
    );

    const [rows] = await c.execute("SELECT * FROM asignaciones WHERE id = ?", [result.insertId]);

    res.status(201).json({
      mensaje: "Asignación creada correctamente",
      datos: rows[0]
    });
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
  const { voluntario_id, area_id, estado } = req.body;
  let c;
  try {
    c = await con.conectarBD();
    const [result] = await c.execute(
      "UPDATE asignaciones SET voluntario_id = ?, area_id = ?, estado = ? WHERE id = ?",
      [voluntario_id, area_id, estado, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ mensaje: "Asignación no encontrada" });

    const [rows] = await c.execute("SELECT * FROM asignaciones WHERE id = ?", [id]);
    res.json({ mensaje: "Asignación actualizada correctamente", datos: rows[0] });
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
    if (result.affectedRows === 0)
      return res.status(404).json({ mensaje: "Asignación no encontrada" });
    res.json({ mensaje: "Asignación eliminada correctamente", id });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al eliminar asignación: " + error.message });
  } finally {
    await con.desconectarDB(c);
  }
}

module.exports = { index, store, show, update, destroy };
