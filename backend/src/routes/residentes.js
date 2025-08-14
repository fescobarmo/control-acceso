const express = require('express');
const router = express.Router();
const residenteController = require('../controllers/residenteController');
const authenticateToken = require('../middleware/auth');

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticateToken);

// Rutas para residentes
router.get('/', residenteController.getResidentes);
router.get('/estadisticas', residenteController.getEstadisticas);
router.get('/departamento/:departamento', residenteController.getResidentesByDepartamento);
router.get('/:id', residenteController.getResidenteById);
router.post('/', residenteController.createResidente);
router.put('/:id', residenteController.updateResidente);
router.delete('/:id', residenteController.deleteResidente);

module.exports = router;
