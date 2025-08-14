# Sistema de Autenticación Real - ControlAcceso

## ✅ **Cambios Implementados**

### **1. Autenticación contra Base de Datos Real**
- ❌ **ANTES**: Login simulado con credenciales hardcodeadas
- ✅ **AHORA**: Login verifica credenciales en tabla `usuarios`

### **2. Middleware de Autenticación JWT**
- Verificación automática de tokens en rutas protegidas
- Validación de usuario activo en base de datos
- Seguridad mejorada para todas las operaciones

### **3. Usuario Administrador Creado Automáticamente**
- Se crea al inicializar la base de datos
- Credenciales: `admin` / `password123`
- Rol: "Administrador"
- Perfil: "Administrador del Sistema"

## 🔧 **Archivos Modificados**

### **Backend**
- `backend/src/controllers/authController.js` - Login real contra BD
- `backend/src/middleware/auth.js` - **NUEVO** - Middleware JWT
- `backend/src/seeds/initialData.js` - Usuario admin automático
- `backend/src/routes/auth.js` - Middleware en rutas protegidas
- `backend/src/routes/users.js` - Autenticación requerida

## 🗄️ **Base de Datos**

### **Tabla: usuarios**
```sql
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol_id INTEGER REFERENCES roles(id),
    perfil_id INTEGER REFERENCES perfiles(id),
    estado VARCHAR(20) DEFAULT 'activo',
    is_active BOOLEAN DEFAULT true,
    ultimo_acceso TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Usuario Administrador Creado**
```json
{
  "nombre": "Administrador",
  "apellido": "Sistema",
  "email": "admin@controlacceso.com",
  "username": "admin",
  "password_hash": "$2a$10$...", // Hash de "password123"
  "rol_id": 2, // ID del rol "Administrador"
  "perfil_id": 2, // ID del perfil "Administrador del Sistema"
  "estado": "activo",
  "is_active": true
}
```

## 🔐 **Flujo de Autenticación**

### **1. Login**
```
POST /api/auth/login
{
  "username": "admin",
  "password": "password123"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "nombre": "Administrador",
    "apellido": "Sistema",
    "email": "admin@controlacceso.com",
    "estado": "activo",
    "role": {
      "id": 2,
      "nombre": "Administrador",
      "color": "#f57c00",
      "icono": "security"
    },
    "profile": {
      "id": 2,
      "nombre": "Administrador del Sistema",
      "color": "#f57c00",
      "icono": "security"
    }
  }
}
```

### **2. Verificación de Token**
```
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **3. Rutas Protegidas**
Todas las rutas de usuarios requieren autenticación:
- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario
- `PATCH /api/users/:id/status` - Cambiar estado

## 🚀 **Cómo Probar**

### **1. Iniciar Backend**
```bash
cd backend
npm start
```

**Verificar en consola:**
- ✅ Base de datos sincronizada
- ✅ Datos iniciales cargados (roles, perfiles, usuario admin)
- ✅ Usuario administrador creado/verificado

### **2. Probar Login Real**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'
```

**Respuesta esperada:**
- `success: true`
- `token` válido
- `user` con información completa

### **3. Probar Ruta Protegida**
```bash
# Obtener token del login anterior
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Usar token para acceder a ruta protegida
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/users/roles
```

### **4. Probar Frontend**
1. Iniciar frontend: `cd frontend && npm start`
2. Ir a `http://localhost:3000`
3. Login con: `admin` / `password123`
4. Verificar avatar en Dashboard
5. Ir a Usuarios y verificar dropdowns

## 🔒 **Seguridad Implementada**

### **1. Hash de Contraseñas**
- Uso de bcrypt con salt de 10 rondas
- Contraseñas nunca se almacenan en texto plano

### **2. Validación de Usuario**
- Solo usuarios activos pueden hacer login
- Solo usuarios con estado "activo" pueden acceder

### **3. Middleware JWT**
- Verificación automática de tokens
- Validación de usuario en base de datos
- Manejo de tokens expirados

### **4. Rutas Protegidas**
- Todas las operaciones CRUD requieren autenticación
- Verificación de usuario activo en cada request

## 🐛 **Solución de Problemas**

### **Si el login falla:**
1. Verificar que el backend esté corriendo
2. Verificar que se haya creado el usuario admin
3. Verificar credenciales: `admin` / `password123`
4. Revisar logs del backend para errores

### **Si las rutas protegidas fallan:**
1. Verificar que el token se esté enviando
2. Verificar formato: `Authorization: Bearer <token>`
3. Verificar que el token no haya expirado
4. Verificar que el usuario esté activo en BD

### **Si no se cargan roles/perfiles:**
1. Verificar que se hayan cargado los datos iniciales
2. Verificar que el usuario tenga permisos
3. Verificar logs del backend

## 📝 **Notas Importantes**

- **Primera vez**: El usuario admin se crea automáticamente
- **Contraseña por defecto**: `password123` (cambiar en producción)
- **Token expiración**: 24 horas
- **Base de datos**: Se sincroniza automáticamente al iniciar
- **Datos iniciales**: Se cargan automáticamente al iniciar
- **Seguridad**: Todas las rutas sensibles están protegidas
