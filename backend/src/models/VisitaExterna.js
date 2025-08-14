const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const VisitaExterna = sequelize.define('VisitaExterna', {
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
    documento: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    empresa: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    motivo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    ubicacion_destino: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    contacto: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    vehiculo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    placa: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    tipo_visita: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    autorizacion: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    acompanantes: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    equipamiento: {
      type: DataTypes.TEXT,
      allowNull: true
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
    tableName: 'visitas_externas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  // Definir asociaciones
  VisitaExterna.associate = (models) => {
    if (models.User) {
      VisitaExterna.belongsTo(models.User, { 
        foreignKey: 'created_by', 
        as: 'creador' 
      });
      VisitaExterna.belongsTo(models.User, { 
        foreignKey: 'updated_by', 
        as: 'actualizador' 
      });
    }
  };

  return VisitaExterna;
};




