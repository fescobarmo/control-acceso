const express = require('express');
const router = express.Router();
const visitaController = require('../controllers/visitaController');
const authMiddleware = require('../middleware/auth');

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// Obtener todas las visitas con filtros y paginación
router.get('/', visitaController.getVisitas);

// Obtener estadísticas de visitas
router.get('/estadisticas', visitaController.getEstadisticas);

// Obtener una visita específica por ID
router.get('/:id', visitaController.getVisitaById);

// Crear una nueva visita
router.post('/', visitaController.createVisita);

// Actualizar una visita existente
router.put('/:id', visitaController.updateVisita);

// Registrar salida de una visita
router.put('/:id/salida', visitaController.registrarSalida);

// Cancelar una visita
router.put('/:id/cancelar', visitaController.cancelarVisita);

// Eliminar una visita
router.delete('/:id', visitaController.deleteVisita);

module.exports = router;

