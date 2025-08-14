# 🚪 ControlAcceso - Sistema de Control de Acceso

Sistema moderno y escalable para gestión de accesos, usuarios y permisos con arquitectura de microservicios.

## 🏗️ Arquitectura del Sistema

### **Frontend (React 18)**
- **Tecnologías**: React 18, Material-UI, React Router, Axios
- **Características**: Diseño responsive, componentes reutilizables, navegación SPA
- **Puerto**: 3000

### **Backend (Node.js + Express)**
- **Tecnologías**: Node.js, Express, Sequelize ORM, JWT, bcryptjs
- **Características**: API RESTful, validación de datos, autenticación JWT
- **Puerto**: 3001

### **Base de Datos (PostgreSQL)**
- **Tecnologías**: PostgreSQL 15, Sequelize ORM
- **Características**: Esquema normalizado, triggers de auditoría, funciones PL/pgSQL
- **Puerto**: 5432

## 📋 Prerrequisitos

- **Node.js**: v18 o superior
- **npm**: v8 o superior
- **PostgreSQL**: v15 o superior
- **Git**: Para clonar el repositorio

## 🚀 Instalación y Configuración

### 🚀 Inicialización Rápida (Recomendado)

```bash
# Ejecutar script de inicialización
./init-environments.sh
```

Este script automáticamente:
- ✅ Instala todas las dependencias
- ✅ Verifica la configuración
- ✅ Crea las bases de datos necesarias
- ✅ Muestra los comandos disponibles

### 📋 Configuración Manual

#### 1. Clonar el Repositorio
```bash
git clone <url-del-repositorio>
cd ControlAcceso
```

#### 2. Configurar Base de Datos PostgreSQL

**Opción A: Usando Docker (Recomendado)**
```bash
# Instalar Docker si no está instalado
# macOS: https://docs.docker.com/desktop/install/mac-install/
# Windows: https://docs.docker.com/desktop/install/windows-install/

# Crear y ejecutar contenedor PostgreSQL
docker run --name controlacceso-db \
  -e POSTGRES_DB=controlacceso_dev \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin123 \
  -p 5432:5432 \
  -d postgres:15-alpine

# Verificar que esté corriendo
docker ps
```

**Opción B: Instalación Local**
```bash
# Instalar PostgreSQL desde https://www.postgresql.org/download/
# Crear usuario y bases de datos
sudo -u postgres psql
CREATE USER admin WITH PASSWORD 'admin123';
CREATE DATABASE controlacceso_dev OWNER admin;
CREATE DATABASE controlacceso_test OWNER admin;
CREATE DATABASE controlacceso_prod OWNER admin;
GRANT ALL PRIVILEGES ON DATABASE controlacceso_dev TO admin;
GRANT ALL PRIVILEGES ON DATABASE controlacceso_test TO admin;
GRANT ALL PRIVILEGES ON DATABASE controlacceso_prod TO admin;
\q
```

#### 3. Configurar Backend
```bash
cd backend
npm install
```

**Archivos de variables de entorno ya están configurados:**
- `env.development` - Para desarrollo
- `env.test` - Para pruebas
- `env.production` - Para producción

#### 4. Configurar Frontend
```bash
cd frontend
npm install
```

**Archivos de variables de entorno ya están configurados:**
- `env.development` - Para desarrollo
- `env.test` - Para pruebas
- `env.production` - Para producción

### 🎯 Ejecutar Entornos

**Backend:**
```bash
# Desarrollo
cd backend && npm run dev

# Pruebas
cd backend && npm run test-env

# Producción
cd backend && npm run prod
```

**Frontend:**
```bash
# Desarrollo
cd frontend && npm run start:dev

# Pruebas
cd frontend && npm run start:test

# Producción
cd frontend && npm run start:prod
```

**Docker (Todos los entornos simultáneamente):**
```bash
# Levantar todos los entornos
docker compose -f docker-compose.override.yml up -d

# Ver logs
docker compose -f docker-compose.override.yml logs

# Detener todos los entornos
docker compose -f docker-compose.override.yml down
```

> **⚠️ Nota**: Si obtienes el error "Unknown command: brew docker-compose", usa `docker compose` (sin guión) en lugar de `docker-compose`. Ejecuta `./check-docker.sh` para verificar tu instalación de Docker.

### 🌐 URLs de Acceso

| Entorno | Frontend | Backend | Base de Datos |
|---------|----------|---------|---------------|
| **Desarrollo** | http://localhost:3000 | http://localhost:3001 | controlacceso_dev |
| **Pruebas** | http://localhost:3003 | http://localhost:3002 | controlacceso_test |
| **Producción** | http://localhost:3004 | http://localhost:3003 | controlacceso_prod |

**Configurar variables de entorno** (`.env`):
```env
REACT_APP_API_URL=http://localhost:3001/api
```

## 🏃‍♂️ Ejecutar la Aplicación

### 1. Iniciar Backend
```bash
cd backend
npm start
```

