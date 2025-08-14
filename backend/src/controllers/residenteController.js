const { Residente } = require('../models');
const { Op } = require('sequelize');

// Obtener todos los residentes con paginación y filtros
const getResidentes = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', estado = 'todos', tipo = 'todos' } = req.query;
    const offset = (page - 1) * limit;

    // Construir condiciones de búsqueda
    const whereConditions = {};
    
    if (search) {
      whereConditions[Op.or] = [
        { nombre: { [Op.iLike]: `%${search}%` } },
        { apellido_paterno: { [Op.iLike]: `%${search}%` } },
        { apellido_materno: { [Op.iLike]: `%${search}%` } },
        { documento: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { departamento: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (estado !== 'todos') {
      whereConditions.estado = estado;
    }

    if (tipo !== 'todos') {
      whereConditions.tipo_residente = tipo;
    }

    const { count, rows: residentes } = await Residente.findAndCountAll({
      where: whereConditions,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      residentes,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error('Error al obtener residentes:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener estadísticas de residentes
const getEstadisticas = async (req, res) => {
  try {
    const totalResidentes = await Residente.count();
    const residentesActivos = await Residente.count({ where: { estado: 'activo' } });
    const propietarios = await Residente.count({ where: { tipo_residente: 'propietario' } });
    const inquilinos = await Residente.count({ where: { tipo_residente: 'inquilino' } });
    const familiares = await Residente.count({ where: { tipo_residente: 'familiar' } });

    res.json({
      total_residentes: totalResidentes,
      residentes_activos: residentesActivos,
      propietarios: propietarios,
      inquilinos: inquilinos,
      familiares: familiares
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener un residente por ID
const getResidenteById = async (req, res) => {
  try {
    const { id } = req.params;
    const residente = await Residente.findByPk(id);
    
    if (!residente) {
      return res.status(404).json({ message: 'Residente no encontrado' });
    }
    
    res.json(residente);
  } catch (error) {
    console.error('Error al obtener residente:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Crear un nuevo residente
const createResidente = async (req, res) => {
  try {
    const residenteData = {
      ...req.body,
      created_by: req.user.id,
      updated_by: req.user.id
    };

    // Verificar si ya existe un residente con el mismo documento
    const existingResidente = await Residente.findOne({
      where: { documento: residenteData.documento }
    });

    if (existingResidente) {
      return res.status(400).json({ 
        message: 'Ya existe un residente con este número de documento' 
      });
    }

    const residente = await Residente.create(residenteData);
    res.status(201).json(residente);
  } catch (error) {
    console.error('Error al crear residente:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: 'Datos de validación incorrectos',
        errors: error.errors.map(e => e.message)
      });
    }
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Actualizar un residente
const updateResidente = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updated_by: req.user.id
    };

    const residente = await Residente.findByPk(id);
    
    if (!residente) {
      return res.status(404).json({ message: 'Residente no encontrado' });
    }

    // Verificar si el documento ya existe en otro residente
    if (updateData.documento && updateData.documento !== residente.documento) {
      const existingResidente = await Residente.findOne({
        where: { 
          documento: updateData.documento,
          id: { [Op.ne]: id }
        }
      });

      if (existingResidente) {
        return res.status(400).json({ 
          message: 'Ya existe otro residente con este número de documento' 
        });
      }
    }

    await residente.update(updateData);
    res.json(residente);
  } catch (error) {
    console.error('Error al actualizar residente:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: 'Datos de validación incorrectos',
        errors: error.errors.map(e => e.message)
      });
    }
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Eliminar un residente
const deleteResidente = async (req, res) => {
  try {
    const { id } = req.params;
    const residente = await Residente.findByPk(id);
    
    if (!residente) {
      return res.status(404).json({ message: 'Residente no encontrado' });
    }

    await residente.destroy();
    res.json({ message: 'Residente eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar residente:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Buscar residentes por departamento
const getResidentesByDepartamento = async (req, res) => {
  try {
    const { departamento } = req.params;
    const residentes = await Residente.findAll({
      where: { 
        departamento: departamento,
        estado: 'activo'
      },
      order: [['nombre', 'ASC']]
    });
    
    res.json(residentes);
  } catch (error) {
    console.error('Error al obtener residentes por departamento:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  getResidentes,
  getEstadisticas,
  getResidenteById,
  createResidente,
  updateResidente,
  deleteResidente,
  getResidentesByDepartamento
};
