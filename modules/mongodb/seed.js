(function () {
    "use strict";
  
    const ProductoModel = require("../producto/producto.modelo");
    const CervezaModel = require("../cerveza/cerveza.modelo"); // Opcional para especialización
    const CoctelModel = require("../coctel/coctel.modelo"); // Opcional para especialización
  
    module.exports = {
      seedProductosIniciales: seedProductosIniciales,
      limpiarYSeed: limpiarYSeed,
      seedBasico: seedBasico
    };
  
    // Datos iniciales para el bar
    const productosIniciales = [
      {
        nombre: "Cerveza Artesanal IPA",
        precio: 8.50,
        categoria: "cerveza",
        descripcion: "Cerveza IPA local con alto contenido de lúpulo",
        gradoAlcohol: 6.5,
        stock: 50
      },
      {
        nombre: "Margarita Clásica",
        precio: 12.00,
        categoria: "coctel",
        descripcion: "Tequila, triple sec y jugo de lima",
        gradoAlcohol: 15.0,
        stock: 30
      },
      {
        nombre: "Agua Mineral",
        precio: 3.00,
        categoria: "bebida",
        descripcion: "Agua mineral con gas",
        stock: 100
      },
      {
        nombre: "Hamburguesa Clásica",
        precio: 10.50,
        categoria: "comida",
        descripcion: "Carne 200g con pan artesanal",
        stock: 25
      },
      {
        nombre: "Nachos con Queso",
        precio: 7.00,
        categoria: "snack",
        descripcion: "Nachos caseros con queso fundido",
        stock: 40
      },
      {
        nombre: "Mojito",
        precio: 11.50,
        categoria: "coctel",
        descripcion: "Ron, azúcar, menta, lima y soda",
        gradoAlcohol: 12.0,
        stock: 35
      }
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
  
    async function limpiarYSeed() {
      try {
        // Limpiar colección primero
        await ProductoModel.deleteMany({});
        console.log("Colección de productos limpiada");
        
        // Poblar con datos iniciales
        return await seedProductosIniciales();
      } catch (error) {
        console.error("Error en limpiarYSeed:", error);
        throw error;
      }
    }
  
    // Versión básica para desarrollo
    async function seedBasico() {
      try {
        const count = await ProductoModel.countDocuments();
        
        if (count === 0) {
          return await seedProductosIniciales();
        }
        
        console.log("La base de datos ya contiene productos. No se realizó seed.");
        return [];
      } catch (error) {
        console.error("Error en seedBasico:", error);
        throw error;
      }
    }
  })();
  