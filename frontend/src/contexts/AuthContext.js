import React, { createContext, useContext, useState, useEffect } from 'react';
import firebaseAuthService from '../services/firebaseAuth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener usuario actual al cargar la aplicación
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Wait for Firebase auth to initialize
        await firebaseAuthService.waitForAuthInit();
        
        // Set up auth state listener
        const unsubscribe = firebaseAuthService.onAuthStateChange(async (firebaseUser) => {
          if (firebaseUser) {
            // Get user profile data
            const userProfile = await firebaseAuthService.getUserProfile(firebaseUser.uid);
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              ...userProfile
            });
          } else {
            setUser(null);
          }
          setLoading(false);
        });

        // Return cleanup function
        return unsubscribe;
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const getCurrentUser = async () => {
    try {
      const currentUser = firebaseAuthService.getCurrentUser();
      if (currentUser) {
        const userProfile = await firebaseAuthService.getUserProfile(currentUser.uid);
        return {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          ...userProfile
        };
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo usuario actual:', error);
      setError('Error al obtener información del usuario');
      return null;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const user = await firebaseAuthService.signIn(email, password);
      
      return { success: true, user };
    } catch (error) {
      const message = error.message || 'Error en el inicio de sesión';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, userData) => {
    try {
      setError(null);
      setLoading(true);
      
      const user = await firebaseAuthService.createUser(email, password, userData);
      
      return { success: true, user };
    } catch (error) {
      const message = error.message || 'Error en el registro';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await firebaseAuthService.signOut();
    } catch (error) {
      console.error('Error en logout:', error);
      setError('Error al cerrar sesión');
    }
  };

  const updateProfile = async (updates) => {
    try {
      setError(null);
      if (user?.uid) {
        await firebaseAuthService.updateUserProfile(user.uid, updates);
        // Update local state
        setUser(prev => ({ ...prev, ...updates }));
        return { success: true };
      }
      return { success: false, message: 'No hay usuario autenticado' };
    } catch (error) {
      const message = error.message || 'Error al actualizar perfil';
      setError(message);
      return { success: false, message };
    }
  };

  const resetPassword = async (email) => {
    try {
      setError(null);
      await firebaseAuthService.sendPasswordReset(email);
      return { success: true };
    } catch (error) {
      const message = error.message || 'Error al enviar email de recuperación';
      setError(message);
      return { success: false, message };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      await firebaseAuthService.updatePassword(currentPassword, newPassword);
      return { success: true };
    } catch (error) {
      const message = error.message || 'Error al cambiar contraseña';
      setError(message);
      return { success: false, message };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    getCurrentUser,
    updateProfile,
    resetPassword,
    changePassword,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
