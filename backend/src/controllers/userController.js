const { User, Role, Profile } = require('../models');
const { Op } = require('sequelize');

const userController = {
  // Obtener todos los usuarios con paginación y filtros
  async getAllUsers(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        search = '', 
        rol = '', 
        estado = '',
        sortBy = 'created_at',
        sortOrder = 'DESC'
      } = req.query;

      const offset = (page - 1) * limit;
      
      // Construir condiciones de búsqueda
      const whereClause = {
        is_active: true
      };

      if (search) {
        whereClause[Op.or] = [
          { nombre: { [Op.iLike]: `%${search}%` } },
          { apellido: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { username: { [Op.iLike]: `%${search}%` } }
        ];
      }

      if (rol) {
        whereClause.rol_id = rol;
      }

      if (estado) {
        whereClause.estado = estado;
      }

      // Obtener usuarios con relaciones
      const { count, rows: users } = await User.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Role,
            as: 'role',
            attributes: ['id', 'nombre', 'descripcion', 'nivel_acceso']
          },
          {
            model: Profile,
            as: 'profile',
            attributes: ['id', 'nombre', 'descripcion', 'permisos']
          }
        ],
        order: [[sortBy, sortOrder.toUpperCase()]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      // Calcular información de paginación
      const totalPages = Math.ceil(count / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      res.json({
        success: true,
        data: users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages,
          hasNextPage,
          hasPrevPage
        }
      });
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Obtener usuario por ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      
      const user = await User.findByPk(id, {
        include: [
          {
            model: Role,
            as: 'role',
            attributes: ['id', 'nombre', 'descripcion', 'nivel_acceso']
          },
          {
            model: Profile,
            as: 'profile',
            attributes: ['id', 'nombre', 'descripcion', 'permisos']
          }
        ]
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Crear nuevo usuario
  async createUser(req, res) {
    try {
      const {
        nombre,
        apellido,
        email,
        username,
        password,
        rol_id,
        perfil_id,
        telefono,
        direccion
      } = req.body;

      // Verificar si el email ya existe
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'El email ya está registrado'
        });
      }

      // Verificar si el username ya existe
      const existingUsername = await User.findOne({ where: { username } });
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: 'El nombre de usuario ya está en uso'
        });
      }

      // Crear el usuario
      const newUser = await User.create({
        nombre,
        apellido,
        email,
        username,
        password_hash: password, // Se hasheará automáticamente en el hook
        rol_id,
        perfil_id,
        telefono,
        direccion,
        estado: 'activo',
        created_by: req.user?.id // Si hay usuario autenticado
      }, {
        user: req.user // Para el hook afterCreate
      });

      // Obtener el usuario creado con sus relaciones
      const userWithRelations = await User.findByPk(newUser.id, {
        include: [
          {
            model: Role,
            as: 'role',
            attributes: ['id', 'nombre', 'descripcion', 'nivel_acceso']
          },
          {
            model: Profile,
            as: 'profile',
            attributes: ['id', 'nombre', 'descripcion', 'permisos']
          }
        ]
      });

      res.status(201).json({
        success: true,
        message: 'Usuario creado exitosamente',
        data: userWithRelations
      });
    } catch (error) {
      console.error('Error creando usuario:', error);
      
      // Manejar errores de validación de Sequelize
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Datos de usuario inválidos',
          errors: error.errors.map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }

      if (error.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({
          success: false,
          message: 'Rol o perfil especificado no existe'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Actualizar usuario
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const {
        nombre,
        apellido,
        email,
        username,
        password,
        rol_id,
        perfil_id,
        estado,
        telefono,
        direccion
      } = req.body;

      // Buscar el usuario
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      // Verificar si el email ya existe (si se está cambiando)
      if (email && email !== user.email) {
        const existingEmail = await User.findOne({ 
          where: { 
            email,
            id: { [Op.ne]: id }
          }
        });
        if (existingEmail) {
          return res.status(400).json({
            success: false,
            message: 'El email ya está registrado por otro usuario'
          });
        }
      }

      // Verificar si el username ya existe (si se está cambiando)
      if (username && username !== user.username) {
        const existingUsername = await User.findOne({ 
          where: { 
            username,
            id: { [Op.ne]: id }
          }
        });
        if (existingUsername) {
          return res.status(400).json({
            success: false,
            message: 'El nombre de usuario ya está en uso por otro usuario'
          });
        }
      }

      // Preparar datos para actualización
      const updateData = {
        nombre: nombre || user.nombre,
        apellido: apellido || user.apellido,
        email: email || user.email,
        username: username || user.username,
        rol_id: rol_id || user.rol_id,
        perfil_id: perfil_id || user.perfil_id,
        estado: estado || user.estado,
        telefono: telefono !== undefined ? telefono : user.telefono,
        direccion: direccion !== undefined ? direccion : user.direccion,
        updated_by: req.user?.id
      };

      // Si se proporciona una nueva contraseña, hashearla
      if (password) {
        updateData.password_hash = password;
      }

      // Actualizar el usuario
      await user.update(updateData, {
        user: req.user // Para el hook afterUpdate
      });

      // Obtener el usuario actualizado con sus relaciones
      const updatedUser = await User.findByPk(id, {
        include: [
          {
            model: Role,
            as: 'role',
            attributes: ['id', 'nombre', 'descripcion', 'nivel_acceso']
          },
          {
            model: Profile,
            as: 'profile',
            attributes: ['id', 'nombre', 'descripcion', 'permisos']
          }
        ]
      });

      res.json({
        success: true,
        message: 'Usuario actualizado exitosamente',
        data: updatedUser
      });
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Datos de usuario inválidos',
          errors: error.errors.map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Eliminar usuario (soft delete)
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      // Soft delete - marcar como inactivo
      await user.update({ 
        is_active: false,
        estado: 'inactivo',
        updated_by: req.user?.id
      });

      res.json({
        success: true,
        message: 'Usuario eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Cambiar estado del usuario
  async toggleUserStatus(req, res) {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      // Validar estado
      const estadosValidos = ['activo', 'inactivo', 'bloqueado', 'pendiente'];
      if (!estadosValidos.includes(estado)) {
        return res.status(400).json({
          success: false,
          message: 'Estado no válido'
        });
      }

      await user.update({ 
        estado,
        updated_by: req.user?.id
      });

      res.json({
        success: true,
        message: `Estado del usuario cambiado a ${estado}`,
        data: { id: user.id, estado: user.estado }
      });
    } catch (error) {
      console.error('Error cambiando estado del usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Obtener roles disponibles
  async getRoles(req, res) {
    try {
      const roles = await Role.findAll({
        where: { is_active: true },
        attributes: ['id', 'nombre', 'descripcion', 'nivel_acceso'],
        order: [['nivel_acceso', 'DESC']]
      });

      res.json({
        success: true,
        data: roles
      });
    } catch (error) {
      console.error('Error obteniendo roles:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  },

  // Obtener perfiles disponibles
  async getProfiles(req, res) {
    try {
      const profiles = await Profile.findAll({
        where: { is_active: true },
        attributes: ['id', 'nombre', 'descripcion', 'permisos'],
        order: [['nombre', 'ASC']]
      });

      res.json({
        success: true,
        data: profiles
      });
    } catch (error) {
      console.error('Error obteniendo perfiles:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
};

module.exports = userController;
