const mysql = require('mysql2/promise');
require('dotenv').config();

const configuracion = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
};

// Conectar a la base de datos
async function conectarBD() {
    try {
        const conexion = await mysql.createConnection(configuracion);
        console.log(" Conexión establecida a la BD");
        return conexion;
    } catch (error) {
        console.error(" No se pudo conectar a la BD:", error.message);
        throw error;
    }
}

// Desconectar de la base de datos
async function desconectarDB(conexion) {
    try {
        if (conexion) {
            await conexion.end();
            console.log(" Conexión cerrada");
        }
    } catch (error) {
        console.error(" Error al cerrar la conexión:", error.message);
    }
}

module.exports = { conectarBD, desconectarDB };
