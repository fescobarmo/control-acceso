const { VisitaExterna, User } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database').sequelize;

// Obtener todas las visitas externas con paginación y filtros
const getVisitasExternas = async (req, res) => {
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
          { empresa: { [Op.iLike]: `%${search}%` } }
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
    
    const { count, rows: visitas } = await VisitaExterna.findAndCountAll({
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
    console.error('Error obteniendo visitas externas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener una visita externa por ID
const getVisitaExternaById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const visita = await VisitaExterna.findByPk(id);
    
    if (!visita) {
      return res.status(404).json({
        success: false,
        message: 'Visita externa no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: visita
    });
  } catch (error) {
    console.error('Error obteniendo visita externa:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Crear una nueva visita externa
const createVisitaExterna = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      documento,
      empresa,
      motivo,
      ubicacion_destino,
      contacto,
      vehiculo,
      placa,
      tipo_visita,
      autorizacion,
      acompanantes,
      equipamiento,
      observaciones
    } = req.body;
    
    // Validar campos requeridos
    if (!nombre || !documento || !empresa || !motivo || !ubicacion_destino || !contacto || !tipo_visita || !autorizacion) {
      return res.status(400).json({
        success: false,
        message: 'Los campos nombre, documento, empresa, motivo, ubicación destino, contacto, tipo visita y autorización son obligatorios'
      });
    }
    
    // Crear la visita externa
    const visita = await VisitaExterna.create({
      nombre,
      apellido,
      documento,
      empresa,
      motivo,
      ubicacion_destino,
      contacto,
      vehiculo,
      placa,
      tipo_visita,
      autorizacion,
      acompanantes,
      equipamiento,
      observaciones,
      fecha_ingreso: new Date(),
      estado: 'ingreso',
      created_by: req.user?.id || null
    });
    
    res.status(201).json({
      success: true,
      message: 'Visita externa registrada exitosamente',
      data: visita
    });
  } catch (error) {
    console.error('Error creando visita externa:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar una visita externa
const updateVisitaExterna = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const visita = await VisitaExterna.findByPk(id);
    if (!visita) {
      return res.status(404).json({
        success: false,
        message: 'Visita externa no encontrada'
      });
    }
    
    // Actualizar la visita externa
    await visita.update({
      ...updateData,
      updated_by: req.user?.id || null
    });
    
    res.json({
      success: true,
      message: 'Visita externa actualizada exitosamente',
      data: visita
    });
  } catch (error) {
    console.error('Error actualizando visita externa:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Registrar salida de una visita externa
const registrarSalida = async (req, res) => {
  try {
    const { id } = req.params;
    
    const visita = await VisitaExterna.findByPk(id);
    if (!visita) {
      return res.status(404).json({
        success: false,
        message: 'Visita externa no encontrada'
      });
    }
    
    if (visita.estado === 'salida') {
      return res.status(400).json({
        success: false,
        message: 'La visita externa ya tiene registrada una salida'
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

// Cancelar una visita externa
const cancelarVisitaExterna = async (req, res) => {
  try {
    const { id } = req.params;
    
    const visita = await VisitaExterna.findByPk(id);
    if (!visita) {
      return res.status(404).json({
        success: false,
        message: 'Visita externa no encontrada'
      });
    }
    
    if (visita.estado === 'cancelada') {
      return res.status(400).json({
        success: false,
        message: 'La visita externa ya está cancelada'
      });
    }
    
    // Cancelar visita externa
    await visita.update({
      estado: 'cancelada',
      updated_by: req.user?.id || null
    });
    
    res.json({
      success: true,
      message: 'Visita externa cancelada exitosamente',
      data: visita
    });
  } catch (error) {
    console.error('Error cancelando visita externa:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Eliminar una visita externa
const deleteVisitaExterna = async (req, res) => {
  try {
    const { id } = req.params;
    
    const visita = await VisitaExterna.findByPk(id);
    if (!visita) {
      return res.status(404).json({
        success: false,
        message: 'Visita externa no encontrada'
      });
    }
    
    await visita.destroy();
    
    res.json({
      success: true,
      message: 'Visita externa eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando visita externa:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener estadísticas de visitas externas
const getEstadisticas = async (req, res) => {
  try {
    const estadisticas = await VisitaExterna.findAll({
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
  getVisitasExternas,
  getVisitaExternaById,
  createVisitaExterna,
  updateVisitaExterna,
  registrarSalida,
  cancelarVisitaExterna,
  deleteVisitaExterna,
  getEstadisticas
};

