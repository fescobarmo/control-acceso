const admin = require('firebase-admin');
const { Client } = require('pg');
require('dotenv').config();

// Initialize Firebase Admin SDK
// Make sure to set GOOGLE_APPLICATION_CREDENTIALS environment variable
// or provide the service account key
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  // Or use service account key:
  // credential: admin.credential.cert(require('./path-to-service-account-key.json'))
});

const db = admin.firestore();

// PostgreSQL connection
const pgClient = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'controlacceso',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'password123',
});

async function migrateUsers() {
  console.log('🔄 Migrando usuarios...');
  
  try {
    const result = await pgClient.query('SELECT * FROM "User"');
    const users = result.rows;
    
    const batch = db.batch();
    
    for (const user of users) {
      const userRef = db.collection('users').doc(user.id.toString());
      
      // Create Firebase Auth user
      try {
        await admin.auth().createUser({
          uid: user.id.toString(),
          email: user.email,
          displayName: user.username,
          password: 'TemporaryPassword123!', // Users will need to reset password
          disabled: !user.activo
        });
        
        console.log(`✅ Created auth user: ${user.email}`);
      } catch (authError) {
        if (authError.code === 'auth/uid-already-exists') {
          console.log(`⚠️ User already exists: ${user.email}`);
        } else {
          console.error(`❌ Error creating auth user ${user.email}:`, authError.message);
        }
      }
      
      // Create Firestore document
      batch.set(userRef, {
        email: user.email,
        username: user.username,
        displayName: user.username,
        role: user.role || 'user',
        activo: user.activo || true,
        createdAt: user.created_at ? admin.firestore.Timestamp.fromDate(new Date(user.created_at)) : admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: user.updated_at ? admin.firestore.Timestamp.fromDate(new Date(user.updated_at)) : admin.firestore.FieldValue.serverTimestamp(),
        // Migrate other fields as needed
        ...Object.keys(user).reduce((acc, key) => {
          if (!['id', 'email', 'username', 'role', 'activo', 'created_at', 'updated_at'].includes(key)) {
            acc[key] = user[key];
          }
          return acc;
        }, {})
      });
    }
    
    await batch.commit();
    console.log(`✅ Migrated ${users.length} users to Firestore`);
    
  } catch (error) {
    console.error('❌ Error migrating users:', error);
  }
}

async function migrateResidentes() {
  console.log('🔄 Migrando residentes...');
  
  try {
    const result = await pgClient.query('SELECT * FROM "Residente"');
    const residentes = result.rows;
    
    const batch = db.batch();
    
    for (const residente of residentes) {
      const residenteRef = db.collection('residentes').doc(residente.id.toString());
      
      batch.set(residenteRef, {
        nombre: residente.nombre,
        email: residente.email,
        telefono: residente.telefono,
        unidad: residente.unidad,
        documento: residente.documento,
        tipoDocumento: residente.tipo_documento,
        activo: residente.activo || true,
        createdAt: residente.created_at ? admin.firestore.Timestamp.fromDate(new Date(residente.created_at)) : admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: residente.updated_at ? admin.firestore.Timestamp.fromDate(new Date(residente.updated_at)) : admin.firestore.FieldValue.serverTimestamp(),
        // Migrate other fields
        ...Object.keys(residente).reduce((acc, key) => {
          if (!['id', 'nombre', 'email', 'telefono', 'unidad', 'documento', 'tipo_documento', 'activo', 'created_at', 'updated_at'].includes(key)) {
            acc[key] = residente[key];
          }
          return acc;
        }, {})
      });
    }
    
    await batch.commit();
    console.log(`✅ Migrated ${residentes.length} residentes to Firestore`);
    
  } catch (error) {
    console.error('❌ Error migrating residentes:', error);
  }
}

