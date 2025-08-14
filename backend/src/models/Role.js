const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Role extends Model {
    static associate(models) {
      // Un rol puede tener muchos usuarios
      Role.hasMany(models.User, { 
        foreignKey: 'rol_id', 
        as: 'users',
        onDelete: 'RESTRICT' // No permitir eliminar rol si tiene usuarios
      });
    }

    // Método para obtener información pública del rol
    toJSON() {
      const values = Object.assign({}, this.get());
      return values;
    }
  }

  Role.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [2, 50]
      }
    },
    descripcion: {
      type: DataTypes.TEXT,
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
    permisos_especiales: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {}
    },
    color: {
      type: DataTypes.STRING(7), // Código de color hex (#RRGGBB)
      allowNull: true,
      validate: {
        is: /^#[0-9A-F]{6}$/i
      }
    },
    icono: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'person'
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
    modelName: 'Role',
    tableName: 'roles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
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

  return Role;
};





