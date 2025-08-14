#!/usr/bin/env node

const { Client } = require('pg');
const { execSync } = require('child_process');
require('dotenv').config();

const setupPostgreSQL = async () => {
  console.log('🚀 Configurando PostgreSQL para ControlAcceso...\n');

  try {
    // Intentar conectar como superusuario (postgres)
    console.log('🔌 Intentando conectar como superusuario...');
    
    let client;
    try {
      // Primero intentar conectar a la base de datos postgres
      client = new Client({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        user: 'postgres',
        password: '', // Sin contraseña por defecto
        database: 'postgres'
      });
      
      await client.connect();
      console.log('✅ Conectado como superusuario postgres');
    } catch (error) {
      console.log('⚠️  No se pudo conectar como postgres, intentando con psql...');
      
      // Intentar crear usuario y base de datos usando psql
      try {
        // Crear usuario admin
        console.log('👤 Creando usuario admin...');
        execSync('psql -h localhost -U postgres -c "CREATE USER admin WITH PASSWORD \'password123\';"', { stdio: 'inherit' });
        console.log('✅ Usuario admin creado');
        
        // Crear base de datos
        console.log('📊 Creando base de datos control_acc_DB...');
        execSync('psql -h localhost -U postgres -c "CREATE DATABASE control_acc_DB OWNER admin;"', { stdio: 'inherit' });
        console.log('✅ Base de datos control_acc_DB creada');
        
        // Conceder privilegios
        console.log('🔑 Concediendo privilegios...');
        execSync('psql -h localhost -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE control_acc_DB TO admin;"', { stdio: 'inherit' });
        console.log('✅ Privilegios concedidos');
        
        return true;
      } catch (psqlError) {
        console.error('❌ Error usando psql:', psqlError.message);
        console.log('\n💡 Alternativas para configurar PostgreSQL:');
        console.log('1. Instalar PostgreSQL desde: https://www.postgresql.org/download/');
        console.log('2. Usar Docker: docker run --name postgres -e POSTGRES_PASSWORD=password123 -d postgres');
        console.log('3. Configurar manualmente el usuario y base de datos');
        return false;
      }
    }

    if (client) {
      try {
        // Verificar si el usuario admin ya existe
        const userExists = await client.query(
          "SELECT 1 FROM pg_roles WHERE rolname = 'admin'"
        );

        if (userExists.rows.length === 0) {
          console.log('👤 Creando usuario admin...');
          await client.query("CREATE USER admin WITH PASSWORD 'password123'");
          console.log('✅ Usuario admin creado');
        } else {
          console.log('ℹ️  Usuario admin ya existe');
        }

        // Verificar si la base de datos ya existe
        const dbExists = await client.query(
          "SELECT 1 FROM pg_database WHERE datname = 'control_acc_DB'"
        );

        if (dbExists.rows.length === 0) {
          console.log('📊 Creando base de datos control_acc_DB...');
          await client.query('CREATE DATABASE "control_acc_DB" OWNER admin');
          console.log('✅ Base de datos control_acc_DB creada');
        } else {
          console.log('ℹ️  Base de datos control_acc_DB ya existe');
        }

        // Conceder privilegios
        console.log('🔑 Concediendo privilegios...');
        await client.query('GRANT ALL PRIVILEGES ON DATABASE "control_acc_DB" TO admin');
        console.log('✅ Privilegios concedidos');

        await client.end();
        return true;

      } catch (error) {
        console.error('❌ Error configurando PostgreSQL:', error.message);
        await client.end();
        return false;
      }
    }

  } catch (error) {
    console.error('❌ Error general:', error.message);
    return false;
  }
};

// Función para verificar la conexión
const testConnection = async () => {
  console.log('\n🔍 Verificando conexión...');
  
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'password123',
    database: process.env.DB_NAME || 'control_acc_DB'
  });

  try {
    await client.connect();
    console.log('✅ Conexión exitosa a la base de datos');
    await client.end();
    return true;
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    return false;
  }
};

// Función principal
const main = async () => {
  console.log('🚪 ControlAcceso - Configuración de Base de Datos\n');
  
  const setupSuccess = await setupPostgreSQL();
  
  if (setupSuccess) {
    console.log('\n🎉 Configuración completada exitosamente!');
    
    const connectionSuccess = await testConnection();
    if (connectionSuccess) {
      console.log('\n✅ Ahora puedes ejecutar: npm run init');
      console.log('   Para inicializar las tablas y datos del sistema');
    }
  } else {
    console.log('\n❌ La configuración no se pudo completar');
    console.log('   Revisa los errores anteriores y configura PostgreSQL manualmente');
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

module.exports = { setupPostgreSQL, testConnection };





