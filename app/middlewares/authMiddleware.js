const jwt = require("jsonwebtoken");
require("dotenv").config();

function verificarToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(403).json({ mensaje: "Token no proporcionado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // guarda los datos del usuario
    next();
  } catch (error) {
    res.status(401).json({ mensaje: "Token inválido o expirado" });
  }
}

module.exports = verificarToken;
