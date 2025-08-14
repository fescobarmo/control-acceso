# 🏢 Sistema de Control de Acceso

Un sistema completo de gestión de acceso para edificios residenciales y comerciales, desarrollado con tecnologías modernas.

## 🚀 Características

### 🔐 Autenticación y Seguridad
- Autenticación JWT segura
- Gestión de roles y permisos
- Sesiones de usuario
- Auditoría de accesos

### 👥 Gestión de Usuarios
- Registro y gestión de usuarios del sistema
- Perfiles de usuario personalizables
- Roles administrativos y operativos

### 🏠 Gestión de Residentes
- Registro de propietarios y residentes
- Información personal y de contacto
- Gestión de departamentos y pisos
- Información vehicular

### 📝 Control de Visitas
- **Visitas Internas**: Registro de visitas de residentes
- **Visitas Externas**: Registro de visitas de personas externas
- Filtros y búsquedas avanzadas
- Estadísticas en tiempo real

### 🚗 Control Vehicular
- Registro de vehículos de residentes
- Control de acceso vehicular
- Información de placas y modelos

### 📊 Reportes y Estadísticas
- Dashboard con métricas en tiempo real
- Reportes de accesos
- Estadísticas de visitas
- Análisis de tendencias

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React.js** - Biblioteca de interfaz de usuario
- **Material-UI (MUI)** - Componentes de UI modernos
- **React Router** - Navegación entre páginas
- **Axios** - Cliente HTTP para API

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **Sequelize** - ORM para base de datos
- **JWT** - Autenticación por tokens
- **bcryptjs** - Encriptación de contraseñas

### Base de Datos
- **PostgreSQL** - Base de datos relacional
- **Docker** - Contenedores para desarrollo

### DevOps
- **Docker Compose** - Orquestación de contenedores
- **Multi-entorno** - Desarrollo, pruebas y producción

## 📁 Estructura del Proyecto

```
ControlAcceso/
├── 📁 backend/                 # Servidor Node.js/Express
│   ├── 📁 src/
│   │   ├── 📁 controllers/     # Controladores de la API
│   │   ├── 📁 models/         # Modelos de Sequelize
│   │   ├── 📁 routes/         # Rutas de la API
│   │   ├── 📁 middleware/     # Middleware personalizado
│   │   ├── 📁 seeds/          # Datos iniciales
│   │   └── 📁 config/         # Configuración
│   ├── 📄 package.json
│   └── 📄 Dockerfile
├── 📁 frontend/               # Aplicación React
│   ├── 📁 src/
│   │   ├── 📁 components/     # Componentes React
│   │   ├── 📁 contexts/       # Context API
│   │   ├── 📁 utils/          # Utilidades
│   │   └── 📁 config/         # Configuración
│   ├── 📄 package.json
│   └── 📄 Dockerfile
├── 📁 database/               # Scripts de base de datos
├── 📁 docs/                   # Documentación
├── 📄 docker-compose.yml      # Configuración Docker
└── 📄 README.md
```

## 🚀 Instalación Rápida

### Prerrequisitos
- Node.js (v16 o superior)
- PostgreSQL
- Docker (opcional)

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/control-acceso.git
cd control-acceso
```

### 2. Configuración de entornos
```bash
# Ejecutar script de inicialización
chmod +x init-environments.sh
./init-environments.sh
```

### 3. Instalar dependencias
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Configurar base de datos
```bash
# Crear base de datos PostgreSQL
createdb controlacceso_dev

# Ejecutar migraciones y seeds
cd backend
npm run dev
```

### 5. Levantar servidores
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run start:dev
```

## 🌐 Acceso al Sistema

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Credenciales por defecto**:
  - Usuario: `admin`
  - Contraseña: `admin123`

## 🔧 Configuración de Entornos

El proyecto soporta tres entornos:

### Desarrollo
```bash
# Backend
npm run dev

# Frontend
npm run start:dev
```

### Pruebas
```bash
# Backend
npm run test-env

# Frontend
npm run start:test
```

### Producción
```bash
# Backend
npm run prod

# Frontend
npm run start:prod
```

## 🐳 Docker

### Levantar con Docker Compose
```bash
# Todos los entornos
docker compose -f docker-compose.override.yml up

# Solo desarrollo
docker compose -f docker-compose.override.yml up backend-dev frontend-dev database-dev
```

## 📚 Documentación

- [Arquitectura del Proyecto](docs/ARQUITECTURA_PROYECTO.md)
- [Configuración de Entornos](docs/CONFIGURACION_ENTORNOS.md)
- [Diagrama de Componentes](docs/DIAGRAMA_COMPONENTES.md)
- [Arquitectura de Base de Datos](docs/ARQUITECTURA_BASE_DATOS.md)

## 🔍 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión

### Usuarios
- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Residentes
- `GET /api/residentes` - Listar residentes
- `POST /api/residentes` - Crear residente
- `PUT /api/residentes/:id` - Actualizar residente
- `DELETE /api/residentes/:id` - Eliminar residente

### Visitas
- `GET /api/visitas` - Listar visitas internas
- `POST /api/visitas` - Crear visita interna
- `GET /api/visitas-externas` - Listar visitas externas
- `POST /api/visitas-externas` - Crear visita externa

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Fabian Escobar**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- Material-UI por los componentes de UI
- Sequelize por el ORM
- React por la biblioteca de interfaz de usuario
- Node.js por el runtime de JavaScript

---

⭐ Si este proyecto te ayuda, ¡dale una estrella!
