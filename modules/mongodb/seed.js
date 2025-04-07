const ProductoModel = require("../producto/producto.modelo");

const productosIniciales = [
  {
    nombre: "Cerveza Artesanal IPA",
    precio: 8.5,
    categoria: "cerveza",
    descripcion: "Cerveza IPA local con alto contenido de lúpulo",
    gradoAlcohol: 6.5,
    stock: 50,
  },
  {
    nombre: "Margarita Clásica",
    precio: 12.0,
    categoria: "coctel",
    descripcion: "Tequila, triple sec y jugo de lima",
    gradoAlcohol: 15.0,
    stock: 30,
  },
  {
    nombre: "Agua Mineral",
    precio: 3.0,
    categoria: "bebida",
    descripcion: "Agua mineral con gas",
    stock: 100,
  },
  {
    nombre: "Hamburguesa Clásica",
    precio: 10.5,
    categoria: "comida",
    descripcion: "Carne 200g con pan artesanal",
    stock: 25,
  },
  {
    nombre: "Nachos con Queso",
    precio: 7.0,
    categoria: "snack",
    descripcion: "Nachos caseros con queso fundido",
    stock: 40,
  },
  {
    nombre: "Mojito",
    precio: 11.5,
    categoria: "coctel",
    descripcion: "Ron, azúcar, menta, lima y soda",
    gradoAlcohol: 12.0,
    stock: 35,
  },
];

async function seedProductosIniciales() {
  try {
    console.log("Iniciando seed de productos...");

    // Insertar productos básicos
    const resultados = await ProductoModel.insertMany(productosIniciales);

    console.log(`${resultados.length} productos insertados correctamente`);
    return resultados;
  } catch (error) {
    console.error("Error en seedProductosIniciales:", error);
    throw error;
  }
}

module.exports = {
  seedProductosIniciales,
};
