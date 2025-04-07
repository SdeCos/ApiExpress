const mongoose = require("mongoose");
const config = require("../../config/mongodb/mongodb-config.json");
const seed = require("./seed");

// Track connection attempts for reconnection logic
let connectionAttempts = 0;
const MAX_CONNECTION_ATTEMPTS = 5;

async function conectar(opciones = {}) {
  const defaultOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // These options are deprecated in newer Mongoose versions
    // and will be removed in the future
    ...(mongoose.version < "6.0.0" && {
      useCreateIndex: true,
      useFindAndModify: false,
    }),
    connectTimeoutMS: 30000, // 30 seconds timeout
    serverSelectionTimeoutMS: 30000, // 30 seconds timeout for server selection
  };

  const finalOptions = { ...defaultOptions, ...opciones };
  const conexionString = prepararCadenaConexion();

  try {
    console.log("Estableciendo conexión a MongoDB...");

    // Clear any existing listeners to prevent duplicates on reconnection
    mongoose.connection.removeAllListeners();

    // Set up event listeners before connecting
    mongoose.connection.on("connected", async () => {
      console.log(`Conectado a MongoDB: ${getDbName(conexionString)}`);
      connectionAttempts = 0; // Reset connection attempts on successful connection

      // Run seed data
      await runSeedIfNeeded();
    });

    mongoose.connection.on("error", (err) => {
      console.error("Error de conexión a MongoDB:", err);
      handleReconnection();
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Desconectado de MongoDB");
      handleReconnection();
    });

    // Connect to MongoDB
    await mongoose.connect(conexionString, finalOptions);

    return mongoose.connection;
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    handleReconnection();
    throw error;
  }
}

function handleReconnection() {
  if (connectionAttempts < MAX_CONNECTION_ATTEMPTS) {
    connectionAttempts++;
    const reconnectDelay = Math.min(
      1000 * Math.pow(2, connectionAttempts),
      60000,
    ); // Exponential backoff with max 60s
    console.log(
      `Intentando reconectar en ${reconnectDelay / 1000} segundos (intento ${connectionAttempts}/${MAX_CONNECTION_ATTEMPTS})...`,
    );

    setTimeout(() => {
      conectar().catch((err) => {
        console.error("Error en intento de reconexión:", err);
      });
    }, reconnectDelay);
  } else {
    console.error(
      `Fallaron ${MAX_CONNECTION_ATTEMPTS} intentos de conexión. Por favor, revise la configuración de MongoDB.`,
    );
  }
}

async function runSeedIfNeeded() {
  // Check for both NODE_ENV and a specific SEED_DATA flag for more control
  if (
    process.env.NODE_ENV === "development" ||
    process.env.SEED_DATA === "true"
  ) {
    console.log("Iniciando seed de datos básicos...");
    try {
      // Check if the seed function exists before calling it
      if (typeof seed.seedProductosIniciales === "function") {
        await seed.seedProductosIniciales();
        console.log("Seed de datos básicos completado con éxito.");
      } else {
        console.warn(
          "Función seedProductosIniciales no encontrada en el módulo seed.",
        );
      }
    } catch (error) {
      console.error("Error durante el seed de datos básicos:", error);
    }
  } else {
    console.log(
      "Seed de datos omitido (no estamos en entorno de desarrollo o SEED_DATA no está habilitado)",
    );
  }
}

function prepararCadenaConexion() {
  // Priority: 1. Environment variable, 2. Config file
  if (process.env.MONGODB_URI) {
    console.log(
      "Usando cadena de conexión desde variable de entorno MONGODB_URI",
    );
    return process.env.MONGODB_URI;
  }

  try {
    // Validate config before using it
    if (!config.mongo) {
      throw new Error(
        "Configuración de MongoDB no encontrada en el archivo de configuración",
      );
    }

    const { usuario, contrasena, servidor, basedatos } = config.mongo;

    // Check if all required fields are present
    if (!servidor || !basedatos) {
      throw new Error(
        "Configuración de MongoDB incompleta: se requiere servidor y basedatos",
      );
    }

    // Build connection string based on whether auth is needed
    if (usuario && contrasena) {
      console.log(
        `Usando conexión autenticada a MongoDB: ${servidor}/${basedatos}`,
      );
      return `mongodb://${encodeURIComponent(usuario)}:${encodeURIComponent(contrasena)}@${servidor}/${basedatos}?authSource=admin`;
    } else {
      console.log(
        `Usando conexión sin autenticación a MongoDB: ${servidor}/${basedatos}`,
      );
      return `mongodb://${servidor}/${basedatos}`;
    }
  } catch (error) {
    console.error("Error al preparar cadena de conexión:", error);
    throw error;
  }
}

// Helper to extract database name from connection string for logging
function getDbName(connectionString) {
  try {
    // Simple extraction - this is just for logging purposes
    const parts = connectionString.split("/");
    const dbPart = parts[parts.length - 1];
    return dbPart.split("?")[0];
  } catch (e) {
    return "unknown";
  }
}

function desconectar() {
  console.log("Cerrando conexión a MongoDB...");
  return mongoose.disconnect();
}

function estaConectado() {
  const state = mongoose.connection.readyState;
  const states = {
    0: "desconectado",
    1: "conectado",
    2: "conectando",
    3: "desconectando",
  };
  console.log(
    `Estado actual de la conexión: ${states[state] || "desconocido"}`,
  );
  return state === 1;
}

// Add a function to check connection and database
async function verificarConexion() {
  if (!estaConectado()) {
    console.log("No hay conexión activa a MongoDB. Intentando conectar...");
    await conectar();
  }

  try {
    // Try a simple operation to verify the connection is working
    await mongoose.connection.db.admin().ping();
    console.log("Conexión a MongoDB verificada correctamente");
    return true;
  } catch (error) {
    console.error("Error al verificar la conexión a MongoDB:", error);
    return false;
  }
}

module.exports = {
  conectar,
  desconectar,
  estaConectado,
  verificarConexion,
};
