# 🚀 Configuración de Múltiples Entornos - Sistema de Control de Acceso

## 📋 Descripción General

Este documento describe cómo configurar y utilizar los tres entornos locales del Sistema de Control de Acceso:

1. **Desarrollo (dev)** - Para desarrollo activo
2. **Pruebas (test)** - Para testing y QA
3. **Producción (prod)** - Para simular entorno de producción

## 🏗️ Arquitectura de Entornos

### 📊 Resumen de Puertos y Configuraciones

| Entorno | Backend | Frontend | Base de Datos | Descripción |
|---------|---------|----------|---------------|-------------|
| **Desarrollo** | 3001 | 3000 | 5432 | Desarrollo activo con hot-reload |
| **Pruebas** | 3002 | 3003 | 5433 | Testing y QA con datos aislados |
| **Producción** | 3003 | 3004 | 5434 | Simulación de producción |

### 🗄️ Bases de Datos por Entorno

- **controlacceso_dev** - Datos de desarrollo
- **controlacceso_test** - Datos de pruebas (se resetea frecuentemente)
- **controlacceso_prod** - Datos de producción (simulado)

## 🚀 Métodos de Ejecución

### 1. Ejecución con NPM (Recomendado para desarrollo)

#### Backend

```bash
# Desarrollo
cd backend
npm run dev

# Pruebas
cd backend
npm run test-env

# Producción
cd backend
npm run prod
```

#### Frontend

```bash
# Desarrollo
cd frontend
npm run start:dev

# Pruebas
cd frontend
npm run start:test

# Producción
cd frontend
npm run start:prod
```

### 2. Ejecución con Docker (Todos los entornos simultáneamente)

```bash
# Levantar todos los entornos
docker compose -f docker-compose.override.yml up

# Levantar en segundo plano
docker compose -f docker-compose.override.yml up -d

# Detener todos los entornos
docker compose -f docker-compose.override.yml down

# Ver logs de un servicio específico
docker compose -f docker-compose.override.yml logs backend-dev
```

## 📁 Estructura de Archivos de Configuración

### Backend

```
backend/
├── env.development    # Variables para desarrollo
├── env.test          # Variables para pruebas
├── env.production    # Variables para producción
└── src/
    └── index.js      # Carga automática según NODE_ENV
```

### Frontend

```
frontend/
├── env.development   # Variables para desarrollo
├── env.test         # Variables para pruebas
└── env.production   # Variables para producción
```

## 🔧 Variables de Entorno por Entorno

### Backend - Desarrollo
```env
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=controlacceso_dev
DB_USER=admin
DB_PASSWORD=admin123
JWT_SECRET=dev_jwt_secret_super_seguro_aqui_para_desarrollo
LOG_LEVEL=debug
```

### Backend - Pruebas
```env
NODE_ENV=test
PORT=3002
DB_HOST=localhost
DB_PORT=5432
DB_NAME=controlacceso_test
DB_USER=admin
DB_PASSWORD=admin123
JWT_SECRET=test_jwt_secret_super_seguro_aqui_para_pruebas
LOG_LEVEL=warn
```

### Backend - Producción
```env
NODE_ENV=production
PORT=3003
DB_HOST=localhost
DB_PORT=5432
DB_NAME=controlacceso_prod
DB_USER=admin
DB_PASSWORD=admin123
JWT_SECRET=prod_jwt_secret_super_seguro_aqui_para_produccion
LOG_LEVEL=error
```

### Frontend - Desarrollo
```env
REACT_APP_ENV=development
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_DEBUG=true
```

### Frontend - Pruebas
```env
REACT_APP_ENV=test
REACT_APP_API_URL=http://localhost:3002/api
REACT_APP_DEBUG=false
```

### Frontend - Producción
```env
REACT_APP_ENV=production
REACT_APP_API_URL=http://localhost:3003/api
REACT_APP_DEBUG=false
```

## 🎯 Casos de Uso por Entorno

### 🛠️ Entorno de Desarrollo
- **Propósito**: Desarrollo activo y debugging
- **Características**:
  - Hot-reload activo
  - Logs detallados (debug level)
  - Base de datos con datos de prueba
  - CORS configurado para localhost:3000
- **Uso típico**: Programación diaria, testing de nuevas features

### 🧪 Entorno de Pruebas
- **Propósito**: Testing y QA
- **Características**:
  - Logs moderados (warn level)
  - Base de datos aislada
  - CORS configurado para localhost:3003
  - JWT tokens con expiración corta (1h)
- **Uso típico**: Testing de integración, QA, demos

### 🚀 Entorno de Producción
- **Propósito**: Simulación de producción
- **Características**:
  - Logs mínimos (error level)
  - Base de datos separada
  - CORS configurado para localhost:3004
  - Configuración optimizada para rendimiento
