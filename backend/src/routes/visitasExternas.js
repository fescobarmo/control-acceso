const express = require('express');
const router = express.Router();
const visitaExternaController = require('../controllers/visitaExternaController');
const authMiddleware = require('../middleware/auth');

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// Obtener todas las visitas externas con filtros y paginación
router.get('/', visitaExternaController.getVisitasExternas);

// Obtener estadísticas de visitas externas
router.get('/estadisticas', visitaExternaController.getEstadisticas);

// Obtener una visita externa específica por ID
router.get('/:id', visitaExternaController.getVisitaExternaById);

// Crear una nueva visita externa
router.post('/', visitaExternaController.createVisitaExterna);

// Actualizar una visita externa existente
router.put('/:id', visitaExternaController.updateVisitaExterna);

// Registrar salida de una visita externa
router.put('/:id/salida', visitaExternaController.registrarSalida);

// Cancelar una visita externa
router.put('/:id/cancelar', visitaExternaController.cancelarVisitaExterna);

// Eliminar una visita externa
router.delete('/:id', visitaExternaController.deleteVisitaExterna);

module.exports = router;

