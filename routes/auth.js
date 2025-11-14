const express = require("express");
const router = express.Router();
const { login, register } = require("../app/controllers/authController");
const verificarToken = require("../app/middlewares/authMiddleware");


router.post("/login", login);
router.post("/register", register);

// Ruta de ejemplo "protegida" por el token
router.get("/perfil", verificarToken, (req, res) => {
  res.json({ mensaje: "Bienvenido Amarillas al perfil asegurado por el token", user: req.user });
});

module.exports = router;
