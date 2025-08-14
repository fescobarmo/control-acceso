const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class AccessPermission extends Model {
    static associate(models) {
      // Un permiso pertenece a un usuario
      AccessPermission.belongsTo(models.User, { 
        foreignKey: 'usuario_id', 
        as: 'user'
      });
      
      // Un permiso pertenece a un área
      AccessPermission.belongsTo(models.Area, { 
        foreignKey: 'area_id', 
        as: 'area'
      });
    }
  }

  AccessPermission.init({
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
    tipo_permiso: {
      type: DataTypes.ENUM('lectura', 'escritura', 'admin'),
      defaultValue: 'lectura'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'AccessPermission',
    tableName: 'permisos_acceso',
    timestamps: false
  });

  return AccessPermission;
};





