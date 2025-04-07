const express = require("express");
const router = express.Router();
const ProductoModel = require("../modules/producto/producto.modelo");

// GET all products and render the productos page
router.get("/productos", async (req, res) => {
  try {
    const productos = await ProductoModel.find();
    res.render("pages/productos", { title: "Productos", productos });
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
});

// API endpoint to get all products
router.get("/api/productos", async (req, res) => {
  try {
    const productos = await ProductoModel.find();
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
});

module.exports = router;