async function migrateVisitas() {
  console.log('🔄 Migrando visitas...');
  
  try {
    const result = await pgClient.query('SELECT * FROM "Visita"');
    const visitas = result.rows;
    
    const batchSize = 500; // Firestore batch limit
    
    for (let i = 0; i < visitas.length; i += batchSize) {
      const batch = db.batch();
      const batchVisitas = visitas.slice(i, i + batchSize);
      
      for (const visita of batchVisitas) {
        const visitaRef = db.collection('visitas').doc(visita.id.toString());
        
        batch.set(visitaRef, {
          residenteId: visita.residente_id?.toString(),
          nombreVisita: visita.nombre_visita,
          documentoVisita: visita.documento_visita,
          telefonoVisita: visita.telefono_visita,
          fechaHora: visita.fecha_hora ? admin.firestore.Timestamp.fromDate(new Date(visita.fecha_hora)) : null,
          estado: visita.estado || 'pendiente',
          observaciones: visita.observaciones,
          createdAt: visita.created_at ? admin.firestore.Timestamp.fromDate(new Date(visita.created_at)) : admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: visita.updated_at ? admin.firestore.Timestamp.fromDate(new Date(visita.updated_at)) : admin.firestore.FieldValue.serverTimestamp(),
          // Migrate other fields
          ...Object.keys(visita).reduce((acc, key) => {
            if (!['id', 'residente_id', 'nombre_visita', 'documento_visita', 'telefono_visita', 'fecha_hora', 'estado', 'observaciones', 'created_at', 'updated_at'].includes(key)) {
              acc[key] = visita[key];
            }
            return acc;
          }, {})
        });
      }
      
      await batch.commit();
      console.log(`✅ Migrated batch ${Math.floor(i/batchSize) + 1} of visitas (${batchVisitas.length} records)`);
    }
    
    console.log(`✅ Migrated ${visitas.length} visitas to Firestore`);
    
  } catch (error) {
    console.error('❌ Error migrating visitas:', error);
  }
}

async function migrateVisitasExternas() {
  console.log('🔄 Migrando visitas externas...');
  
  try {
    const result = await pgClient.query('SELECT * FROM "VisitaExterna"');
    const visitasExternas = result.rows;
    
    const batchSize = 500;
    
    for (let i = 0; i < visitasExternas.length; i += batchSize) {
      const batch = db.batch();
      const batchVisitas = visitasExternas.slice(i, i + batchSize);
      
      for (const visitaExterna of batchVisitas) {
        const visitaRef = db.collection('visitasExternas').doc(visitaExterna.id.toString());
        
        batch.set(visitaRef, {
          nombreVisita: visitaExterna.nombre_visita,
          documento: visitaExterna.documento,
          telefono: visitaExterna.telefono,
          empresa: visitaExterna.empresa,
          motivo: visitaExterna.motivo,
          fechaHora: visitaExterna.fecha_hora ? admin.firestore.Timestamp.fromDate(new Date(visitaExterna.fecha_hora)) : null,
          estado: visitaExterna.estado || 'pendiente',
          observaciones: visitaExterna.observaciones,
          createdAt: visitaExterna.created_at ? admin.firestore.Timestamp.fromDate(new Date(visitaExterna.created_at)) : admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: visitaExterna.updated_at ? admin.firestore.Timestamp.fromDate(new Date(visitaExterna.updated_at)) : admin.firestore.FieldValue.serverTimestamp(),
          // Migrate other fields
          ...Object.keys(visitaExterna).reduce((acc, key) => {
            if (!['id', 'nombre_visita', 'documento', 'telefono', 'empresa', 'motivo', 'fecha_hora', 'estado', 'observaciones', 'created_at', 'updated_at'].includes(key)) {
              acc[key] = visitaExterna[key];
            }
            return acc;
          }, {})
        });
      }
      
      await batch.commit();
      console.log(`✅ Migrated batch ${Math.floor(i/batchSize) + 1} of visitas externas (${batchVisitas.length} records)`);
    }
    
    console.log(`✅ Migrated ${visitasExternas.length} visitas externas to Firestore`);
    
  } catch (error) {
    console.error('❌ Error migrating visitas externas:', error);
  }
}

async function runMigration() {
  try {
    console.log('🚀 Starting migration from PostgreSQL to Firestore...\n');
    
    // Connect to PostgreSQL
    await pgClient.connect();
    console.log('✅ Connected to PostgreSQL\n');
    
    // Run migrations
    await migrateUsers();
    console.log('');
    
    await migrateResidentes();
    console.log('');
    
    await migrateVisitas();
    console.log('');
    
    await migrateVisitasExternas();
    console.log('');
    
    console.log('🎉 Migration completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Verify data in Firebase Console');
    console.log('2. Test the application with migrated data');
    console.log('3. Update users about password reset requirement');
    console.log('4. Update deployment configuration');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await pgClient.end();
    console.log('\n🔌 PostgreSQL connection closed');
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  runMigration();
}

module.exports = {
  migrateUsers,
  migrateResidentes,
  migrateVisitas,
  migrateVisitasExternas,
  runMigration
};

