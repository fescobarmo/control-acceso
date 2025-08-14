#!/usr/bin/env node

const { Client } = require('pg');
require('dotenv').config();

const initSimpleDatabase = async () => {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'password123',
    database: process.env.DB_NAME || 'control_acc_DB'
  });

  try {
    console.log('🔌 Conectando a la base de datos...');
    await client.connect();
    console.log('✅ Conectado a la base de datos');

    // Leer y ejecutar el schema simplificado
    const fs = require('fs');
    const path = require('path');
    const schemaPath = path.join(__dirname, 'simple-schema.sql');
    
    if (fs.existsSync(schemaPath)) {
      console.log('📖 Leyendo archivo simple-schema.sql...');
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
            await client.query(command);
            console.log(`✅ Comando ${i + 1} ejecutado`);
          } catch (error) {
            if (!error.message.includes('already exists') && !error.message.includes('does not exist')) {
              console.error(`❌ Error en comando ${i + 1}:`, error.message);
            }
          }
        }
      }
      
      console.log('✅ Schema simplificado ejecutado exitosamente');
    } else {
      console.error('❌ Archivo simple-schema.sql no encontrado');
    }

    // Verificar que las tablas se crearon
    console.log('\n🔍 Verificando tablas creadas...');
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('📊 Tablas creadas:');
    tables.rows.forEach(table => {
      console.log(`  - ${table.table_name}`);
    });

    // Verificar datos en roles
    console.log('\n🎭 Verificando roles...');
    const roles = await client.query('SELECT COUNT(*) FROM roles');
    console.log(`  Total de roles: ${roles.rows[0].count}`);

    // Verificar datos en perfiles
    console.log('\n👤 Verificando perfiles...');
    const perfiles = await client.query('SELECT COUNT(*) FROM perfiles');
    console.log(`  Total de perfiles: ${perfiles.rows[0].count}`);

    // Verificar datos en usuarios
    console.log('\n👥 Verificando usuarios...');
    const usuarios = await client.query('SELECT COUNT(*) FROM usuarios');
    console.log(`  Total de usuarios: ${usuarios.rows[0].count}`);

    // Verificar datos en áreas
    console.log('\n🏢 Verificando áreas...');
    const areas = await client.query('SELECT COUNT(*) FROM areas');
    console.log(`  Total de áreas: ${areas.rows[0].count}`);

    // Verificar datos en dispositivos
    console.log('\n💻 Verificando dispositivos...');
    const dispositivos = await client.query('SELECT COUNT(*) FROM dispositivos');
    console.log(`  Total de dispositivos: ${dispositivos.rows[0].count}`);

    await client.end();
    console.log('🔌 Conexión cerrada');
    console.log('🎉 Base de datos simplificada inicializada correctamente');

  } catch (error) {
    console.error('❌ Error inicializando la base de datos:', error);
    process.exit(1);
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  initSimpleDatabase();
}

module.exports = { initSimpleDatabase };





