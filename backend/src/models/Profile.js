const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Profile extends Model {
    static associate(models) {
      // Un perfil puede tener muchos usuarios
      Profile.hasMany(models.User, { 
        foreignKey: 'perfil_id', 
        as: 'users',
        onDelete: 'RESTRICT' // No permitir eliminar perfil si tiene usuarios
      });
    }

    // Método para obtener información pública del perfil
    toJSON() {
      const values = Object.assign({}, this.get());
      return values;
    }

    // Método para verificar si el perfil tiene un permiso específico
    hasPermission(permission) {
      if (!this.permisos) return false;
      
      // Si tiene permisos totales
      if (this.permisos.all === true) return true;
      
      // Verificar permiso específico
      return this.permisos[permission] === true || 
             (typeof this.permisos[permission] === 'object' && this.permisos[permission].read === true);
    }

    // Método para verificar si puede escribir en un módulo
    canWrite(module) {
      if (!this.permisos) return false;
      
      if (this.permisos.all === true) return true;
      
      const modulePerms = this.permisos[module];
      return modulePerms === true || 
             (typeof modulePerms === 'object' && modulePerms.write === true);
    }
  }

  Profile.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    permisos: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
      validate: {
        isValidPermissions(value) {
          if (typeof value !== 'object') {
            throw new Error('Los permisos deben ser un objeto JSON válido');
          }
        }
      }
    },
    nivel_seguridad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 5
      }
    },
    modulos_acceso: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    restricciones_horarias: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {
        dias_semana: [1, 2, 3, 4, 5], // Lunes a Viernes
        hora_inicio: '08:00',
        hora_fin: '18:00'
      }
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
      defaultValue: 'security'
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
    modelName: 'Profile',
    tableName: 'perfiles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['nombre']
      },
      {
        fields: ['nivel_seguridad']
      },
      {
        fields: ['is_active']
      },
      {
        fields: ['modulos_acceso'],
        using: 'gin'
      }
    ]
  });

  return Profile;
};





