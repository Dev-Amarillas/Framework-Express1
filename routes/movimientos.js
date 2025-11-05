const express = require('express');
const movimientosController = require('../app/controllers/movimientosController');
const { body, param } = require('express-validator');

const router = express.Router();
// const validarMovimiento = [
//   body("voluntario_id")
//     .notEmpty().withMessage("El ID del voluntario es obligatorio")
//     .isInt({ gt: 0 }).withMessage("Debe ser un número entero positivo"),
//   body("tipo")
//     .notEmpty().withMessage("El tipo de movimiento es obligatorio")
//     .isIn(["ingreso", "egreso"]).withMessage("El tipo debe ser 'ingreso' o 'egreso'"),
//   body("cantidad")
//     .notEmpty().withMessage("La cantidad es obligatoria")
//     .isInt({ gt: 0 }).withMessage("Debe ser un número mayor que cero"),
//   body("descripcion")
//     .optional()
//     .isLength({ max: 255 }).withMessage("La descripción no puede exceder 255 caracteres")
// ];

const validarID = [
  param("id")
    .notEmpty().withMessage("El ID es obligatorio")
    .isInt({ gt: 0 }).withMessage("Debe ser un número entero positivo")
];


router.get('/', movimientosController.index);
router.get('/:id', validarID, movimientosController.show);
//     POST y PUT sin validaciones estrictas (por ahora)
//     Puedes reactivar las validaciones reemplazando:
//     movimientosController.store → [validarMovimiento, movimientosController.store]
//     movimientosController.update → [[...validarID, ...validarMovimiento], movimientosController.update]
router.post('/', movimientosController.store);
router.put('/:id', validarID, movimientosController.update);
router.delete('/:id', validarID, movimientosController.destroy);

module.exports = router;
