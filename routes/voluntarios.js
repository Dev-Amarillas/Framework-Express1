const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const voluntariosController = require('../app/controllers/voluntariosController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// === Configuración de carpeta uploads ===
const rutaUploads = path.join(__dirname, '../uploads/voluntarios');
if (!fs.existsSync(rutaUploads)) {
  fs.mkdirSync(rutaUploads, { recursive: true });
}

// === Configuración de multer ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, rutaUploads),
  filename: (req, file, cb) => {
    const nombreArchivo = Date.now() + path.extname(file.originalname);
    cb(null, nombreArchivo);
  }
});

const fileFilter = (req, file, cb) => {
  const tiposPermitidos = /jpeg|jpg|png/;
  const esTipoValido = tiposPermitidos.test(path.extname(file.originalname).toLowerCase());
  const esMimeValido = tiposPermitidos.test(file.mimetype);

  if (esTipoValido && esMimeValido) cb(null, true);
  else cb(new Error('Solo se permiten imágenes JPEG, JPG o PNG'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});


const validarVoluntario = [
  body("nombre")
    .notEmpty().withMessage("El nombre es obligatorio")
    .isLength({ min: 3 }).withMessage("El nombre debe tener al menos 3 caracteres"),
  body("apellido_pat")
    .notEmpty().withMessage("El apellido paterno es obligatorio")
    .isLength({ min: 3 }).withMessage("Debe tener al menos 3 caracteres"),
  body("telefono")
    .notEmpty().withMessage("El teléfono es obligatorio")
    .isMobilePhone("es-MX").withMessage("El teléfono no es válido"),
  body("direccion")
    .optional()
    .isLength({ max: 255 }).withMessage("La dirección no puede exceder 255 caracteres")
];

const validarID = [
  param("id")
    .notEmpty().withMessage("El ID es obligatorio")
    .isInt({ gt: 0 }).withMessage("Debe ser un número entero positivo")
];


router.get('/', voluntariosController.index);
router.get('/:id', validarID, voluntariosController.show);
router.post('/:id/uploads', validarID, upload.single('file'), voluntariosController.uploadFile);
router.put('/:id', [...validarID, ...validarVoluntario], voluntariosController.update);
router.delete('/:id', validarID, voluntariosController.destroy);


module.exports = router;
