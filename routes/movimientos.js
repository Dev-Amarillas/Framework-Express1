const express = require('express');
const router = express.Router();
const movimientosController = require("../app/controllers/movimientosController");
const { body, param } = require("express-validator");
const upload = require('../app/middlewares/uploadMiddleware');

// Validaciones
const validarMovimiento = [
  body("voluntario_id")
    .notEmpty().withMessage("El ID del voluntario es obligatorio")
    .isInt({ gt: 0 }).withMessage("Debe ser un número entero positivo"),
  body("tipo")
    .notEmpty().withMessage("El tipo de movimiento es obligatorio")
    .isIn(["ingreso", "egreso"]).withMessage("El tipo debe ser 'ingreso' o 'egreso'"),
  body("cantidad")
    .notEmpty().withMessage("La cantidad es obligatoria")
    .isInt({ gt: 0 }).withMessage("Debe ser un número mayor que cero"),
  body("descripcion")
    .optional()
    .isLength({ max: 255 }).withMessage("La descripción no puede exceder 255 caracteres")
];

const validarID = [
  param("id")
    .notEmpty().withMessage("El ID es obligatorio")
    .isInt({ gt: 0 }).withMessage("Debe ser un número entero positivo")
];

// Rutas CRUD
router.get('/', movimientosController.index);
router.get('/:id', validarID, movimientosController.show);
router.post('/', validarMovimiento, movimientosController.store);
router.put('/:id', [...validarID, ...validarMovimiento], movimientosController.update);
router.delete('/:id', validarID, movimientosController.destroy);

// Subida de archivos
router.post('/uploads', upload.single('file'), movimientosController.uploadFile);

module.exports = router;
