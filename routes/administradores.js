const express = require('express');
const upload = require('../app/middlewares/uploadMiddleware');
const administradoresController = require('../app/controllers/administradoresController');

const router = express.Router();

// =======================================
// Rutas de administradores usando controladores
// =======================================

// GET: Listar todos los administradores
router.get('/', administradoresController.index);

// POST: Crear administrador con imagen
router.post('/', upload.single('imagen'), administradoresController.store);

// GET: Mostrar administrador por ID
router.get('/:id', administradoresController.show);

// PUT: Actualizar administrador con imagen opcional
router.put('/:id', upload.single('imagen'), administradoresController.update);

// DELETE: Eliminar administrador
router.delete('/:id', administradoresController.destroy);

module.exports = router;