- **Uso típico**: Testing de rendimiento, validación final

## 🔄 Flujo de Trabajo Recomendado

### 1. Desarrollo Diario
```bash
# Terminal 1 - Backend desarrollo
cd backend
npm run dev

# Terminal 2 - Frontend desarrollo
cd frontend
npm run start:dev
```

### 2. Testing de Features
```bash
# Terminal 1 - Backend pruebas
cd backend
npm run test-env

# Terminal 2 - Frontend pruebas
cd frontend
npm run start:test
```

### 3. Validación de Producción
```bash
# Terminal 1 - Backend producción
cd backend
npm run prod

# Terminal 2 - Frontend producción
cd frontend
npm run start:prod
```

### 4. Testing Completo (Docker)
```bash
# Levantar todos los entornos para testing completo
docker compose -f docker-compose.override.yml up -d
```

## 🗄️ Gestión de Bases de Datos

### Crear Bases de Datos
```sql
-- Conectar a PostgreSQL
psql -U admin -h localhost

-- Crear bases de datos
CREATE DATABASE controlacceso_dev;
CREATE DATABASE controlacceso_test;
CREATE DATABASE controlacceso_prod;

-- Verificar creación
\l
```

### Resetear Base de Datos de Pruebas
```bash
# Detener backend de pruebas
docker compose -f docker-compose.override.yml stop backend-test

# Eliminar volumen de base de datos de pruebas
docker volume rm controlacceso_postgres_data_test

# Reiniciar servicios
docker compose -f docker-compose.override.yml up -d database-test backend-test
```

## 🔍 Monitoreo y Debugging

### Verificar Estado de Entornos
```bash
# Ver contenedores activos
docker ps

# Ver logs de todos los servicios
docker compose -f docker-compose.override.yml logs

# Ver logs de un servicio específico
docker compose -f docker-compose.override.yml logs backend-dev
```

### Health Checks
```bash
# Backend desarrollo
curl http://localhost:3001/health

# Backend pruebas
curl http://localhost:3002/health

# Backend producción
curl http://localhost:3003/health
```

### Verificar Variables de Entorno
```bash
# Backend desarrollo
docker exec controlacceso_backend_dev env | grep NODE_ENV

# Frontend desarrollo
docker exec controlacceso_frontend_dev env | grep REACT_APP
```

## 🚨 Troubleshooting

### Problemas Comunes

#### 1. Puerto ya en uso
```bash
# Ver qué está usando el puerto
lsof -i :3001

# Matar proceso
kill -9 <PID>
```

#### 2. Base de datos no conecta
```bash
# Verificar que PostgreSQL esté corriendo
docker ps | grep postgres

# Verificar logs de base de datos
docker compose -f docker-compose.override.yml logs database-dev
```

#### 3. Variables de entorno no se cargan
```bash
# Verificar que el archivo .env existe
ls -la backend/env.development

# Verificar que NODE_ENV esté configurado
echo $NODE_ENV
```

#### 4. CORS errors
```bash
# Verificar configuración de CORS en backend
docker exec controlacceso_backend_dev env | grep CORS

# Verificar URL del frontend
docker exec controlacceso_frontend_dev env | grep REACT_APP_API_URL
```

## 📝 Scripts Útiles

### Crear Script de Inicialización
```bash
#!/bin/bash
# init-environments.sh

echo "🚀 Inicializando entornos de Control de Acceso..."

# Instalar dependencias
echo "📦 Instalando dependencias..."
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Crear bases de datos
echo "🗄️ Creando bases de datos..."
psql -U admin -h localhost -c "CREATE DATABASE IF NOT EXISTS controlacceso_dev;"
psql -U admin -h localhost -c "CREATE DATABASE IF NOT EXISTS controlacceso_test;"
psql -U admin -h localhost -c "CREATE DATABASE IF NOT EXISTS controlacceso_prod;"

echo "✅ Entornos inicializados correctamente!"
echo ""
echo "📋 Comandos disponibles:"
echo "  Backend: npm run dev | npm run test-env | npm run prod"
echo "  Frontend: npm run start:dev | npm run start:test | npm run start:prod"
echo "  Docker: docker-compose -f docker-compose.override.yml up"
```

## 🎯 Próximos Pasos

### Mejoras Futuras
- [ ] Configuración de CI/CD para cada entorno
- [ ] Scripts automatizados de migración de base de datos
- [ ] Monitoreo y alertas por entorno
- [ ] Backup automático de bases de datos
- [ ] Configuración de SSL para producción

---

*Documentación de Configuración de Entornos - Sistema de Control de Acceso v1.0*

**Última actualización**: Diciembre 2024
