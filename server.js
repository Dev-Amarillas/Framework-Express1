const express = require('express');
const app = express();
const path = require('path');
const routerCliente = require('./routes/administradores'); 
const upload = require('./app/middlewares/uploadMiddleware'); 

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (HTML, CSS, imágenes, etc.)
app.use(express.static('.'));

// Ruta principal: muestra el index.html
app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index.html'));
});

// Usar las rutas del cliente
app.use('/clientes', routerCliente);

// Subir la documentacion 
app.post('/upload', upload.single('file'), (req, res) => {return res.json({ message: 'Subida OK' });});

// Puerto de conexión
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
});
