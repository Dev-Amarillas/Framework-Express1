const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const administradoresController = require('../app/controllers/administradoresController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// === Configuración de carpeta uploads ===
const rutaUploads = path.join(__dirname, '../uploads/administradores');
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


const validarAdministrador = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('usuario').notEmpty().withMessage('El usuario es obligatorio'),
  body('correo').isEmail().withMessage('Correo no válido'),
  body('contrasena').notEmpty().withMessage('La contraseña es obligatoria'),
];

const validarID = [
  param('id')
    .notEmpty().withMessage('El ID es obligatorio')
    .isInt({ gt: 0 }).withMessage('Debe ser un número entero positivo')
];


router.get('/', administradoresController.index);
router.get('/:id', validarID, administradoresController.show);
router.post('/:id/uploads', validarID, upload.single('file'), administradoresController.uploadFile);
router.put('/:id', [...validarID, ...validarAdministrador], administradoresController.update);
router.delete('/:id', validarID, administradoresController.destroy);



module.exports = router;
