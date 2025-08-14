import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import axios from 'axios';
import config from '../../config/config';

const TestAPI = () => {
  const [roles, setRoles] = useState([]);
  const [perfiles, setPerfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testAPI = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🧪 Probando API...');
      
      // Probar roles
      console.log('📊 Probando /users/roles...');
      const rolesRes = await api.get('/users/roles');
      console.log('✅ Roles respuesta:', rolesRes.data);
      setRoles(rolesRes.data.data || []);
      
      // Probar perfiles
      console.log('📊 Probando /users/profiles...');
      const perfilesRes = await api.get('/users/profiles');
      console.log('✅ Perfiles respuesta:', perfilesRes.data);
      setPerfiles(perfilesRes.data.data || []);
      
    } catch (error) {
      console.error('❌ Error en la API:', error);
      setError(error.message);
      
      // Si falla, probar con URL hardcodeada
      console.log('🔄 Intentando con URL hardcodeada...');
      try {
        const rolesRes = await axios.get('http://localhost:3001/api/users/roles');
        console.log('✅ Roles respuesta (hardcodeada):', rolesRes.data);
        setRoles(rolesRes.data.data || []);
        
        const perfilesRes = await axios.get('http://localhost:3001/api/users/profiles');
        console.log('✅ Perfiles respuesta (hardcodeada):', perfilesRes.data);
        setPerfiles(perfilesRes.data.data || []);
        
        setError('API funcionó con URL hardcodeada. Problema con variables de entorno.');
      } catch (hardcodeError) {
        console.error('❌ Error también con URL hardcodeada:', hardcodeError);
        setError(`Error con API: ${error.message}. Error con URL hardcodeada: ${hardcodeError.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>🧪 Test de API - ControlAcceso</h2>
      
      <button 
        onClick={testAPI}
        disabled={loading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Probando...' : 'Probar API'}
      </button>
      
      {error && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          border: '1px solid #f5c6cb',
          borderRadius: '5px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <div style={{ marginTop: '20px' }}>
        <h3>📊 Datos Obtenidos:</h3>
        
        <div style={{ marginBottom: '20px' }}>
          <h4>🎭 Roles ({roles.length}):</h4>
          <ul>
            {roles.map(rol => (
              <li key={rol.id}>
                <strong>{rol.nombre}</strong> - Nivel: {rol.nivel_acceso}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4>👤 Perfiles ({perfiles.length}):</h4>
          <ul>
            {perfiles.map(perfil => (
              <li key={perfil.id}>
                <strong>{perfil.nombre}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p><strong>URL Base:</strong> {config.API_BASE_URL}</p>
        <p><strong>Endpoint Roles:</strong> /users/roles</p>
        <p><strong>Endpoint Perfiles:</strong> /users/profiles</p>
        <p><strong>Variables de entorno:</strong> {process.env.REACT_APP_API_URL || 'No definida'}</p>
      </div>
    </div>
  );
};

export default TestAPI;
