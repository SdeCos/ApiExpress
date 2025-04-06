(function () {
    "use strict";
  
    var express = require("express");
    var router = express.Router();
  
    var PedidoMiddleware = require("./pedido.modulo")().PedidoMiddleware;
  
    // Crear nuevo pedido
    router.post("/", 
      PedidoMiddleware.validarNuevoPedido,
      PedidoMiddleware.crearPedido,
      function(req, res) {
        res.status(201).json(req.pedido);
      }
    );
  
    // Obtener todos los pedidos
    router.get("/", 
      PedidoMiddleware.obtenerTodosPedidos,
      function(req, res) {
        res.status(200).json(req.pedidos);
      }
    );
  
    // Obtener pedido por ID
    router.get("/:id", 
      PedidoMiddleware.obtenerPedido,
      function(req, res) {
        res.status(200).json(req.pedido);
      }
    );
  
    // Actualizar pedido
    router.put("/:id", 
      PedidoMiddleware.validarActualizacionPedido,
      PedidoMiddleware.actualizarPedido,
      function(req, res) {
        res.status(200).json(req.pedido);
      }
    );
  
    // Cambiar estado de pedido
    router.patch("/:id/estado", 
      PedidoMiddleware.cambiarEstado,
      function(req, res) {
        res.status(200).json(req.pedido);
      }
    );
  
    // Obtener pedidos por mesa
    router.get("/mesa/:mesa", 
      PedidoMiddleware.obtenerPedidosMesa,
      function(req, res) {
        res.status(200).json(req.pedidos);
      }
    );
  
    module.exports = router;
  })();
  