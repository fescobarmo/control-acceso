const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Area extends Model {
    static associate(models) {
      // Un área puede tener muchos usuarios
      Area.hasMany(models.User, { 
        foreignKey: 'area_id', 
        as: 'users'
      });
      
      // Un área puede tener muchos dispositivos
      Area.hasMany(models.Device, { 
        foreignKey: 'area_id', 
        as: 'devices'
      });
      
      // Un área puede tener muchos permisos de acceso
      Area.hasMany(models.AccessPermission, { 
        foreignKey: 'area_id', 
        as: 'permissions'
      });
      
      // Un área puede tener muchos logs de acceso
      Area.hasMany(models.AccessLog, { 
        foreignKey: 'area_id', 
        as: 'accessLogs'
      });
    }

    // Método para obtener información pública del área
    toJSON() {
      const values = Object.assign({}, this.get());
      return values;
    }
  }

  Area.init({
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
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ubicacion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    nivel_acceso: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 10
      }
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
    modelName: 'Area',
    tableName: 'areas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['nombre']
      },
      {
        fields: ['nivel_acceso']
      },
      {
        fields: ['is_active']
      }
    ]
  });

  return Area;
};





