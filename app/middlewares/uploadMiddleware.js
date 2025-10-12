const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tabla = req.baseUrl.split('/').pop(); // ✅ obtiene solo el nombre de la tabla
    const uploadPath = path.join(__dirname, '../../uploads', tabla);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const id = req.params.id || Date.now(); // usar id si existe, sino timestamp
    const ext = path.extname(file.originalname);
    cb(null, `${id}${ext}`);
  }
});

const upload = multer({ storage });

module.exports = upload;
