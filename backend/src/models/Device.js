const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Device extends Model {
    static associate(models) {
      // Un dispositivo pertenece a un área
      Device.belongsTo(models.Area, { 
        foreignKey: 'area_id', 
        as: 'area'
      });
      
      // Un dispositivo puede tener muchos logs de acceso
      Device.hasMany(models.AccessLog, { 
        foreignKey: 'dispositivo_id', 
        as: 'accessLogs'
      });
    }

    // Método para obtener información pública del dispositivo
    toJSON() {
      const values = Object.assign({}, this.get());
      return values;
    }
  }

  Device.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    tipo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50]
      }
    },
    modelo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ubicacion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ip_address: {
      type: DataTypes.INET,
      allowNull: true
    },
    area_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'areas',
        key: 'id'
      }
    },
    estado: {
      type: DataTypes.ENUM('activo', 'inactivo', 'mantenimiento', 'error'),
      allowNull: false,
      defaultValue: 'activo'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Device',
    tableName: 'dispositivos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['nombre']
      },
      {
        fields: ['tipo']
      },
      {
        fields: ['area_id']
      },
      {
        fields: ['estado']
      }
    ]
  });

  return Device;
};





