#!/usr/bin/env node

const { Client } = require('pg');
require('dotenv').config();

const testDatabase = async () => {
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

    // Probar consultas básicas
    console.log('\n📊 Probando consultas básicas...');

    // Contar roles
    const rolesCount = await client.query('SELECT COUNT(*) FROM roles');
    console.log(`📈 Total de roles: ${rolesCount.rows[0].count}`);

    // Contar perfiles
    const profilesCount = await client.query('SELECT COUNT(*) FROM perfiles');
    console.log(`📈 Total de perfiles: ${profilesCount.rows[0].count}`);

    // Contar usuarios
    const usersCount = await client.query('SELECT COUNT(*) FROM usuarios');
    console.log(`📈 Total de usuarios: ${usersCount.rows[0].count}`);

    // Contar áreas
    const areasCount = await client.query('SELECT COUNT(*) FROM areas');
    console.log(`📈 Total de áreas: ${areasCount.rows[0].count}`);

    // Contar dispositivos
    const devicesCount = await client.query('SELECT COUNT(*) FROM dispositivos');
    console.log(`📈 Total de dispositivos: ${devicesCount.rows[0].count}`);

    // Mostrar roles disponibles
    console.log('\n🎭 Roles disponibles:');
    const roles = await client.query('SELECT id, nombre, nivel_acceso, color FROM roles ORDER BY nivel_acceso DESC');
    roles.rows.forEach(rol => {
      console.log(`  ${rol.id}. ${rol.nombre} (Nivel: ${rol.nivel_acceso}) - Color: ${rol.color}`);
    });

    // Mostrar perfiles disponibles
    console.log('\n👤 Perfiles disponibles:');
    const profiles = await client.query('SELECT id, nombre, nivel_seguridad, color FROM perfiles ORDER BY nivel_seguridad DESC');
    profiles.rows.forEach(perfil => {
      console.log(`  ${perfil.id}. ${perfil.nombre} (Seguridad: ${perfil.nivel_seguridad}) - Color: ${perfil.color}`);
    });

    // Mostrar usuarios con información completa
    console.log('\n👥 Usuarios registrados:');
    const users = await client.query(`
      SELECT 
        u.id, 
        u.nombre, 
        u.apellido, 
        u.username, 
        u.email, 
        u.estado,
        r.nombre as rol_nombre,
        p.nombre as perfil_nombre
      FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
      JOIN perfiles p ON u.perfil_id = p.id
      ORDER BY u.id
    `);
    
    if (users.rows.length === 0) {
      console.log('  No hay usuarios registrados');
    } else {
      users.rows.forEach(user => {
        console.log(`  ${user.id}. ${user.nombre} ${user.apellido} (@${user.username}) - ${user.estado}`);
        console.log(`     Rol: ${user.rol_nombre} | Perfil: ${user.perfil_nombre}`);
      });
    }

    // Mostrar áreas disponibles
    console.log('\n🏢 Áreas disponibles:');
    const areas = await client.query('SELECT id, nombre, ubicacion, nivel_acceso FROM areas ORDER BY nivel_acceso');
    areas.rows.forEach(area => {
      console.log(`  ${area.id}. ${area.nombre} - ${area.ubicacion} (Nivel: ${area.nivel_acceso})`);
    });

    // Mostrar dispositivos disponibles
    console.log('\n💻 Dispositivos disponibles:');
    const devices = await client.query(`
      SELECT 
        d.id, 
        d.nombre, 
        d.tipo, 
        d.modelo, 
        d.ubicacion,
        a.nombre as area_nombre
      FROM dispositivos d
      LEFT JOIN areas a ON d.area_id = a.id
      ORDER BY d.id
    `);
    devices.rows.forEach(device => {
      console.log(`  ${device.id}. ${device.nombre} (${device.tipo}) - ${device.modelo}`);
      console.log(`     Ubicación: ${device.ubicacion} | Área: ${device.area_nombre || 'N/A'}`);
    });

    // Probar vista de usuarios completos
    console.log('\n🔍 Probando vista de usuarios completos...');
    const usersComplete = await client.query('SELECT * FROM v_usuarios_completos LIMIT 3');
    console.log(`✅ Vista funcionando - ${usersComplete.rows.length} usuarios mostrados`);

    // Probar función de estadísticas
    console.log('\n📈 Probando función de estadísticas...');
    const stats = await client.query('SELECT * FROM get_users_by_role_stats()');
    console.log('✅ Función de estadísticas funcionando:');
    stats.rows.forEach(stat => {
      console.log(`  ${stat.rol_nombre}: ${stat.total_usuarios} total, ${stat.usuarios_activos} activos, ${stat.usuarios_inactivos} inactivos`);
    });

    console.log('\n🎉 Todas las pruebas completadas exitosamente!');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
  } finally {
    await client.end();
    console.log('🔌 Conexión cerrada');
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  testDatabase();
}

module.exports = { testDatabase };





