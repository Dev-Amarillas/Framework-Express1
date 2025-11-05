const { conectarBD, desconectarDB } = require("../../db/config.js");
const { validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");

// Listar todos los administradores
async function index(req, res) {
  let c;
  try {
    c = await conectarBD();
    const [rows] = await c.execute("SELECT * FROM administradores");
    if (!rows.length) return res.status(404).json({ mensaje: "No hay administradores" });
    res.json({ datos: rows });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener administradores", detalle: error.message });
  } finally {
    if (c) await desconectarDB(c);
  }
}

// Crear administrador
async function store(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  const { nombre, usuario, correo, contrasena } = req.body;
  const imagen = req.file ? req.file.filename : '';

  console.log('Body recibido:', req.body);
  console.log('Archivo recibido:', req.file);

  let c;
  try {
    c = await conectarBD();
    const [result] = await c.execute(
      "INSERT INTO administradores (nombre, usuario, correo, contrasena, imagen) VALUES (?, ?, ?, ?, ?)",
      [nombre, usuario, correo, contrasena, imagen]
    );
    res.json({
       id: result.insertId,
        nombre,
         usuario,
          correo,
           contrasena, 
            imagen });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear administrador", detalle: error.message });
  } finally {
    if (c) await desconectarDB(c);
  }
}

// Mostrar por ID
async function show(req, res) {
  const { id } = req.params;
  let c;
  try {
    c = await conectarBD();
    const [rows] = await c.execute("SELECT * FROM administradores WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ mensaje: "Administrador no encontrado" });
    res.json({ datos: rows[0] });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al buscar administrador", detalle: error.message });
  } finally {
    if (c) await desconectarDB(c);
  }
}

// Actualizar administrador
async function update(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  const { id } = req.params;
  const { nombre, usuario, correo, contrasena, } = req.body;
  const nuevaImagen = req.file ? req.file.filename : undefined;

  let c;
  try {
    c = await conectarBD();

    // Obtener la imagen actual del administrador
    const [rows] = await c.execute("SELECT imagen FROM administradores WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ mensaje: "Administrador no encontrado" });

    const imagenAnterior = rows[0].imagen;

    // Si suben nueva imagen, borrar la anterior
    if (nuevaImagen && imagenAnterior) {
      const oldPath = path.join("uploads", "administradores", imagenAnterior);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    // Preparar query
    const query = nuevaImagen
      ? "UPDATE administradores SET nombre=?, usuario=?, correo=?, contrasena=?, imagen=? WHERE id=?"
      : "UPDATE administradores SET nombre=?, usuario=?, correo=?, contrasena=? WHERE id=?";
    const params = nuevaImagen
      ? [nombre, usuario, correo, contrasena, nuevaImagen, id]
      : [nombre, usuario, correo, contrasena, id];

    const [result] = await c.execute(query, params);
    if (result.affectedRows === 0) return res.status(404).json({ mensaje: "Administrador no encontrado" });

    // Retornar siempre la imagen correcta
    const imagenFinal = nuevaImagen || imagenAnterior;

    res.json({ id, nombre, usuario, correo, imagen: imagenFinal });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar administrador", detalle: error.message });
  } finally {
    if (c) await desconectarDB(c);
  }
}

// Eliminar administrador
async function destroy(req, res) {
  const { id } = req.params;
  let c;
  try {
    c = await conectarBD();

    // Borrar imagen si existe
    const [rows] = await c.execute("SELECT imagen FROM administradores WHERE id = ?", [id]);
    if (rows.length && rows[0].imagen) {
      const oldPath = path.join("uploads", "administradores", rows[0].imagen);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    // Eliminar registro
    const [result] = await c.execute("DELETE FROM administradores WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ mensaje: "Administrador no encontrado" });

    res.json({ mensaje: "Administrador eliminado correctamente", id });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar administrador", detalle: error.message });
  } finally {
    if (c) await desconectarDB(c);
  }
}

module.exports = { index, store, show, update, destroy };
