const { Residente } = require('../models');

const agregarResidentesAdicionales = async () => {
  try {
    console.log('🏠 Agregando 5 residentes adicionales...');

    const nuevosResidentes = [
      {
        nombre: 'Laura Patricia',
        apellido_paterno: 'Hernández',
        apellido_materno: 'Morales',
        documento: '22334455',
        tipo_documento: 'DNI',
        email: 'laura.hernandez@email.com',
        telefono: '999333222',
        departamento: '601',
        piso: '6',
        tipo_residente: 'propietario',
        fecha_nacimiento: '1987-12-03',
        ocupacion: 'Diseñadora Gráfica',
        empresa: 'Creative Studio',
        vehiculo: true,
        placa: 'GHI-789',
        marca: 'Hyundai',
        modelo: 'Tucson',
        color: 'Negro',
        fecha_registro: '2024-05-10',
        estado: 'activo',
        observaciones: 'Diseñadora freelance, trabaja desde casa'
      },
      {
        nombre: 'Miguel Ángel',
        apellido_paterno: 'Silva',
        apellido_materno: 'Rojas',
        documento: '33445566',
        tipo_documento: 'DNI',
        email: 'miguel.silva@email.com',
        telefono: '999222111',
        departamento: '702',
        piso: '7',
        tipo_residente: 'inquilino',
        fecha_nacimiento: '1993-06-18',
        ocupacion: 'Desarrollador Web',
        empresa: 'Tech Solutions',
        vehiculo: false,
        fecha_registro: '2024-06-15',
        estado: 'activo',
        observaciones: 'Desarrollador full-stack, contrato por 1 año'
      },
      {
        nombre: 'Carmen Elena',
        apellido_paterno: 'Vargas',
        apellido_materno: 'Castro',
        documento: '44556677',
        tipo_documento: 'DNI',
        email: 'carmen.vargas@email.com',
        telefono: '999111000',
        departamento: '803',
        piso: '8',
        tipo_residente: 'propietario',
        fecha_nacimiento: '1982-09-25',
        ocupacion: 'Contadora',
        empresa: 'Contabilidad Vargas',
        vehiculo: true,
        placa: 'JKL-012',
        marca: 'Ford',
        modelo: 'Escape',
        color: 'Plata',
        fecha_registro: '2024-03-20',
        estado: 'activo',
        observaciones: 'Contadora independiente, oficina en el departamento'
      },
      {
        nombre: 'Diego Fernando',
        apellido_paterno: 'Mendoza',
        apellido_materno: 'Paredes',
        documento: '55667788',
        tipo_documento: 'DNI',
        email: 'diego.mendoza@email.com',
        telefono: '999000999',
        departamento: '904',
        piso: '9',
        tipo_residente: 'familiar',
        fecha_nacimiento: '1998-02-14',
        ocupacion: 'Estudiante',
        empresa: 'Universidad de Lima',
        vehiculo: false,
        fecha_registro: '2024-07-01',
        estado: 'activo',
        observaciones: 'Estudiante de medicina, hijo de propietarios'
      },
      {
        nombre: 'Sofía Isabel',
        apellido_paterno: 'Ramírez',
        apellido_materno: 'Torres',
        documento: '66778899',
        tipo_documento: 'DNI',
        email: 'sofia.ramirez@email.com',
        telefono: '999888777',
        departamento: '1005',
        piso: '10',
        tipo_residente: 'propietario',
        fecha_nacimiento: '1990-11-08',
        ocupacion: 'Médica',
        empresa: 'Clínica San José',
        vehiculo: true,
        placa: 'MNO-345',
        marca: 'Toyota',
        modelo: 'RAV4',
        color: 'Azul',
        fecha_registro: '2024-04-12',
        estado: 'activo',
        observaciones: 'Médica especialista en pediatría, horarios rotativos'
      }
    ];

    // Verificar si los documentos ya existen
    for (const residente of nuevosResidentes) {
      const existe = await Residente.findOne({
        where: { documento: residente.documento }
      });
      
      if (existe) {
        console.log(`⚠️ Residente con documento ${residente.documento} ya existe, saltando...`);
        continue;
      }

      await Residente.create(residente);
      console.log(`✅ Residente ${residente.nombre} ${residente.apellido_paterno} creado exitosamente`);
    }

    console.log('🎉 Proceso de agregar residentes completado');
    
    // Mostrar estadísticas actualizadas
    const totalResidentes = await Residente.count();
    const propietarios = await Residente.count({ where: { tipo_residente: 'propietario' } });
    const inquilinos = await Residente.count({ where: { tipo_residente: 'inquilino' } });
    const familiares = await Residente.count({ where: { tipo_residente: 'familiar' } });
    
    console.log('\n📊 Estadísticas actualizadas:');
    console.log(`   Total de residentes: ${totalResidentes}`);
    console.log(`   Propietarios: ${propietarios}`);
    console.log(`   Inquilinos: ${inquilinos}`);
    console.log(`   Familiares: ${familiares}`);

  } catch (error) {
    console.error('❌ Error al agregar residentes:', error);
  }
};

// Ejecutar el script si se llama directamente
if (require.main === module) {
  const { sequelize } = require('../models');
  
  sequelize.authenticate()
    .then(() => {
      console.log('✅ Conexión a la base de datos establecida');
      return agregarResidentesAdicionales();
    })
    .then(() => {
      console.log('✅ Script completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { agregarResidentesAdicionales };
