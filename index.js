const express = require('express');
const path = require('path');
const fs = require('fs');


const app = express();

// Crear carpeta /uploads si no existe
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static('.'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Importar rutas
const administradoresRoutes = require('./routes/administradores');
const areasRoutes = require('./routes/areas');
const asignacionesRoutes = require('./routes/asignaciones');
const movimientosRoutes = require('./routes/movimientos');
const voluntariosRoutes = require('./routes/voluntarios');

// rutas
app.use('/administradores', administradoresRoutes);
app.use('/areas', areasRoutes);
app.use('/asignaciones', asignacionesRoutes);
app.use('/movimientos', movimientosRoutes);
app.use('/voluntarios', voluntariosRoutes);

app.use((err, req, res, next) => {
  console.error('Error en servidor:', err.stack);
  res.status(500).json({ error: 'Ocurrió un error en el servidor', detalle: err.message });
});

//indico el puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
