const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Visita = sequelize.define('Visita', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    apellido_paterno: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    apellido_materno: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    documento: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    departamento: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ingreso_vehiculo: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    fecha_ingreso: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    fecha_salida: {
      type: DataTypes.DATE,
      allowNull: true
    },
    estado: {
      type: DataTypes.ENUM('ingreso', 'salida', 'cancelada'),
      allowNull: false,
      defaultValue: 'ingreso'
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    }
  }, {
    tableName: 'visitas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  // Definir asociaciones
  Visita.associate = (models) => {
    if (models.User) {
      Visita.belongsTo(models.User, { 
        foreignKey: 'created_by', 
        as: 'creador' 
      });
      Visita.belongsTo(models.User, { 
        foreignKey: 'updated_by', 
        as: 'actualizador' 
      });
    }
  };

  return Visita;
};




