(function () {
    "use strict";
  
    module.exports = {
      crearPedido,
      obtenerPedidos,
      obtenerPedidoPorId,
      actualizarPedido,
      cambiarEstadoPedido,
      obtenerPedidosPorMesa,
      obtenerPedidosPorEstado
    };
  
    var PedidoModel = require("./pedido.modulo")().PedidoModel;
  
    function crearPedido(datos) {
      return PedidoModel.create(datos);
    }
  
    function obtenerPedidos() {
      return PedidoModel.find()
             .populate('productos.producto camarero')
             .sort({ createdAt: -1 })
             .exec();
    }
  
    function obtenerPedidoPorId(id) {
      return PedidoModel.findById(id)
             .populate('productos.producto camarero')
             .exec();
    }
  
    function actualizarPedido(id, datos) {
      return PedidoModel.findByIdAndUpdate(
        id, 
        datos, 
        { new: true, runValidators: true }
      ).populate('productos.producto camarero').exec();
    }
  
    function cambiarEstadoPedido(id, nuevoEstado) {
      return PedidoModel.findByIdAndUpdate(
        id,
        { estado: nuevoEstado },
        { new: true }
      ).populate('productos.producto camarero').exec();
    }
  
    function obtenerPedidosPorMesa(mesa) {
      return PedidoModel.find({ mesa: mesa })
             .populate('productos.producto camarero')
             .sort({ createdAt: -1 })
             .exec();
    }
  
    function obtenerPedidosPorEstado(estado) {
      return PedidoModel.find({ estado: estado })
             .populate('productos.producto camarero')
             .sort({ createdAt: 1 })
             .exec();
    }
  })();
  