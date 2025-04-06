(function () {
    "use strict";
  
    const mongoose = require('mongoose');
    const config = require('../../config');
    const seed = require('./seed');
  
    module.exports = {
      conectar: conectar,
      desconectar: desconectar,
      estaConectado: estaConectado,
      seedInicial: seed.limpiarYSeed
    };
  
    async function conectar(opciones = {}) {
      const defaultOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
      };
  
      const finalOptions = { ...defaultOptions, ...opciones };
      const conexionString = prepararCadenaConexion();
  
      try {
        await mongoose.connect(conexionString, finalOptions);
        
        mongoose.connection.on('connected', () => {
          console.log(`Conectado a MongoDB: ${config.mongo.basedatos}`);
        });
  
        mongoose.connection.on('error', (err) => {
          console.error('Error de conexión a MongoDB:', err);
        });
  
        // Seed automático en desarrollo
        if (process.env.NODE_ENV === 'development') {
          await seed.seedBasico();
        }
      } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
        throw error;
      }
    }
  
    function prepararCadenaConexion() {
      if (process.env.MONGODB_URI) {
        return process.env.MONGODB_URI;
      }
      
      return `mongodb://${config.mongo.usuario}:${config.mongo.contrasena}@${config.mongo.servidor}/${config.mongo.basedatos}?authSource=admin`;
    }
  
    function desconectar() {
      return mongoose.disconnect();
    }
  
    function estaConectado() {
      return mongoose.connection.readyState === 1;
    }
  })();
  