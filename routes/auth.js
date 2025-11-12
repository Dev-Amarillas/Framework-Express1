const express = require("express");
const router = express.Router();
const { login, register } = require("../app/controllers/authController");
const verificarToken = require("../app/middlewares/authMiddleware");

// Public routes
router.post("/login", login);
router.post("/register", register);

// Ruta protegida de ejemplo
router.get("/perfil", verificarToken, (req, res) => {
  res.json({ mensaje: "Bienvenido Amarillas al perfil protegido", user: req.user });
});

module.exports = router;
