const express = require("express");
const asignacionesController = require("../app/controllers/asignacionesController");
const { body, param } = require("express-validator");

const router = express.Router();

// --- Validaciones ---
const validarAsignacion = [
  body("voluntario_id")
    .notEmpty().withMessage("El ID del voluntario es obligatorio")
    .isInt({ gt: 0 }).withMessage("Debe ser un número entero positivo"),

  body("area_id")
    .notEmpty().withMessage("El ID del área es obligatorio")
    .isInt({ gt: 0 }).withMessage("Debe ser un número entero positivo"),

  body("estado")
    .optional()
    .isBoolean().withMessage("El estado debe ser booleano"),
];

const validarID = [
  param("id")
    .notEmpty().withMessage("El ID es obligatorio")
    .isInt({ gt: 0 }).withMessage("Debe ser un número entero positivo"),
];

// --- Rutas CRUD ---
router.get("/", asignacionesController.index);
router.get("/:id", validarID, asignacionesController.show);
router.post("/", validarAsignacion, asignacionesController.store);
router.put("/:id", [...validarID, ...validarAsignacion], asignacionesController.update);
router.delete("/:id", validarID, asignacionesController.destroy);

module.exports = router;
