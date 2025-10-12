const express = require('express');
const router = express.Router();
const asignacionesController = require("../app/controllers/asignacionesController");
const { body, param } = require("express-validator");
const upload = require('../app/middlewares/uploadMiddleware');

// Validaciones
const validarAsignacion = [
  body("voluntario_id")
    .notEmpty().withMessage("El ID del voluntario es obligatorio")
    .isInt({ gt: 0 }).withMessage("El ID del voluntario debe ser un número entero positivo"),
  body("area_id")
    .notEmpty().withMessage("El ID del área es obligatorio")
    .isInt({ gt: 0 }).withMessage("El ID del área debe ser un número entero positivo"),
  body("fecha_asignacion")
    .optional()
    .isISO8601().withMessage("La fecha debe tener formato válido (YYYY-MM-DD HH:MM:SS)")
];

const validarID = [
  param("id")
    .notEmpty().withMessage("El ID es obligatorio")
    .isInt({ gt: 0 }).withMessage("El ID debe ser un número entero positivo")
];

// Rutas CRUD
router.get('/', asignacionesController.index);
router.get('/:id', validarID, asignacionesController.show);
router.post('/', validarAsignacion, asignacionesController.store);
router.put('/:id', [...validarID, ...validarAsignacion], asignacionesController.update);
router.delete('/:id', validarID, asignacionesController.destroy);

// Subida de archivos
router.post('/uploads', upload.single('file'), asignacionesController.uploadFile);

module.exports = router;
