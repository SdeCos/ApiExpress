(function () {
  "use strict";

  module.exports = {
    validarCrearProducto,
    validarActualizarProducto,
    obtenerListaProductos,
    obtenerProducto,
    crearProducto,
    obtenerProductosPorCategoria,
    desactivarProducto,
    validarCategoria, // Ensure this function is exported
    actualizarProducto, // Ensure this function is exported
  };

  var ProductoService = require("./producto.servicio");

  function validarCrearProducto(req, res, next) {
    if (!req.body.nombre || !req.body.precio || !req.body.categoria) {
      return next(new Error("Datos incompletos"));
    }
    next();
  }

  function validarActualizarProducto(req, res, next) {
    if (!req.params.id) {
      return next(new Error("ID de producto requerido"));
    }
    next();
  }

  function obtenerListaProductos(req, res, next) {
    ProductoService.obtenerProductos()
      .then(function (productos) {
        req.productos = productos;
        next();
      })
      .catch(next);
  }

  function obtenerProducto(req, res, next) {
    ProductoService.obtenerProductoPorId(req.params.id)
      .then(function (producto) {
        if (!producto) return next(new Error("Producto no encontrado"));
        req.producto = producto;
        next();
      })
      .catch(next);
  }

  function crearProducto(req, res, next) {
    ProductoService.crearProducto(req.body)
      .then(function (producto) {
        req.producto = producto;
        next();
      })
      .catch(next);
  }

  function obtenerProductosPorCategoria(req, res, next) {
    ProductoService.obtenerProductosPorCategoria(req.params.categoria)
      .then(function (productos) {
        req.productos = productos;
        next();
      })
      .catch(next);
  }

  function desactivarProducto(req, res, next) {
    ProductoService.desactivarProducto(req.params.id)
      .then(function () {
        next();
      })
      .catch(next);
  }

  function validarCategoria(req, res, next) {
    if (!req.params.categoria) {
      return next(new Error("Categoría requerida"));
    }
    next();
  }

  function actualizarProducto(req, res, next) {
    ProductoService.actualizarProducto(req.params.id, req.body)
      .then(function (producto) {
        req.producto = producto;
        next();
      })
      .catch(next);
  }
})();
