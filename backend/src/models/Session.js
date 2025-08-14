const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Session extends Model {
    static associate(models) {
      // Una sesión pertenece a un usuario
      Session.belongsTo(models.User, { 
        foreignKey: 'usuario_id', 
        as: 'user'
      });
    }
  }

  Session.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Session',
    tableName: 'sesiones',
    timestamps: false
  });

  return Session;
};





