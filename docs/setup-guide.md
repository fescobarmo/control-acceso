# Guía de Configuración - ControlAcceso

## Requisitos Previos

### Software Requerido
- **Docker**: Versión 20.10 o superior
- **Docker Compose**: Versión 2.0 o superior
- **Node.js**: Versión 18 o superior (para desarrollo local)
- **Git**: Para clonar el repositorio

### Verificar Instalación
```bash
# Verificar Docker
docker --version
docker-compose --version

# Verificar Node.js
node --version
npm --version

# Verificar Git
git --version
```

## Instalación

### 1. Clonar el Repositorio
```bash
git clone <url-del-repositorio>
cd ControlAcceso
```

### 2. Configurar Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:
```bash
# Backend
NODE_ENV=development
PORT=3001
JWT_SECRET=tu_jwt_secret_super_seguro
DATABASE_URL=postgresql://admin:password123@database:5432/controlacceso

# Frontend
REACT_APP_API_URL=http://localhost:3001

# Database
POSTGRES_DB=controlacceso
POSTGRES_USER=admin
POSTGRES_PASSWORD=password123
```

### 3. Ejecutar con Docker Compose

#### Desarrollo
```bash
# Construir y ejecutar todos los servicios
docker-compose up --build

# Ejecutar en segundo plano
docker-compose up -d --build
```

#### Producción
```bash
# Usar configuración de producción
docker-compose -f docker-compose.prod.yml up --build
```

### 4. Verificar Instalación

#### Verificar Servicios
```bash
# Verificar que todos los contenedores estén corriendo
docker-compose ps

# Ver logs de los servicios
docker-compose logs -f
```

#### Acceder a las Aplicaciones
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **Base de Datos**: localhost:5432

## Desarrollo Local

### 1. Configurar Entorno de Desarrollo

#### Frontend
```bash
cd frontend
npm install
npm start
```

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Base de Datos
```bash
# Usar solo la base de datos con Docker
docker-compose up database
```

### 2. Variables de Entorno para Desarrollo

#### Frontend (.env)
```bash
REACT_APP_API_URL=http://localhost:3001
```

#### Backend (.env)
```bash
NODE_ENV=development
PORT=3001
JWT_SECRET=dev_secret_key
DATABASE_URL=postgresql://admin:password123@localhost:5432/controlacceso
```

## Estructura de Archivos

```
ControlAcceso/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── App.js          # Componente principal
│   │   └── index.js        # Punto de entrada
│   ├── public/
│   ├── package.json
│   └── Dockerfile
├── backend/                  # API Node.js
│   ├── src/
│   │   ├── routes/         # Rutas de la API
│   │   ├── controllers/    # Controladores
│   │   ├── middleware/     # Middleware personalizado
│   │   └── models/         # Modelos de datos
│   ├── package.json
│   └── Dockerfile
├── database/                 # Scripts de base de datos
│   ├── migrations/
│   ├── seeds/
│   └── schema.sql
├── docs/                     # Documentación
├── docker-compose.yml
└── README.md
```

## Comandos Útiles

### Docker
```bash
# Construir imágenes
docker-compose build

# Ejecutar servicios
docker-compose up

# Detener servicios
docker-compose down

# Ver logs
docker-compose logs -f [servicio]

# Ejecutar comandos en contenedores
docker-compose exec backend npm test
docker-compose exec frontend npm run build
```

### Base de Datos
```bash
# Conectar a PostgreSQL
docker-compose exec database psql -U admin -d controlacceso

# Ejecutar migraciones
docker-compose exec database psql -U admin -d controlacceso -f /docker-entrypoint-initdb.d/schema.sql

# Backup de base de datos
docker-compose exec database pg_dump -U admin controlacceso > backup.sql
```

### Desarrollo
```bash
# Instalar dependencias
npm install

# Ejecutar tests
npm test

# Linting
npm run lint

# Build de producción
npm run build
```

## Configuración de IDE

### VS Code Extensions Recomendadas
- **Docker**: Para gestión de contenedores
- **PostgreSQL**: Para gestión de base de datos
- **ES7+ React/Redux/React-Native snippets**: Para React
- **Prettier**: Para formateo de código
- **ESLint**: Para linting

### Configuración de VS Code
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "files.associations": {
    "*.sql": "sql"
  }
}
```

## Troubleshooting

### Problemas Comunes

#### 1. Puerto ya en uso
```bash
# Verificar puertos en uso
lsof -i :3000
lsof -i :3001
lsof -i :5432

# Matar proceso
kill -9 <PID>
```

#### 2. Contenedores no inician
```bash
# Verificar logs
docker-compose logs

# Reconstruir imágenes
docker-compose down
docker-compose build --no-cache
docker-compose up
```

#### 3. Problemas de permisos
```bash
# En macOS/Linux
sudo chown -R $USER:$USER .

# En Windows (PowerShell como administrador)
icacls . /grant Everyone:F /T
```

#### 4. Base de datos no conecta
```bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps database

# Reiniciar base de datos
docker-compose restart database

# Verificar variables de entorno
docker-compose exec backend env | grep DATABASE
```

### Logs de Debug
```bash
# Ver logs detallados
docker-compose logs -f --tail=100

# Logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database
```

## Despliegue

### Producción
```bash
# Construir para producción
docker-compose -f docker-compose.prod.yml build

# Ejecutar en producción
docker-compose -f docker-compose.prod.yml up -d
```

### Variables de Entorno de Producción
```bash
NODE_ENV=production
JWT_SECRET=production_secret_key_super_seguro
DATABASE_URL=postgresql://user:pass@host:5432/db
```

## Soporte

Para problemas adicionales:
1. Revisar la documentación en `/docs`
2. Verificar logs de Docker
3. Consultar issues del repositorio
4. Contactar al equipo de desarrollo





