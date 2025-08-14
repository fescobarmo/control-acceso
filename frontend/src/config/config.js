// Configuración de la aplicación
const config = {
  // API Configuration
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  
  // App Configuration
  APP_NAME: 'ControlAcceso',
  APP_VERSION: '1.0.0',
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
};

// Debug de configuración
if (config.IS_DEVELOPMENT) {
  console.log('🔧 Configuración de la aplicación:');
  console.log('📊 API_BASE_URL:', config.API_BASE_URL);
  console.log('🌍 NODE_ENV:', config.NODE_ENV);
  console.log('🔍 Variables de entorno disponibles:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')));
}

export default config;





