(function () {
    "use strict";
  
    module.exports = init;
  
    function init() {
      return {
        PedidoControlador: require("./pedido.controlador"),
        PedidoMiddleware: require("./pedido.middleware"),
        PedidoService: require("./pedido.servicio"),
        PedidoModel: require("./pedido.modelo")
      };
    }
  })();
  