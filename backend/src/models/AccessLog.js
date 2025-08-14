const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class AccessLog extends Model {
    static associate(models) {
      // Un log pertenece a un usuario
      AccessLog.belongsTo(models.User, { 
        foreignKey: 'usuario_id', 
        as: 'user'
      });
      
      // Un log pertenece a un área
      AccessLog.belongsTo(models.Area, { 
        foreignKey: 'area_id', 
        as: 'area'
      });
      
      // Un log puede tener un dispositivo
      AccessLog.belongsTo(models.Device, { 
        foreignKey: 'dispositivo_id', 
        as: 'device'
      });
    }
  }

  AccessLog.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    area_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    dispositivo_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tipo_acceso: {
      type: DataTypes.ENUM('entrada', 'salida', 'denegado', 'error'),
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    resultado: {
      type: DataTypes.ENUM('exitoso', 'denegado', 'error'),
      defaultValue: 'exitoso'
    }
  }, {
    sequelize,
    modelName: 'AccessLog',
    tableName: 'logs_acceso',
    timestamps: false
  });

  return AccessLog;
};





