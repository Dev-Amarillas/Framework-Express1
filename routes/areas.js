const express = require('express');
const areasController = require('../app/controllers/areasController');
const { body, param } = require('express-validator');

const router = express.Router();

// Validaciones
const validarArea = [
  body("nombre")
    .notEmpty().withMessage("El nombre del área es obligatorio")
    .isLength({ min: 3 }).withMessage("El nombre debe tener al menos 3 caracteres"),
  body("descripcion")
    .optional()
    .isLength({ max: 255 }).withMessage("La descripción no puede exceder 255 caracteres"),
  body("estado")
    .optional()
    .isBoolean().withMessage("El estado debe ser 0 o 1 (booleano)")
];

const validarID = [
  param("id")
    .notEmpty().withMessage("El ID es obligatorio")
    .isInt({ gt: 0 }).withMessage("Debe ser un número entero positivo")
];

// Rutas CRUD
router.get('/', areasController.index);
router.get('/:id', validarID, areasController.show);
router.post('/', validarArea, areasController.store);
router.put('/:id', [...validarID, ...validarArea], areasController.update);
router.delete('/:id', validarID, areasController.destroy);

module.exports = router;
