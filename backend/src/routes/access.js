const express = require('express');
const accessController = require('../controllers/accessController');

const router = express.Router();

// Rutas de control de acceso
router.get('/', accessController.getAllAccess);
router.get('/:id', accessController.getAccessById);
router.post('/', accessController.createAccess);
router.put('/:id', accessController.updateAccess);
router.delete('/:id', accessController.deleteAccess);
router.get('/user/:userId', accessController.getAccessByUser);

module.exports = router;