**Verificar funcionamiento**:
```bash
curl http://localhost:3001/health
```

### 2. Iniciar Frontend
```bash
cd frontend
npm start
```

**Acceder a la aplicación**: http://localhost:3000

## 📊 Estructura de la Base de Datos

### **Tablas Principales**
- **`usuarios`**: Gestión de usuarios del sistema
- **`roles`**: Roles de usuario (admin, supervisor, usuario, etc.)
- **`perfiles`**: Perfiles con permisos específicos
- **`areas`**: Áreas/zones de acceso
- **`dispositivos`**: Dispositivos de control de acceso
- **`permisos_acceso`**: Permisos de usuarios por área
- **`logs_acceso`**: Registro de accesos y eventos
- **`sesiones`**: Gestión de sesiones de usuario
- **`auditoria`**: Log de cambios en el sistema

### **Características de Seguridad**
- **Encriptación**: Contraseñas hasheadas con bcrypt
- **Auditoría**: Triggers automáticos para tracking de cambios
- **Validación**: Constraints y validaciones a nivel de base de datos
- **Índices**: Optimización de consultas frecuentes

## 🔐 Funcionalidades del Sistema

### **Gestión de Usuarios**
- ✅ Crear, editar, eliminar usuarios
- ✅ Asignar roles y perfiles
- ✅ Gestión de estados (activo, inactivo, bloqueado)
- ✅ Búsqueda y filtrado avanzado
- ✅ Paginación de resultados

### **Control de Acceso**
- ✅ Definir áreas y dispositivos
- ✅ Configurar permisos por usuario/área
- ✅ Control de horarios y días de acceso
- ✅ Registro de eventos de acceso
- ✅ Monitoreo en tiempo real

### **Seguridad y Auditoría**
- ✅ Autenticación JWT
- ✅ Logs de auditoría automáticos
- ✅ Validación de datos
- ✅ Manejo seguro de contraseñas

## 🛠️ Desarrollo

### **Scripts Disponibles**
```bash
# Backend
npm start          # Iniciar servidor
npm run dev        # Modo desarrollo con nodemon
npm test           # Ejecutar tests

# Frontend
npm start          # Iniciar aplicación React
npm run build      # Build de producción
npm test           # Ejecutar tests
npm run eject      # Eject de Create React App

# Base de Datos
node init-db.js    # Inicializar base de datos
```

### **Estructura de Archivos**
```
ControlAcceso/
├── frontend/          # Aplicación React
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Login.js
│   │   │   └── usuarios/
│   │   │       └── Usuarios.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── backend/           # API Node.js
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── config/
│   │   └── index.js
│   └── package.json
├── database/          # Scripts de base de datos
│   ├── schema.sql
│   ├── init-db.js
│   └── package.json
└── docs/             # Documentación
```

## 🔧 Configuración Avanzada

### **Variables de Entorno Adicionales**
```env
# Base de Datos
DB_SSL=true                    # Para conexiones SSL
DB_POOL_MAX=10                # Máximo de conexiones en pool
DB_POOL_MIN=2                 # Mínimo de conexiones en pool

# JWT
JWT_REFRESH_SECRET=refresh_secret_aqui
JWT_REFRESH_EXPIRES_IN=7d

# Logging
LOG_LEVEL=info                # debug, info, warn, error
LOG_FILE=logs/app.log         # Archivo de logs

# CORS
CORS_ORIGINS=http://localhost:3000,https://tu-dominio.com
```

### **Optimización de Base de Datos**
```sql
-- Crear índices adicionales según necesidades
CREATE INDEX CONCURRENTLY idx_usuarios_busqueda 
ON usuarios USING gin(to_tsvector('spanish', nombre || ' ' || apellido || ' ' || email));

-- Configurar particionado para logs grandes
CREATE TABLE logs_acceso_2024 PARTITION OF logs_acceso
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

## 🚨 Solución de Problemas

### **Error de Conexión a Base de Datos**
```bash
# Verificar que PostgreSQL esté corriendo
sudo systemctl status postgresql

# Verificar credenciales
psql -h localhost -U admin -d control_acc_DB

# Verificar puerto
netstat -an | grep 5432
```

### **Error de Dependencias**
```bash
# Limpiar cache de npm
npm cache clean --force

# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### **Error de CORS**
```bash
# Verificar configuración en backend/src/index.js
# Verificar FRONTEND_URL en .env
# Verificar que el frontend esté corriendo en el puerto correcto
```

## 📈 Monitoreo y Logs

### **Health Check**
```bash
curl http://localhost:3001/health
```

### **Logs del Sistema**
```bash
# Backend logs
tail -f backend/logs/app.log

# Base de datos logs (PostgreSQL)
tail -f /var/log/postgresql/postgresql-15-main.log
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

- **Issues**: Crear un issue en GitHub
- **Documentación**: Revisar la carpeta `docs/`
- **Email**: [tu-email@dominio.com]

---

**Desarrollado con ❤️ para sistemas de control de acceso modernos y seguros**
