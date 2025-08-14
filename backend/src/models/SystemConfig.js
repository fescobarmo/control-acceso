const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class SystemConfig extends Model {
    static associate(models) {
      // No hay asociaciones para SystemConfig
    }
  }

  SystemConfig.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    clave: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    valor: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'SystemConfig',
    tableName: 'configuracion_sistema',
    timestamps: false
  });

  return SystemConfig;
};





