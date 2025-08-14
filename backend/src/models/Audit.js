const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Audit extends Model {
    static associate(models) {
      // Un log de auditoría puede pertenecer a un usuario
      Audit.belongsTo(models.User, { 
        foreignKey: 'usuario_id', 
        as: 'user'
      });
    }
  }

  Audit.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    accion: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Audit',
    tableName: 'auditoria',
    timestamps: false
  });

  return Audit;
};





