const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/auth');

// Middleware de validación para crear usuario
const validateCreateUser = [
  body('nombre').trim().isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('apellido').trim().isLength({ min: 2, max: 100 }).withMessage('El apellido debe tener entre 2 y 100 caracteres'),
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('username').isLength({ min: 3, max: 50 }).matches(/^[a-zA-Z0-9_]+$/).withMessage('Username debe tener entre 3 y 50 caracteres y solo puede contener letras, números y guiones bajos'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('rol_id').isInt({ min: 1 }).withMessage('ID de rol inválido'),
  body('perfil_id').isInt({ min: 1 }).withMessage('ID de perfil inválido'),
  body('telefono').optional().isLength({ max: 20 }).withMessage('El teléfono no puede exceder 20 caracteres'),
  body('direccion').optional().isLength({ max: 500 }).withMessage('La dirección no puede exceder 500 caracteres')
];

// Middleware de validación para actualizar usuario
const validateUpdateUser = [
  body('nombre').optional().trim().isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('apellido').optional().trim().isLength({ min: 2, max: 100 }).withMessage('El apellido debe tener entre 2 y 100 caracteres'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Email inválido'),
  body('username').optional().isLength({ min: 3, max: 50 }).matches(/^[a-zA-Z0-9_]+$/).withMessage('Username debe tener entre 3 y 50 caracteres y solo puede contener letras, números y guiones bajos'),
  body('password').optional().isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('rol_id').optional().isInt({ min: 1 }).withMessage('ID de rol inválido'),
  body('perfil_id').optional().isInt({ min: 1 }).withMessage('ID de perfil inválido'),
  body('telefono').optional().isLength({ max: 20 }).withMessage('El teléfono no puede exceder 20 caracteres'),
  body('direccion').optional().isLength({ max: 500 }).withMessage('La dirección no puede exceder 500 caracteres')
];

// Middleware de validación para cambio de estado
const validateStatusChange = [
  body('estado').isIn(['activo', 'inactivo', 'bloqueado', 'pendiente']).withMessage('Estado no válido')
];

// Rutas para obtener roles y perfiles (DEBEN IR ANTES que /:id)
router.get('/roles', userController.getRoles);
router.get('/profiles', userController.getProfiles);

// Rutas principales de usuarios (requieren autenticación)
router.get('/', authMiddleware, userController.getAllUsers);
router.get('/:id', authMiddleware, userController.getUserById);
router.post('/', authMiddleware, validateCreateUser, userController.createUser);
router.put('/:id', authMiddleware, validateUpdateUser, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);

// Ruta para cambiar estado del usuario
router.patch('/:id/status', authMiddleware, validateStatusChange, userController.toggleUserStatus);

module.exports = router;
