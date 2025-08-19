# Guía de Configuración Firebase - ControlAcceso

## 🔥 Configuración Inicial de Firebase

### 1. Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Crear un proyecto"
3. Nombra tu proyecto (ej: `controlacceso-app`)
4. Habilita Google Analytics (opcional)
5. Crea el proyecto

### 2. Configurar Authentication

1. En Firebase Console, ve a **Authentication > Sign-in method**
2. Habilita **Email/Password**
3. Opcionalmente, configura otros proveedores (Google, Facebook, etc.)

### 3. Configurar Firestore Database

1. Ve a **Firestore Database**
2. Crea la base de datos en modo **producción**
3. Selecciona la región más cercana a tus usuarios
4. Las reglas de seguridad se desplegarán automáticamente desde `firestore.rules`

### 4. Configurar Storage

1. Ve a **Storage**
2. Configura Cloud Storage
3. Las reglas se desplegarán desde `storage.rules`

### 5. Obtener Configuración de Firebase

1. Ve a **Configuración del proyecto** (icono de engranaje)
2. Scroll hacia abajo hasta **Tus apps**
3. Haz clic en **</> Web**
4. Registra tu aplicación
5. Copia la configuración de Firebase

## 🔧 Configuración del Proyecto

### 1. Variables de Entorno Frontend

Crea el archivo `frontend/.env.production` con tu configuración:

```bash
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=tu_api_key_aqui
REACT_APP_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=tu_proyecto_id
REACT_APP_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcd1234
REACT_APP_FIREBASE_MEASUREMENT_ID=G-ABCD1234

# API Configuration
REACT_APP_API_URL=https://tu_proyecto-region.cloudfunctions.net/api
REACT_APP_ENV=production
```

### 2. Configuración del Backend

El backend ya está configurado para usar Firebase Admin SDK y Cloud Functions.

### 3. Actualizar firebase.json

Edita `firebase.json` y actualiza la configuración con tu información:

```json
{
  "hosting": {
    "public": "frontend/build",
    "site": "tu-sitio-web"
  },
  "functions": {
    "source": "backend"
  }
}
```

## 🚀 Instalación y Deploy

### 1. Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login en Firebase

```bash
firebase login
```

### 3. Inicializar Firebase (si no está hecho)

```bash
firebase init
```

Selecciona:
- ✅ Firestore
- ✅ Functions
- ✅ Hosting
- ✅ Storage

### 4. Seleccionar Proyecto

```bash
firebase use tu_proyecto_id
```

### 5. Build del Frontend

```bash
cd frontend
npm run build
cd ..
```

### 6. Deploy Completo

```bash
# Deploy todo
firebase deploy

# O deploy individual:
firebase deploy --only hosting     # Solo frontend
firebase deploy --only functions   # Solo backend
firebase deploy --only firestore   # Solo reglas de Firestore
```

## 📊 Migración de Datos

### Desde PostgreSQL a Firestore

Para migrar tus datos existentes, puedes usar el script `migration/migrate-to-firestore.js`:

```bash
cd migration
node migrate-to-firestore.js
```

**Nota**: Asegúrate de configurar las credenciales de admin antes de ejecutar.

### Estructura de Colecciones en Firestore

```
/users/{userId}
  - email, displayName, role, activo, createdAt, updatedAt

/residentes/{residenteId}
  - nombre, email, telefono, unidad, activo, createdAt, updatedAt

/visitas/{visitaId}
  - residenteId, nombreVisita, fechaHora, estado, createdAt

/visitasExternas/{visitaId}
  - nombreVisita, documento, telefono, fechaHora, estado, createdAt

/accessLogs/{logId}
  - userId, action, timestamp, details
```

## 🔐 Seguridad

### Reglas de Firestore

Las reglas están configuradas en `firestore.rules` para:
- ✅ Usuarios autenticados pueden acceder a sus datos
- ✅ Roles de administrador para configuración del sistema
- ✅ Validación de permisos por colección

### Configuración de CORS

El backend está configurado para aceptar requests desde tu dominio de hosting de Firebase.

## 🧪 Testing Local

### 1. Usar Emuladores de Firebase

```bash
# Instalar emuladores
firebase setup:emulators:firestore
firebase setup:emulators:auth
firebase setup:emulators:functions

# Ejecutar emuladores
firebase emulators:start
```

### 2. Configurar Variables para Emuladores

En `frontend/.env.development`:

```bash
REACT_APP_USE_FIREBASE_EMULATOR=true
REACT_APP_API_URL=http://localhost:5001/tu_proyecto_id/us-central1/api
```

## 🔄 Comandos Útiles

```bash
# Ver logs de Cloud Functions
firebase functions:log

# Ver configuración actual
firebase projects:list
firebase use

# Backup de Firestore
gcloud firestore export gs://tu-bucket/backup-folder

# Restaurar backup
gcloud firestore import gs://tu-bucket/backup-folder
```

## 📱 Nuevas Funcionalidades Habilitadas

Con Firebase tienes acceso a:

1. **Authentication**: Login social, 2FA, etc.
2. **Real-time Updates**: Datos en tiempo real con Firestore
3. **Push Notifications**: Firebase Cloud Messaging
4. **Analytics**: Firebase Analytics
5. **Storage**: Subida de archivos e imágenes
6. **Hosting**: CDN global automático

## 🐛 Troubleshooting

### Error: Permission Denied

1. Verifica que las reglas de Firestore estén configuradas
2. Confirma que el usuario esté autenticado
3. Revisa los logs de Cloud Functions

### Error: CORS

1. Verifica la configuración de CORS en `backend/index.js`
2. Confirma que el dominio esté en la lista blanca

### Error: Function Not Found

1. Confirma que la función esté desplegada: `firebase functions:list`
2. Verifica la URL en `REACT_APP_API_URL`

## 💡 Optimizaciones Recomendadas

1. **Índices**: Crea índices compuestos en Firestore Console para queries complejas
2. **Caching**: Implementa caching con Firebase Performance
3. **Monitoring**: Configura alertas en Firebase Monitoring
4. **Backup**: Programa backups automáticos de Firestore

## 📞 Soporte

Para problemas específicos:
1. Revisa [Firebase Documentation](https://firebase.google.com/docs)
2. Consulta [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase)
3. Revisa logs en Firebase Console

