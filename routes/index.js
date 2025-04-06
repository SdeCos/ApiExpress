const express = require("express");
const router = express.Router();

// Importación de módulos
const producto = require("../modules/producto/producto.modulo");
const pedido = require("../modules/pedido/pedido.modulo");
const user = require("../modules/user/user.module"); // Conservando 'user'

// Ruta de vista principal
router.get("/", function (req, res) {
  res.render("pages/index", { 
    title: "Gestión del Bar",
    message: "Bienvenido al sistema de gestión"
  });
});

// API Routes
router.use("/api/productos", producto().ProductoControlador);
router.use("/api/pedidos", pedido().PedidoControlador);
router.use("/api/users", user().UserController); // Conservando nomenclatura en inglés

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// Error 404 handling
router.use((req, res) => {
  res.status(404).render("pages/404", {
    title: "Página no encontrada",
    attemptedUrl: req.originalUrl
  });
});

module.exports = router;
