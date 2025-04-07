var express = require("express");
var router = express.Router();

// Dummy data for productos
var productos = [
  {
    _id: 1,
    nombre: "Producto 1",
    precio: 10.0,
    categoria: "cerveza",
    gradoAlcohol: 5,
    stock: 20,
    descripcion: "Descripción del producto 1",
    activo: true,
  },
  {
    _id: 2,
    nombre: "Producto 2",
    precio: 15.5,
    categoria: "coctel",
    gradoAlcohol: 7,
    stock: 15,
    descripcion: "Descripción del producto 2",
    activo: false,
  },
  {
    _id: 3,
    nombre: "Producto 3",
    precio: 8.0,
    categoria: "bebida",
    stock: 30,
    descripcion: "Descripción del producto 3",
    activo: true,
  },
];

/* GET productos page. */
router.get("/", function (req, res, next) {
  res.render("pages/productos", { title: "Productos", productos: productos });
});

module.exports = router;
