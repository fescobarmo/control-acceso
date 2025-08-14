const { Role, Profile, User } = require('../models');
const bcrypt = require('bcryptjs');
const { seedResidentesData } = require('./residentesData');

const initialData = {
  roles: [
    {
      nombre: 'Super Administrador',
      descripcion: 'Control total del sistema',
      nivel_acceso: 10,
      color: '#d32f2f',
      icono: 'admin_panel_settings'
    },
    {
      nombre: 'Administrador',
      descripcion: 'Administración del sistema',
      nivel_acceso: 8,
      color: '#f57c00',
      icono: 'security'
    },
    {
      nombre: 'Gerente',
      descripcion: 'Gestión de áreas y personal',
      nivel_acceso: 7,
      color: '#7b1fa2',
      icono: 'supervisor_account'
    },
    {
      nombre: 'Supervisor',
      descripcion: 'Supervisión de áreas',
      nivel_acceso: 6,
      color: '#1976d2',
      icono: 'manage_accounts'
    },
    {
      nombre: 'Coordinador',
      descripcion: 'Coordinación de actividades',
      nivel_acceso: 5,
      color: '#388e3c',
      icono: 'group'
    },
    {
      nombre: 'Usuario Avanzado',
      descripcion: 'Acceso extendido',
      nivel_acceso: 4,
      color: '#ff9800',
      icono: 'person_add'
    },
    {
      nombre: 'Usuario Estándar',
      descripcion: 'Acceso básico',
      nivel_acceso: 3,
      color: '#2196f3',
      icono: 'person'
    },
    {
      nombre: 'Usuario Limitado',
      descripcion: 'Acceso restringido',
      nivel_acceso: 2,
      color: '#9e9e9e',
      icono: 'person_outline'
    },
    {
      nombre: 'Invitado',
      descripcion: 'Acceso temporal',
      nivel_acceso: 1,
      color: '#757575',
      icono: 'person_off'
    },
    {
      nombre: 'Auditor',
      descripcion: 'Solo lectura',
      nivel_acceso: 2,
      color: '#607d8b',
      icono: 'assessment'
    }
  ],
  profiles: [
    {
      nombre: 'Super Administrador del Sistema',
      descripcion: 'Control total del sistema',
      permisos: { all: true, system: true, users: true, areas: true, devices: true, reports: true },
      nivel_seguridad: 5,
      color: '#d32f2f',
      icono: 'admin_panel_settings'
    },
    {
      nombre: 'Administrador del Sistema',
      descripcion: 'Administración completa',
      permisos: { users: true, areas: true, devices: true, reports: true, settings: true },
      nivel_seguridad: 4,
      color: '#f57c00',
      icono: 'security'
    },
    {
      nombre: 'Gerente de Seguridad',
      descripcion: 'Gestión de seguridad',
      permisos: { users: { read: true, write: true }, areas: true, reports: true },
      nivel_seguridad: 4,
      color: '#7b1fa2',
      icono: 'supervisor_account'
    },
    {
      nombre: 'Supervisor de Área',
      descripcion: 'Supervisión de áreas',
      permisos: { users: { read: true }, areas: { read: true, write: true }, reports: { read: true } },
      nivel_seguridad: 3,
      color: '#1976d2',
      icono: 'manage_accounts'
    },
    {
      nombre: 'Coordinador de Accesos',
      descripcion: 'Coordinación de accesos',
      permisos: { users: { read: true }, areas: { read: true }, access_control: true },
      nivel_seguridad: 3,
      color: '#388e3c',
      icono: 'group'
    },
    {
      nombre: 'Usuario Avanzado',
      descripcion: 'Acceso extendido',
      permisos: { areas: { read: true, write: true }, profile: true, reports: { read: true } },
      nivel_seguridad: 2,
      color: '#ff9800',
      icono: 'person_add'
    },
    {
      nombre: 'Usuario Estándar',
      descripcion: 'Acceso básico',
      permisos: { areas: { read: true }, profile: { read: true, write: true } },
      nivel_seguridad: 2,
      color: '#2196f3',
      icono: 'person'
    },
    {
      nombre: 'Usuario Limitado',
      descripcion: 'Acceso restringido',
      permisos: { areas: { read: true }, profile: { read: true } },
      nivel_seguridad: 1,
      color: '#9e9e9e',
      icono: 'person_outline'
    },
    {
      nombre: 'Invitado Temporal',
      descripcion: 'Acceso temporal',
      permisos: { areas: { read: true, temporary: true }, profile: { read: true } },
      nivel_seguridad: 1,
      color: '#757575',
      icono: 'person_off'
    },
    {
      nombre: 'Auditor del Sistema',
      descripcion: 'Solo lectura',
      permisos: { reports: { read: true }, logs: { read: true }, audit: true },
      nivel_seguridad: 2,
      color: '#607d8b',
      icono: 'assessment'
    }
  ]
};

const seedInitialData = async () => {
  try {
    console.log('🌱 Iniciando carga de datos iniciales...');

    // Crear roles
    console.log('🎭 Creando roles...');
    for (const roleData of initialData.roles) {
      await Role.findOrCreate({
        where: { nombre: roleData.nombre },
        defaults: roleData
      });
    }
    console.log(`✅ ${initialData.roles.length} roles creados/verificados`);

    // Crear perfiles
    console.log('👤 Creando perfiles...');
    for (const profileData of initialData.profiles) {
      await Profile.findOrCreate({
        where: { nombre: profileData.nombre },
        defaults: profileData
      });
    }
    console.log(`✅ ${initialData.profiles.length} perfiles creados/verificados`);

    // Crear usuario administrador
    console.log('👨‍💼 Creando usuario administrador...');
    const adminRole = await Role.findOne({ where: { nombre: 'Administrador' } });
    const adminProfile = await Profile.findOne({ where: { nombre: 'Administrador del Sistema' } });
    
    if (adminRole && adminProfile) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await User.findOrCreate({
        where: { username: 'admin' },
        defaults: {
          nombre: 'Administrador',
          apellido: 'Sistema',
          email: 'admin@controlacceso.com',
          username: 'admin',
          password_hash: hashedPassword,
          rol_id: adminRole.id,
          perfil_id: adminProfile.id,
          estado: 'activo',
          is_active: true
        }
      });
      console.log('✅ Usuario administrador creado/verificado');
    } else {
      console.log('⚠️ No se pudo crear usuario administrador: rol o perfil no encontrado');
    }

    // Crear datos de residentes
    console.log('🏠 Creando datos de residentes...');
    await seedResidentesData();

    console.log('🎉 Datos iniciales cargados exitosamente');
  } catch (error) {
    console.error('❌ Error cargando datos iniciales:', error);
    throw error;
  }
};

module.exports = { seedInitialData, initialData };
