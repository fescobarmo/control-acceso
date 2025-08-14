const { Residente } = require('../models');

const seedResidentesData = async () => {
  try {
    // Verificar si ya existen residentes
    const existingResidentes = await Residente.count();
    if (existingResidentes > 0) {
      console.log('✅ Datos de residentes ya existen, saltando...');
      return;
    }

    const residentesData = [
      {
        nombre: 'Juan Carlos',
        apellido_paterno: 'García',
        apellido_materno: 'López',
        documento: '12345678',
        tipo_documento: 'DNI',
        email: 'juan.garcia@email.com',
        telefono: '999888777',
        departamento: '101',
        piso: '1',
        tipo_residente: 'propietario',
        fecha_nacimiento: '1985-03-15',
        ocupacion: 'Ingeniero',
        empresa: 'TechCorp',
        vehiculo: true,
        placa: 'ABC-123',
        marca: 'Toyota',
        modelo: 'Corolla',
        color: 'Blanco',
        fecha_registro: '2024-01-15',
        estado: 'activo',
        observaciones: 'Propietario original del departamento'
      },
      {
        nombre: 'María Elena',
        apellido_paterno: 'Rodríguez',
        apellido_materno: 'Martínez',
        documento: '87654321',
        tipo_documento: 'DNI',
        email: 'maria.rodriguez@email.com',
        telefono: '999777666',
        departamento: '205',
        piso: '2',
        tipo_residente: 'propietario',
        fecha_nacimiento: '1990-07-22',
        ocupacion: 'Médica',
        empresa: 'Hospital Central',
        vehiculo: true,
        placa: 'XYZ-789',
        marca: 'Honda',
        modelo: 'Civic',
        color: 'Azul',
        fecha_registro: '2024-02-10',
        estado: 'activo',
        observaciones: 'Médica especialista en cardiología'
      },
      {
        nombre: 'Carlos Alberto',
        apellido_paterno: 'Fernández',
        apellido_materno: 'González',
        documento: '11223344',
        tipo_documento: 'DNI',
        email: 'carlos.fernandez@email.com',
        telefono: '999666555',
        departamento: '301',
        piso: '3',
        tipo_residente: 'inquilino',
        fecha_nacimiento: '1988-11-08',
        ocupacion: 'Abogado',
        empresa: 'Estudio Legal Fernández',
        vehiculo: false,
        fecha_registro: '2024-03-05',
        estado: 'activo',
        observaciones: 'Inquilino con contrato por 2 años'
      },
      {
        nombre: 'Ana Patricia',
        apellido_paterno: 'Sánchez',
        apellido_materno: 'Díaz',
        documento: '55667788',
        tipo_documento: 'DNI',
        email: 'ana.sanchez@email.com',
        telefono: '999555444',
        departamento: '402',
        piso: '4',
        tipo_residente: 'propietario',
        fecha_nacimiento: '1992-04-12',
        ocupacion: 'Arquitecta',
        empresa: 'Arquitectura Moderna',
        vehiculo: true,
        placa: 'DEF-456',
        marca: 'Nissan',
        modelo: 'Sentra',
        color: 'Gris',
        fecha_registro: '2024-01-20',
        estado: 'activo',
        observaciones: 'Arquitecta independiente'
      },
      {
        nombre: 'Roberto Luis',
        apellido_paterno: 'Torres',
        apellido_materno: 'Vargas',
        documento: '99887766',
        tipo_documento: 'DNI',
        email: 'roberto.torres@email.com',
        telefono: '999444333',
        departamento: '505',
        piso: '5',
        tipo_residente: 'familiar',
        fecha_nacimiento: '1995-09-30',
        ocupacion: 'Estudiante',
        empresa: 'Universidad Nacional',
        vehiculo: false,
        fecha_registro: '2024-04-01',
        estado: 'activo',
        observaciones: 'Hijo del propietario, estudiante universitario'
      }
    ];

    await Residente.bulkCreate(residentesData);
    console.log('✅ Datos de residentes creados exitosamente');
  } catch (error) {
    console.error('❌ Error al crear datos de residentes:', error);
  }
};

module.exports = { seedResidentesData };
