// app/controllers/movimientosController.js
const con = require("../../db/config");
const { validationResult } = require("express-validator");

   // Listar todos los movimientos
  
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


   //Crear movimiento
 
async function store(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errores: errors.array() });

  const { voluntario_id, cantidad, descripcion } = req.body;

  // Tipo automático según cantidad
  const tipo = cantidad >= 0 ? "ingreso" : "egreso";

  let c;
  try {
    c = await con.conectarBD();
    const [result] = await c.execute(
      "INSERT INTO movimientos (voluntario_id, tipo, cantidad, fecha_movimiento, descripcion) VALUES (?, ?, ?, NOW(), ?)",
      [voluntario_id, tipo, Math.abs(cantidad), descripcion]
    );

    res.json({
      mensaje: "Movimiento creado correctamente",
      datos: {
        id: result.insertId,
        voluntario_id,
        tipo,
        cantidad: Math.abs(cantidad),
        fecha: new Date(),
        descripcion,
      },
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear movimiento: " + error.message,
    });
  } finally {
    await con.desconectarDB(c);
  }
}
   //Mostrar un movimiento por ID
 
async function show(req, res) {
  const { id } = req.params;
  let c;
  try {
    c = await con.conectarBD();
    const [rows] = await c.execute("SELECT * FROM movimientos WHERE id = ?", [id]);
    if (rows.length === 0)
      return res.status(404).json({ mensaje: "Movimiento no encontrado" });
    res.json({ datos: rows[0] });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al buscar movimiento: " + error.message });
  } finally {
    await con.desconectarDB(c);
  }
}
   //Actualizar movimiento

async function update(req, res) {
  const { id } = req.params;
  const { voluntario_id, cantidad, descripcion } = req.body;
  const tipo = cantidad >= 0 ? "ingreso" : "egreso";

  let c;
  try {
    c = await con.conectarBD();
    const [result] = await c.execute(
      "UPDATE movimientos SET voluntario_id = ?, tipo = ?, cantidad = ?, descripcion = ? WHERE id = ?",
      [voluntario_id, tipo, Math.abs(cantidad), descripcion, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ mensaje: "Movimiento no encontrado" });

    res.json({
      mensaje: "Movimiento actualizado correctamente",
      datos: { id, voluntario_id, tipo, cantidad: Math.abs(cantidad), descripcion },
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar movimiento: " + error.message });
  } finally {
    await con.desconectarDB(c);
  }
}
   //Eliminar movimiento
 
async function destroy(req, res) {
  const { id } = req.params;
  let c;
  try {
    c = await con.conectarBD();
    const [result] = await c.execute("DELETE FROM movimientos WHERE id = ?", [id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ mensaje: "Movimiento no encontrado" });

    res.json({ mensaje: "Movimiento eliminado correctamente", id });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar movimiento: " + error.message });
  } finally {
    await con.desconectarDB(c);
  }
}

module.exports = { index, store, show, update, destroy };
