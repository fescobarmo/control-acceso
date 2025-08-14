# 📚 Documentación Completa - Sistema de Control de Acceso

## 🎯 Descripción General

El **Sistema de Control de Acceso** es una aplicación web completa desarrollada con arquitectura moderna que permite gestionar visitas, usuarios, propietarios y control de acceso en instalaciones. El sistema está construido con tecnologías actuales y sigue las mejores prácticas de desarrollo.

## 🏗️ Arquitectura del Sistema

### 📋 Documentos Disponibles

1. **[ARQUITECTURA_PROYECTO.md](./ARQUITECTURA_PROYECTO.md)**
   - Arquitectura general del sistema
   - Estructura de directorios
   - Modelo de datos completo
   - Flujos de datos
   - APIs y endpoints
   - Despliegue y configuración

2. **[DIAGRAMA_COMPONENTES.md](./DIAGRAMA_COMPONENTES.md)**
   - Componentes principales del frontend
   - Flujo de datos entre componentes
   - Estructura de UI Components
   - Autenticación y autorización
   - Gestión de estado
   - Patrones de diseño implementados

3. **[ARQUITECTURA_BASE_DATOS.md](./ARQUITECTURA_BASE_DATOS.md)**
   - Diseño completo de base de datos
   - Relaciones y constraints
   - Índices y optimización
   - Migraciones y versionado
   - Seeds y datos iniciales
   - Seguridad de datos
   - Rendimiento y escalabilidad

## 🚀 Tecnologías Utilizadas

### Frontend
- **React.js 18** - Framework principal
- **Material-UI (MUI) v5** - Biblioteca de componentes UI
- **React Router DOM v6** - Enrutamiento
- **Axios** - Cliente HTTP
- **React Context API** - Gestión de estado global

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **Sequelize v6** - ORM para base de datos
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación con tokens
- **bcryptjs** - Encriptación de contraseñas

### DevOps
- **Docker** - Containerización
- **Docker Compose** - Orquestación
- **Git** - Control de versiones

## 📊 Características Principales

### 🔐 Autenticación y Seguridad
- Sistema de login con JWT
- Roles y permisos basados en usuarios
- Encriptación de contraseñas con bcrypt
- Protección de rutas
- Auditoría de acciones

### 👥 Gestión de Usuarios
- CRUD completo de usuarios
- Asignación de roles y perfiles
- Gestión de áreas de acceso
- Estados de usuario (activo, inactivo, suspendido)

### 📝 Gestión de Visitas
- **Visitas Internas**: Registro de visitas de personal interno
- **Visitas Externas**: Registro de visitas de personas externas
- Estados de visita (activa, finalizada, cancelada)
- Filtros y búsqueda avanzada
- Paginación de resultados

### 🏘️ Gestión de Propietarios
- Registro de propietarios y residentes
- Información personal y de contacto
- Historial de acceso
- Gestión de vehículos

### 📈 Dashboard y Reportes
- Estadísticas en tiempo real
- Tarjetas de métricas
- Gráficos de actividad
- Filtros por fecha y estado

## 🗂️ Estructura del Proyecto

```
ControlAcceso/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   ├── contexts/         # Contextos de React
│   │   ├── config/          # Configuración
│   │   └── utils/           # Utilidades
│   └── public/              # Archivos públicos
├── backend/                  # API Node.js/Express
│   ├── src/
│   │   ├── controllers/     # Controladores
│   │   ├── models/          # Modelos Sequelize
│   │   ├── routes/          # Rutas de la API
│   │   ├── middleware/      # Middleware personalizado
│   │   ├── seeds/           # Datos iniciales
│   │   └── config/          # Configuración
│   └── tests/               # Pruebas
├── database/                # Scripts de base de datos
├── docs/                    # Documentación
└── docker-compose.yml       # Configuración Docker
```

## 🗄️ Modelo de Datos

### Entidades Principales
- **Users**: Usuarios del sistema
- **Roles**: Roles y permisos
- **Profiles**: Perfiles de usuario
- **Areas**: Áreas de acceso
- **Visitas**: Visitas internas
- **VisitasExternas**: Visitas externas
- **Devices**: Dispositivos de control
- **AccessLogs**: Registros de acceso
- **AccessPermissions**: Permisos de acceso
- **Sessions**: Sesiones de usuario
- **AuditLogs**: Registros de auditoría
- **SystemConfig**: Configuración del sistema

## 🔄 Flujos Principales

### Autenticación
1. Usuario ingresa credenciales
2. Backend valida y genera JWT
3. Frontend almacena token
4. Token se incluye en requests posteriores

### Gestión de Visitas
1. Usuario accede a página de visitas
2. Sistema carga datos con paginación
3. Usuario puede crear/editar visitas
4. Cambios se reflejan en tiempo real

### Control de Acceso
1. Dispositivo registra acceso
2. Sistema valida permisos
3. Se genera log de acceso
4. Se actualiza estado de visita

## 🚀 Despliegue

### Desarrollo Local
```bash
# Clonar repositorio
git clone <repository-url>
cd ControlAcceso

# Configurar variables de entorno
cp backend/.env.example backend/.env

# Iniciar con Docker
docker-compose up -d

# O iniciar manualmente
cd backend && npm install && npm start
cd frontend && npm install && npm start
```

### Producción
```bash
# Construir imágenes
docker-compose -f docker-compose.prod.yml build

# Desplegar
docker-compose -f docker-compose.prod.yml up -d
```

## 📈 Métricas y Monitoreo

### Rendimiento
- Tiempo de respuesta de API < 200ms
- Carga inicial de página < 3s
- Disponibilidad > 99.9%

### Seguridad
- Contraseñas encriptadas con bcrypt
- Tokens JWT con expiración
- Validación de entrada en frontend y backend
- Logs de auditoría completos

### Escalabilidad
- Arquitectura modular
- Base de datos optimizada con índices
- Paginación en todas las consultas
- Caching de datos frecuentes

## 🔧 Configuración

### Variables de Entorno Backend
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=controlacceso
DB_USER=admin
DB_PASSWORD=admin123
PORT=3001
JWT_SECRET=tu_jwt_secret_super_seguro_aqui
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:3000
```

### Variables de Entorno Frontend
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENV=development
```

## 🧪 Pruebas

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

## 📝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo

- **Desarrollador Principal**: [Tu Nombre]
- **Arquitecto de Software**: [Tu Nombre]
- **Diseñador UX/UI**: [Tu Nombre]

## 📞 Contacto

- **Email**: [tu-email@ejemplo.com]
- **Proyecto**: [https://github.com/tu-usuario/ControlAcceso]

---

## 🎯 Próximas Características

### Versión 1.1
- [ ] Notificaciones en tiempo real
- [ ] Reportes avanzados con gráficos
- [ ] Integración con dispositivos biométricos
- [ ] App móvil React Native

### Versión 1.2
- [ ] Sistema de alertas
- [ ] Integración con cámaras de seguridad
- [ ] API pública para terceros
- [ ] Dashboard administrativo avanzado

### Versión 2.0
- [ ] Inteligencia artificial para detección de anomalías
- [ ] Integración con sistemas de seguridad externos
- [ ] Análisis predictivo de visitas
- [ ] Sistema de reservas avanzado

---

*Documentación generada automáticamente - Sistema de Control de Acceso v1.0*

**Última actualización**: Diciembre 2024
