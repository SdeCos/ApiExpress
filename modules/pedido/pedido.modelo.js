(function () {
    var mongoose = require("mongoose");
    var Schema = mongoose.Schema;
  
    var pedidoSchema = new Schema({
      mesa: {
        type: Number,
        required: true,
        min: 1
      },
      productos: [{
        producto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Producto",
          required: true
        },
        cantidad: {
          type: Number,
          required: true,
          min: 1
        },
        notas: String
      }],
      estado: {
        type: String,
        enum: ['pendiente', 'en_preparacion', 'listo', 'entregado', 'cancelado'],
        default: 'pendiente'
      },
      total: {
        type: Number,
        required: true,
        min: 0
      },
      camarero: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
      },
      horaInicio: {
        type: Date,
        default: Date.now
      },
      horaFinalizacion: Date
    }, { timestamps: true });
  
    module.exports = mongoose.model("Pedido", pedidoSchema);
  })();
  