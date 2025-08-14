#!/usr/bin/env node

const { Client } = require('pg');
require('dotenv').config();

const initDatabase = async () => {
  // Conectar a PostgreSQL como superusuario para crear la base de datos
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'password123',
    database: 'postgres' // Conectar a la base de datos por defecto
  });

  try {
    console.log('🔌 Conectando a PostgreSQL...');
    await client.connect();
    console.log('✅ Conectado a PostgreSQL');

    // Verificar si la base de datos existe
    const dbExists = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME || 'control_acc_DB']
    );

    if (dbExists.rows.length === 0) {
      console.log('📊 Creando base de datos...');
      await client.query(`CREATE DATABASE "${process.env.DB_NAME || 'control_acc_DB'}"`);
      console.log('✅ Base de datos creada exitosamente');
    } else {
      console.log('ℹ️  La base de datos ya existe');
    }

    // Cerrar conexión
    await client.end();
    console.log('🔌 Conexión cerrada');

    // Ahora conectar a la base de datos específica para ejecutar el schema
    const dbClient = new Client({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'admin',
      password: process.env.DB_PASSWORD || 'password123',
      database: process.env.DB_NAME || 'control_acc_DB'
    });

    console.log('🔌 Conectando a la base de datos específica...');
    await dbClient.connect();
    console.log('✅ Conectado a la base de datos específica');

    // Leer y ejecutar el schema SQL
    const fs = require('fs');
    const path = require('path');
    const schemaPath = path.join(__dirname, 'schema.sql');
    
    if (fs.existsSync(schemaPath)) {
      console.log('📖 Leyendo archivo schema.sql...');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      
      // Dividir el schema en comandos individuales
      const commands = schema
        .split(';')
        .map(cmd => cmd.trim())
        .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

      console.log(`🔄 Ejecutando ${commands.length} comandos SQL...`);
      
      for (let i = 0; i < commands.length; i++) {
        const command = commands[i];
        if (command.trim()) {
          try {
            await dbClient.query(command);
            console.log(`✅ Comando ${i + 1} ejecutado`);
          } catch (error) {
            if (!error.message.includes('already exists') && !error.message.includes('does not exist')) {
              console.error(`❌ Error en comando ${i + 1}:`, error.message);
            }
          }
        }
      }
      
      console.log('✅ Schema ejecutado exitosamente');
    } else {
      console.error('❌ Archivo schema.sql no encontrado');
    }

    await dbClient.end();
    console.log('🔌 Conexión cerrada');
    console.log('🎉 Base de datos inicializada correctamente');

  } catch (error) {
    console.error('❌ Error inicializando la base de datos:', error);
    process.exit(1);
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  initDatabase();
}

module.exports = { initDatabase };





