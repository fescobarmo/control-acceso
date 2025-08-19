const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

const db = admin.firestore();

// Get all residents
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', activo } = req.query;
    
    let query = db.collection('residentes');
    
    // Filter by active status if provided
    if (activo !== undefined) {
      query = query.where('activo', '==', activo === 'true');
    }
    
    // Apply search filter
    if (search) {
      // For simple search, we'll use array-contains for tags or startAt/endAt for names
      // Note: Firestore has limitations with text search
      query = query.orderBy('nombre').startAt(search).endAt(search + '\uf8ff');
    }
    
    const snapshot = await query.get();
    const residentes = [];
    
    snapshot.forEach(doc => {
      residentes.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Simple pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedResidentes = residentes.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedResidentes,
      total: residentes.length,
      page: parseInt(page),
      totalPages: Math.ceil(residentes.length / limit)
    });
    
  } catch (error) {
    console.error('Error getting residents:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener residentes'
    });
  }
});

// Get resident by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const doc = await db.collection('residentes').doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Residente no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: {
        id: doc.id,
        ...doc.data()
      }
    });
    
  } catch (error) {
    console.error('Error getting resident:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener residente'
    });
  }
});

// Create new resident
router.post('/', async (req, res) => {
  try {
    const residenteData = {
      ...req.body,
      activo: true,
      createdBy: req.user.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const docRef = await db.collection('residentes').add(residenteData);
    
    res.status(201).json({
      success: true,
      message: 'Residente creado exitosamente',
      data: {
        id: docRef.id,
        ...residenteData
      }
    });
    
  } catch (error) {
    console.error('Error creating resident:', error);
    res.status(400).json({
      success: false,
      message: 'Error al crear residente'
    });
  }
});

// Update resident
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const updateData = {
      ...req.body,
      updatedBy: req.user.uid,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    await db.collection('residentes').doc(id).update(updateData);
    
    res.json({
      success: true,
      message: 'Residente actualizado exitosamente'
    });
    
  } catch (error) {
    console.error('Error updating resident:', error);
    res.status(400).json({
      success: false,
      message: 'Error al actualizar residente'
    });
  }
});

// Delete resident (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.collection('residentes').doc(id).update({
      activo: false,
      deletedBy: req.user.uid,
      deletedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({
      success: true,
      message: 'Residente eliminado exitosamente'
    });
    
  } catch (error) {
    console.error('Error deleting resident:', error);
    res.status(400).json({
      success: false,
      message: 'Error al eliminar residente'
    });
  }
});

// Get resident by email
router.get('/email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    const snapshot = await db.collection('residentes')
      .where('email', '==', email)
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      return res.status(404).json({
        success: false,
        message: 'Residente no encontrado'
      });
    }
    
    const doc = snapshot.docs[0];
    res.json({
      success: true,
      data: {
        id: doc.id,
        ...doc.data()
      }
    });
    
  } catch (error) {
    console.error('Error getting resident by email:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener residente'
    });
  }
});

// Get residents by apartment/unit
router.get('/unidad/:unidad', async (req, res) => {
  try {
    const { unidad } = req.params;
    
    const snapshot = await db.collection('residentes')
      .where('unidad', '==', unidad)
      .where('activo', '==', true)
      .get();
    
    const residentes = [];
    snapshot.forEach(doc => {
      residentes.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json({
      success: true,
      data: residentes
    });
    
  } catch (error) {
    console.error('Error getting residents by unit:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener residentes'
    });
  }
});

module.exports = router;

