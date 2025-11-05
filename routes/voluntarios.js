const express = require('express');
const upload = require('../app/middlewares/uploadMiddleware');
const voluntariosController = require('../app/controllers/voluntariosController');

const router = express.Router();

// =======================================
// Rutas de voluntarios usando controladores
// =======================================

// GET: Listar todos los voluntarios
router.get('/', voluntariosController.index);

// POST: Crear voluntario con imagen
router.post('/', upload.single('foto'), voluntariosController.store);

// GET: Mostrar voluntario por ID
router.get('/:id', voluntariosController.show);

// PUT: Actualizar voluntario con imagen opcional
router.put('/:id', upload.single('foto'), voluntariosController.update);

// DELETE: Eliminar voluntario
router.delete('/:id', voluntariosController.destroy);

module.exports = router;
