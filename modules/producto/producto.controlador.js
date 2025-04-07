(function () {
  "use strict";

  var express = require("express");
  var router = express.Router();

  var ProductoMiddleware = require("./producto.middleware");

  // Crear nuevo producto (Admin)
  router.post(
    "/",
    ProductoMiddleware.validarCrearProducto,
    ProductoMiddleware.crearProducto,
    function (req, res) {
      res.status(201).json({
        success: true,
        producto: req.producto,
      });
    },
  );

  // Obtener todos los productos activos
  router.get(
    "/",
    ProductoMiddleware.obtenerListaProductos,
    function (req, res) {
      res.status(200).json({
        success: true,
        productos: req.productos,
      });
    },
  );

  // Obtener productos por categoría
  router.get(
    "/categoria/:categoria",
    ProductoMiddleware.validarCategoria,
    ProductoMiddleware.obtenerProductosPorCategoria,
    function (req, res) {
      res.status(200).json({
        success: true,
        productos: req.productos,
      });
    },
  );

  // Obtener un producto específico
  router.get("/:id", ProductoMiddleware.obtenerProducto, function (req, res) {
    res.status(200).json({
      success: true,
      producto: req.producto,
    });
  });

  // Actualizar producto (Admin)
  router.put(
    "/:id",
    ProductoMiddleware.validarActualizarProducto,
    ProductoMiddleware.actualizarProducto,
    function (req, res) {
      res.status(200).json({
        success: true,
        producto: req.producto,
      });
    },
  );

  // Desactivar producto (Admin)
  router.delete(
    "/:id",
    ProductoMiddleware.validarActualizarProducto,
    ProductoMiddleware.desactivarProducto,
    function (req, res) {
      res.status(200).json({
        success: true,
        message: "Producto desactivado correctamente",
      });
    },
  );

  module.exports = router;
})();
