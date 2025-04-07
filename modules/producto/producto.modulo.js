(function () {
  "use strict";

  module.exports = init;

  function init() {
    return {
      ProductoControlador: require("./producto.controlador"),
      ProductoMiddleware: require("./producto.middleware"),
      ProductoService: require("./producto.servicio"),
      ProductoModel: require("./producto.modelo"),
    };
  }
})();
