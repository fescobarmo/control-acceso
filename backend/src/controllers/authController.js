const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Role, Profile } = require('../models');

const authController = {
  // Login de usuario - Nueva implementación limpia
  async login(req, res) {
    try {
      // Validar entrada
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          message: 'Datos de entrada inválidos',
          errors: errors.array() 
        });
      }

      const { username, password } = req.body;

      // Buscar usuario en la base de datos
      console.log('🔍 Buscando usuario:', username);
      
      const user = await User.findOne({
        where: { 
          username: username,
          is_active: true,
          estado: 'activo'
        }
      });
      
      console.log('🔍 Usuario encontrado:', user ? 'SÍ' : 'NO');
      if (user) {
        console.log('🔍 Usuario ID:', user.id);
        console.log('🔍 Usuario nombre:', user.nombre);
        console.log('🔍 Usuario apellido:', user.apellido);
        console.log('🔍 Usuario rol_id:', user.rol_id);
        console.log('🔍 Usuario perfil_id:', user.perfil_id);
      }

      // Verificar si el usuario existe
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no encontrado o inactivo'
        });
      }

      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Contraseña incorrecta'
        });
      }

      // Buscar rol y perfil por separado
      console.log('🔍 Buscando rol con ID:', user.rol_id);
      const role = await Role.findByPk(user.rol_id);
      console.log('🔍 Rol encontrado:', role ? 'SÍ' : 'NO');
      if (role) {
        console.log('🔍 Rol nombre:', role.nombre);
      }
      
      console.log('🔍 Buscando perfil con ID:', user.perfil_id);
      const profile = await Profile.findByPk(user.perfil_id);
      console.log('🔍 Perfil encontrado:', profile ? 'SÍ' : 'NO');
      if (profile) {
        console.log('🔍 Perfil nombre:', profile.nombre);
      }

      // Generar token JWT
      const token = jwt.sign(
        { 
          userId: user.id, 
          username: user.username, 
          rol_id: user.rol_id, 
          perfil_id: user.perfil_id 
        }, 
        process.env.JWT_SECRET || 'secret', 
        { expiresIn: '24h' }
      );

      // Actualizar último acceso
      await user.update({ ultimo_acceso: new Date() });

      // Construir respuesta del usuario (sin contraseña)
      const userResponse = {
        id: user.id,
        username: user.username,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        estado: user.estado,
        ultimo_acceso: user.ultimo_acceso,
        role: role ? {
          id: role.id,
          nombre: role.nombre,
          descripcion: role.descripcion,
          nivel_acceso: role.nivel_acceso,
          color: role.color,
          icono: role.icono
        } : null,
        profile: profile ? {
          id: profile.id,
          nombre: profile.nombre,
          descripcion: profile.descripcion,
          permisos: profile.permisos,
          nivel_seguridad: profile.nivel_seguridad,
          color: profile.color,
          icono: profile.icono
        } : null
      };

      // Enviar respuesta exitosa
      console.log('🔍 Respuesta completa del usuario:', JSON.stringify(userResponse, null, 2));
      
      res.json({
        success: true,
        message: 'Login exitoso',
        token,
        user: userResponse
      });

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  },

  // Obtener usuario actual
  async getCurrentUser(req, res) {
    try {
      const user = await User.findByPk(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      // Buscar rol y perfil por separado
      const role = await Role.findByPk(user.rol_id);
      const profile = await Profile.findByPk(user.perfil_id);

      const userResponse = {
        id: user.id,
        username: user.username,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        estado: user.estado,
        ultimo_acceso: user.ultimo_acceso,
        role: role ? {
          id: role.id,
          nombre: role.nombre,
          descripcion: role.descripcion,
          nivel_acceso: role.nivel_acceso,
          color: role.color,
          icono: role.icono
        } : null,
        profile: profile ? {
          id: profile.id,
          nombre: profile.nombre,
          descripcion: profile.descripcion,
          permisos: profile.permisos,
          nivel_seguridad: profile.nivel_seguridad,
          color: profile.color,
          icono: profile.icono
        } : null
      };

      res.json({
        success: true,
        user: userResponse
      });

    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  },

  // Logout de usuario
  async logout(req, res) {
    try {
      // En una implementación más robusta, aquí podrías invalidar el token
      // Por ahora, solo enviamos una respuesta exitosa
      res.json({
        success: true,
        message: 'Logout exitoso'
      });
    } catch (error) {
      console.error('Error en logout:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
};

module.exports = authController;
