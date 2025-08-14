const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuración de la base de datos
const sequelize = new Sequelize(
  process.env.DB_NAME || 'control_acc_DB',
  process.env.DB_USER || 'admin',
  process.env.DB_PASSWORD || 'password123',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    },
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  }
);

// Función para probar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');
    return true;
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error);
    return false;
  }
};

// Función para sincronizar modelos
const syncDatabase = async (force = false) => {
  try {
    if (force) {
      await sequelize.sync({ force: true });
      console.log('🔄 Base de datos sincronizada (force: true)');
    } else {
      await sequelize.sync({ alter: true });
      console.log('🔄 Base de datos sincronizada (alter: true)');
    }
    return true;
  } catch (error) {
    console.error('❌ Error sincronizando la base de datos:', error);
    return false;
  }
};

// Función para cerrar la conexión
const closeConnection = async () => {
  try {
    await sequelize.close();
    console.log('🔌 Conexión a la base de datos cerrada.');
  } catch (error) {
    console.error('❌ Error cerrando la conexión:', error);
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncDatabase,
  closeConnection
};





