const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
console.log("Carpeta de uploads:", uploadsDir);


app.use("/uploads", express.static(uploadsDir));
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// rutas
const administradoresRoutes = require('./routes/administradores');
const areasRoutes = require('./routes/areas');
const asignacionesRoutes = require('./routes/asignaciones');
const movimientosRoutes = require('./routes/movimientos');
const voluntariosRoutes = require('./routes/voluntarios');

// rutas de API
app.use('/administradores', administradoresRoutes);
app.use('/areas', areasRoutes);
app.use('/asignaciones', asignacionesRoutes);
app.use('/movimientos', movimientosRoutes);
app.use('/voluntarios', voluntariosRoutes);

// Middleware 
app.use((err, req, res, next) => {
  console.error('Error en servidor:', err.stack);
  res.status(500).json({
    error: 'Ocurrió un error en el servidor',
    detalle: err.message
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
