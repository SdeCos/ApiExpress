(function () {
    "use strict";
  
    module.exports = {
      validarCrearProducto,
      validarActualizarProducto,
      obtenerListaProductos,
      obtenerProducto
    };
  
    var ProductoService = require("./producto.modulo")().ProductoService;
  
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
        .then(function(productos) {
          req.productos = productos;
          next();
        })
        .catch(next);
    }
  
    function obtenerProducto(req, res, next) {
      ProductoService.obtenerProductoPorId(req.params.id)
        .then(function(producto) {
          if (!producto) return next(new Error("Producto no encontrado"));
          req.producto = producto;
          next();
        })
        .catch(next);
    }
  })();
  