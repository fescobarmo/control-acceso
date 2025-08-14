# 🗄️ Base de Datos - ControlAcceso

Este directorio contiene todos los scripts y configuraciones necesarias para la base de datos PostgreSQL del sistema ControlAcceso.

## 📋 Prerrequisitos

- **PostgreSQL 15+** instalado y ejecutándose
- **Node.js 18+** para ejecutar los scripts
- **psql** (cliente de línea de comandos de PostgreSQL)

## 🚀 Configuración Rápida

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Variables de Entorno
Crear archivo `.env` con:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=control_acc_DB
DB_USER=admin
DB_PASSWORD=password123
```

### 3. Configurar PostgreSQL
```bash
npm run setup
```

### 4. Inicializar Base de Datos
```bash
npm run init
```

### 5. Probar Conexión
```bash
npm run test
```

## 📊 Estructura de la Base de Datos

### **Tablas Principales**
- **`roles`** - Roles de usuario con niveles de acceso
- **`perfiles`** - Perfiles con permisos específicos
- **`usuarios`** - Usuarios del sistema
- **`areas`** - Áreas/zonas de acceso
- **`dispositivos`** - Dispositivos de control
- **`permisos_acceso`** - Permisos de usuarios por área
- **`logs_acceso`** - Registro de accesos
- **`sesiones`** - Gestión de sesiones
- **`auditoria`** - Log de cambios del sistema
- **`configuracion_sistema`** - Configuraciones globales

### **Vistas Útiles**
- **`v_usuarios_completos`** - Usuarios con información completa
- **`v_accesos_recientes`** - Accesos de los últimos 7 días
- **`v_permisos_usuario`** - Permisos detallados por usuario

### **Funciones PL/pgSQL**
- **`get_user_permissions(user_id)`** - Obtener permisos de un usuario
- **`check_user_access(user_id, area_id, tipo)`** - Verificar acceso
- **`get_users_by_role_stats()`** - Estadísticas por rol

## 🎭 Roles Predefinidos

| Rol | Nivel | Descripción |
|-----|-------|-------------|
| Super Administrador | 10 | Control total del sistema |
| Administrador | 8 | Administración completa |
| Gerente | 7 | Gestión de áreas y personal |
| Supervisor | 6 | Supervisión de áreas |
| Coordinador | 5 | Coordinación de actividades |
| Usuario Avanzado | 4 | Acceso extendido |
| Usuario Estándar | 3 | Acceso básico |
| Usuario Limitado | 2 | Acceso restringido |
| Invitado | 1 | Acceso temporal |
| Auditor | 2 | Solo lectura de logs |

## 👤 Perfiles Predefinidos

| Perfil | Seguridad | Módulos de Acceso |
|--------|-----------|-------------------|
| Super Administrador del Sistema | 5 | Todos los módulos |
| Administrador del Sistema | 4 | Dashboard, Usuarios, Áreas, Dispositivos, Reportes, Configuración |
| Gerente de Seguridad | 4 | Dashboard, Usuarios, Áreas, Reportes, Analíticas, Control de Acceso |
| Supervisor de Área | 3 | Dashboard, Usuarios, Áreas, Reportes, Control de Acceso |
| Coordinador de Accesos | 3 | Dashboard, Usuarios, Áreas, Control de Acceso, Reportes |
| Usuario Avanzado | 2 | Dashboard, Áreas, Perfil, Reportes |
| Usuario Estándar | 2 | Dashboard, Áreas, Perfil |
| Usuario Limitado | 1 | Dashboard, Áreas, Perfil |
| Invitado Temporal | 1 | Áreas, Perfil |
| Auditor del Sistema | 2 | Dashboard, Reportes, Logs, Auditoría |

## 🔧 Scripts Disponibles

### **setup-postgres.js**
Configura PostgreSQL creando usuario y base de datos.
```bash
npm run setup
```

### **init-db.js**
Inicializa las tablas y datos del sistema.
```bash
npm run init
```

### **test-db.js**
Prueba la conexión y funcionalidad de la base de datos.
```bash
npm run test
```

## 🚨 Solución de Problemas

### **Error: "role admin does not exist"**
```bash
# Ejecutar el script de configuración
npm run setup
```

### **Error: "database control_acc_DB does not exist"**
```bash
# Crear manualmente la base de datos
psql -U postgres
CREATE DATABASE control_acc_DB OWNER admin;
GRANT ALL PRIVILEGES ON DATABASE control_acc_DB TO admin;
\q
```

### **Error de conexión**
1. Verificar que PostgreSQL esté ejecutándose
2. Verificar credenciales en `.env`
3. Verificar que el puerto 5432 esté disponible

### **Error de permisos**
```bash
# Conectar como superusuario y conceder permisos
psql -U postgres -d control_acc_DB
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin;
\q
```

## 🐳 Usando Docker

Si prefieres usar Docker para PostgreSQL:

```bash
# Crear contenedor PostgreSQL
docker run --name controlacceso-db \
  -e POSTGRES_DB=control_acc_DB \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=password123 \
  -p 5432:5432 \
  -d postgres:15-alpine

# Verificar que esté corriendo
docker ps

# Conectar al contenedor
docker exec -it controlacceso-db psql -U admin -d control_acc_DB
```

## 📈 Monitoreo y Mantenimiento

### **Verificar Estado de la Base de Datos**
```bash
# Conectar y ver estadísticas
psql -U admin -d control_acc_DB -c "SELECT version();"
psql -U admin -d control_acc_DB -c "SELECT pg_size_pretty(pg_database_size('control_acc_DB'));"
```

### **Backup de la Base de Datos**
```bash
pg_dump -U admin -h localhost control_acc_DB > backup_$(date +%Y%m%d_%H%M%S).sql
```

### **Restaurar Base de Datos**
```bash
psql -U admin -d control_acc_DB < backup_file.sql
```

## 🔐 Seguridad

- **Contraseñas hasheadas** con bcrypt
- **Triggers de auditoría** automáticos
- **Validaciones** a nivel de base de datos
- **Índices optimizados** para consultas frecuentes
- **Constraints** para integridad de datos

## 📚 Recursos Adicionales

- [Documentación PostgreSQL](https://www.postgresql.org/docs/)
- [Guía de Sequelize](https://sequelize.org/docs/v6/)
- [Mejores Prácticas de Seguridad](https://www.postgresql.org/docs/current/security.html)

---

**Para soporte técnico, consulta la documentación principal del proyecto o crea un issue en GitHub.**





