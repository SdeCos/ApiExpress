(function () {
    "use strict";
  
    module.exports = {
      crearProducto,
      obtenerProductos,
      obtenerProductoPorId,
      actualizarProducto,
      desactivarProducto,
      obtenerProductosPorCategoria
    };
  
    var ProductoModel = require("./producto.modulo")().ProductoModel;
  
    function crearProducto(producto) {
      return ProductoModel.create(producto);
    }
  
    function obtenerProductos() {
      return ProductoModel.find({ activo: true })
             .sort({ categoria: 1, nombre: 1 })
             .exec();
    }
  
    function obtenerProductoPorId(id) {
      return ProductoModel.findById(id).exec();
    }
  
    function actualizarProducto(id, datos) {
      return ProductoModel.findByIdAndUpdate(
        id, 
        datos, 
        { new: true, runValidators: true }
      ).exec();
    }
  
    function desactivarProducto(id) {
      return ProductoModel.findByIdAndUpdate(
        id,
        { activo: false },
        { new: true }
      ).exec();
    }
  
    function obtenerProductosPorCategoria(categoria) {
      return ProductoModel.find({ 
        categoria: categoria,
        activo: true 
      }).exec();
    }
  })();
  