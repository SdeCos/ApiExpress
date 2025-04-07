var express = require("express");
var router = express.Router();
var Pedido = require("../modules/pedido/pedido.modelo");

// Fetch all pedidos
router.get("/", async function (req, res, next) {
  try {
    const pedidos = await Pedido.find({}).populate(
      "productos.producto camarero",
    );
    res.send(pedidos);
  } catch (error) {
    next(error);
  }
});

// Insert example data
router.post("/example", async function (req, res, next) {
  try {
    const exampleData = [
      {
        mesa: 1,
        productos: [
          { producto: "PRODUCTO_ID_1", cantidad: 2, notas: "Sin hielo" },
          { producto: "PRODUCTO_ID_2", cantidad: 1 },
        ],
        estado: "pendiente",
        total: 35.5,
        camarero: "USUARIO_ID",
      },
    ];
    await Pedido.insertMany(exampleData);
    res.status(201).send("Example data inserted");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
