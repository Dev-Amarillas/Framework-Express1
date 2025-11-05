// uploadMiddleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Carpeta base donde se guardan todos los archivos
const baseUploadDir = path.join(__dirname, '../../uploads');

// Función para asegurar que una carpeta exista
function ensureDirExistence(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

// Función para generar un ID corto único
function generarIdCorto() {
  return Math.random().toString(36).substring(2, 8); // ej: 'a9f3z1'
}

// Configuración del almacenamiento de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let subfolder = "generales"; // Carpeta por defecto

    if (req.originalUrl.includes("voluntarios")) subfolder = "voluntarios";
    else if (req.originalUrl.includes("administradores")) subfolder = "administradores";

    const uploadDir = path.join(baseUploadDir, subfolder);
    ensureDirExistence(uploadDir);

    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const originalName = file.originalname
      .normalize("NFD")          // elimina acentos
      .replace(/[\u0300-\u036f]/g, "") // elimina tildes
      .replace(/\s+/g, "_")     // reemplaza espacios por "_"
      .replace(/[^a-zA-Z0-9._-]/g, ""); // elimina símbolos raros

    // Extraer nombre y extensión
    const ext = path.extname(originalName);
    const base = path.basename(originalName, ext);

    // Generar nuevo nombre con ID único corto
    const uniqueId = generarIdCorto();
    const newName = `${base}_${uniqueId}${ext}`;

    cb(null, newName);
  },
});

// Filtro para permitir solo imágenes
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype.toLowerCase();
  if (allowedTypes.test(ext) && allowedTypes.test(mime)) cb(null, true);
  else cb(new Error("Solo se permiten imágenes (jpg, jpeg, png, gif)"));
};

// Configuración final de Multer
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter,
});

module.exports = upload;
