const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      unique: true,
    },
    precio: {
      type: Number,
      required: true,
      min: 0,
    },
    categoria: {
      type: String,
      enum: ["cerveza", "coctel", "bebida", "comida", "snack"],
      required: true,
    },
    descripcion: String,
    gradoAlcohol: {
      type: Number,
      required: function () {
        return this.categoria === "cerveza" || this.categoria === "coctel";
      },
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    activo: {
      type: Boolean,
      default: true,
    },
    tiempoPreparacion: {
      type: Number,
      default: 5,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Producto", productoSchema);
