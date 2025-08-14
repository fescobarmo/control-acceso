const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Residente = sequelize.define('Residente', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    apellido_paterno: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    apellido_materno: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    documento: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    tipo_documento: {
      type: DataTypes.ENUM('DNI', 'CE', 'PASAPORTE', 'RUC'),
      defaultValue: 'DNI'
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    departamento: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    piso: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    tipo_residente: {
      type: DataTypes.ENUM('propietario', 'inquilino', 'familiar'),
      defaultValue: 'propietario'
    },
    fecha_nacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    ocupacion: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    empresa: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    vehiculo: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    placa: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    marca: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    modelo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    color: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    fecha_registro: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    estado: {
      type: DataTypes.ENUM('activo', 'inactivo', 'suspendido'),
      defaultValue: 'activo'
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
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    }
  }, {
    tableName: 'residentes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Residente;
};
