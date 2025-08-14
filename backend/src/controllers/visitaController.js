const { Visita, User } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database').sequelize;

// Obtener todas las visitas con paginación y filtros
const getVisitas = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', estado = '', fecha = '' } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = {};
    
    // Filtro de búsqueda
    if (search) {
      whereClause = {
        [Op.or]: [
          { nombre: { [Op.iLike]: `%${search}%` } },
          { apellido: { [Op.iLike]: `%${search}%` } },
          { documento: { [Op.iLike]: `%${search}%` } },
          { departamento: { [Op.iLike]: `%${search}%` } }
        ]
      };
    }
    
    // Filtro por estado
    if (estado && estado !== 'todos') {
      whereClause.estado = estado;
    }
    
    // Filtro por fecha
    if (fecha) {
      const startDate = new Date(fecha);
      const endDate = new Date(fecha);
      endDate.setDate(endDate.getDate() + 1);
      
      whereClause.fecha_ingreso = {
        [Op.gte]: startDate,
        [Op.lt]: endDate
      };
    }
    
    const { count, rows: visitas } = await Visita.findAndCountAll({
      where: whereClause,
      order: [['fecha_ingreso', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json({
      success: true,
      data: visitas,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error obteniendo visitas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener una visita por ID
const getVisitaById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const visita = await Visita.findByPk(id);
    
    if (!visita) {
      return res.status(404).json({
        success: false,
        message: 'Visita no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: visita
    });
  } catch (error) {
    console.error('Error obteniendo visita:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Crear una nueva visita
const createVisita = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      apellido_paterno,
      apellido_materno,
      documento,
      departamento,
      ingreso_vehiculo,
      observaciones
    } = req.body;
    
    // Validar campos requeridos
    if (!nombre || !documento || !departamento) {
      return res.status(400).json({
        success: false,
        message: 'Los campos nombre, documento y departamento son obligatorios'
      });
    }
    
    // Crear la visita
    const visita = await Visita.create({
      nombre,
      apellido,
      apellido_paterno,
      apellido_materno,
      documento,
      departamento,
      ingreso_vehiculo,
      observaciones,
      fecha_ingreso: new Date(),
      estado: 'ingreso',
      created_by: req.user?.id || null
    });
    
    res.status(201).json({
      success: true,
      message: 'Visita registrada exitosamente',
      data: visita
    });
  } catch (error) {
    console.error('Error creando visita:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar una visita
const updateVisita = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const visita = await Visita.findByPk(id);
    if (!visita) {
      return res.status(404).json({
        success: false,
        message: 'Visita no encontrada'
      });
    }
    
    // Actualizar la visita
    await visita.update({
      ...updateData,
      updated_by: req.user?.id || null
    });
    
    res.json({
      success: true,
      message: 'Visita actualizada exitosamente',
      data: visita
    });
  } catch (error) {
    console.error('Error actualizando visita:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Registrar salida de una visita
const registrarSalida = async (req, res) => {
  try {
    const { id } = req.params;
    
    const visita = await Visita.findByPk(id);
    if (!visita) {
      return res.status(404).json({
        success: false,
        message: 'Visita no encontrada'
      });
    }
    
    if (visita.estado === 'salida') {
      return res.status(400).json({
        success: false,
        message: 'La visita ya tiene registrada una salida'
      });
    }
    
    // Registrar salida
    await visita.update({
      fecha_salida: new Date(),
      estado: 'salida',
      updated_by: req.user?.id || null
    });
    
    res.json({
      success: true,
      message: 'Salida registrada exitosamente',
      data: visita
    });
  } catch (error) {
    console.error('Error registrando salida:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Cancelar una visita
const cancelarVisita = async (req, res) => {
  try {
    const { id } = req.params;
    
    const visita = await Visita.findByPk(id);
    if (!visita) {
      return res.status(404).json({
        success: false,
        message: 'Visita no encontrada'
      });
    }
    
    if (visita.estado === 'cancelada') {
      return res.status(400).json({
        success: false,
        message: 'La visita ya está cancelada'
      });
    }
    
    // Cancelar visita
    await visita.update({
      estado: 'cancelada',
      updated_by: req.user?.id || null
    });
    
    res.json({
      success: true,
      message: 'Visita cancelada exitosamente',
      data: visita
    });
  } catch (error) {
    console.error('Error cancelando visita:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Eliminar una visita
const deleteVisita = async (req, res) => {
  try {
    const { id } = req.params;
    
    const visita = await Visita.findByPk(id);
    if (!visita) {
      return res.status(404).json({
        success: false,
        message: 'Visita no encontrada'
      });
    }
    
    await visita.destroy();
    
    res.json({
      success: true,
      message: 'Visita eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando visita:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener estadísticas de visitas
const getEstadisticas = async (req, res) => {
  try {
    const estadisticas = await Visita.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'total_visitas'],
        [sequelize.fn('COUNT', sequelize.literal("CASE WHEN estado = 'ingreso' THEN 1 END")), 'visitas_activas'],
        [sequelize.fn('COUNT', sequelize.literal("CASE WHEN estado = 'salida' THEN 1 END")), 'visitas_completadas'],
        [sequelize.fn('COUNT', sequelize.literal("CASE WHEN estado = 'cancelada' THEN 1 END")), 'visitas_canceladas']
      ],
      raw: true
    });
    
    res.json({
      success: true,
      data: estadisticas[0]
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  getVisitas,
  getVisitaById,
  createVisita,
  updateVisita,
  registrarSalida,
  cancelarVisita,
  deleteVisita,
  getEstadisticas
};

