const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

const db = admin.firestore();

// Register user (create user profile in Firestore)
router.post('/register', async (req, res) => {
  try {
    const { email, password, userData } = req.body;

    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: userData.nombre || userData.displayName,
      disabled: false
    });

    // Create user profile in Firestore
    const userProfile = {
      email: userRecord.email,
      displayName: userRecord.displayName,
      role: userData.role || 'user',
      activo: true,
      ...userData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('users').doc(userRecord.uid).set(userProfile);

    res.json({
      success: true,
      message: 'Usuario creado exitosamente',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        ...userProfile
      }
    });

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error al crear usuario'
    });
  }
});

// Get current user info
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de autorización requerido'
      });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Get user data from Firestore
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const userData = userDoc.data();
    
    res.json({
      success: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        displayName: decodedToken.name,
        ...userData
      }
    });

  } catch (error) {
    console.error('Error getting user info:', error);
    res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de autorización requerido'
      });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    const updates = {
      ...req.body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Update Firestore document
    await db.collection('users').doc(decodedToken.uid).update(updates);

    // Update Firebase Auth profile if needed
    if (updates.displayName) {
      await admin.auth().updateUser(decodedToken.uid, {
        displayName: updates.displayName
      });
    }

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente'
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error al actualizar perfil'
    });
  }
});

// Send password reset email
router.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Generate password reset link
    const link = await admin.auth().generatePasswordResetLink(email);

    // In a real application, you would send this link via email
    // For now, we'll just return success
    res.json({
      success: true,
      message: 'Email de recuperación enviado',
      // Don't return the actual link in production
      ...(process.env.NODE_ENV === 'development' && { resetLink: link })
    });

  } catch (error) {
    console.error('Error sending password reset:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error al enviar email de recuperación'
    });
  }
});

// Delete user account
router.delete('/account', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de autorización requerido'
      });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Delete user from Firebase Auth
    await admin.auth().deleteUser(decodedToken.uid);

    // Delete user document from Firestore
    await db.collection('users').doc(decodedToken.uid).delete();

    res.json({
      success: true,
      message: 'Cuenta eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error al eliminar cuenta'
    });
  }
});

module.exports = router;

