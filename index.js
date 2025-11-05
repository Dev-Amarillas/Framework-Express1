const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

// Inicializar app
const app = express();

// Habilitar CORS para Angular u otros clientes
app.use(cors());

// Middlewares globales para JSON y URL encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Crear carpeta /uploads si no existe
const uploadsDir = path.join(__dirname, 'app', 'middlewares', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
console.log("Carpeta de uploads:", uploadsDir);

// Servir archivos estáticos
app.use("/uploads", express.static(uploadsDir));
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal (si tienes un frontend en /public)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Importar rutas
const administradoresRoutes = require('./routes/administradores');
const areasRoutes = require('./routes/areas');
const asignacionesRoutes = require('./routes/asignaciones');
const movimientosRoutes = require('./routes/movimientos');
const voluntariosRoutes = require('./routes/voluntarios');

// Rutas de API
app.use('/administradores', administradoresRoutes);
app.use('/areas', areasRoutes);
app.use('/asignaciones', asignacionesRoutes);
app.use('/movimientos', movimientosRoutes);
app.use('/voluntarios', voluntariosRoutes);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error en servidor:', err.stack);
  res.status(500).json({
    error: 'Ocurrió un error en el servidor',
    detalle: err.message
  });
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
