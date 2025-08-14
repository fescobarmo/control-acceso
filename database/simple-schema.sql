-- =====================================================
-- ESQUEMA SIMPLIFICADO PARA CONTROL_ACC_DB
-- Sistema de Control de Acceso
-- =====================================================

-- Crear extensión para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLA: roles
-- =====================================================
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    nivel_acceso INTEGER NOT NULL DEFAULT 1,
    color VARCHAR(7) DEFAULT '#1976d2',
    icono VARCHAR(50) DEFAULT 'person',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: perfiles
-- =====================================================
CREATE TABLE IF NOT EXISTS perfiles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    permisos JSONB NOT NULL DEFAULT '{}',
    nivel_seguridad INTEGER NOT NULL DEFAULT 1,
    color VARCHAR(7) DEFAULT '#1976d2',
    icono VARCHAR(50) DEFAULT 'security',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: usuarios
-- =====================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    perfil_id INTEGER NOT NULL REFERENCES perfiles(id) ON DELETE RESTRICT,
    estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'bloqueado', 'pendiente')),
    ultimo_acceso TIMESTAMP,
    telefono VARCHAR(20),
    direccion TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: areas
-- =====================================================
CREATE TABLE IF NOT EXISTS areas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    ubicacion VARCHAR(255),
    nivel_acceso INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: dispositivos
-- =====================================================
CREATE TABLE IF NOT EXISTS dispositivos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    modelo VARCHAR(100),
    ubicacion VARCHAR(255),
    ip_address INET,
    area_id INTEGER REFERENCES areas(id) ON DELETE SET NULL,
    estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'mantenimiento', 'error')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: logs_acceso
-- =====================================================
CREATE TABLE IF NOT EXISTS logs_acceso (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    area_id INTEGER NOT NULL REFERENCES areas(id) ON DELETE CASCADE,
    dispositivo_id INTEGER REFERENCES dispositivos(id) ON DELETE SET NULL,
    tipo_acceso VARCHAR(20) NOT NULL CHECK (tipo_acceso IN ('entrada', 'salida', 'denegado', 'error')),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resultado VARCHAR(20) DEFAULT 'exitoso' CHECK (resultado IN ('exitoso', 'denegado', 'error'))
);

-- =====================================================
-- TABLA: configuracion_sistema
-- =====================================================
CREATE TABLE IF NOT EXISTS configuracion_sistema (
    id SERIAL PRIMARY KEY,
    clave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT,
    descripcion TEXT,
    tipo VARCHAR(50) DEFAULT 'string',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ÍNDICES BÁSICOS
-- =====================================================

-- Índices para usuarios
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_username ON usuarios(username);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol_id ON usuarios(rol_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_perfil_id ON usuarios(perfil_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_estado ON usuarios(estado);

-- Índices para logs de acceso
CREATE INDEX IF NOT EXISTS idx_logs_acceso_usuario_id ON logs_acceso(usuario_id);
CREATE INDEX IF NOT EXISTS idx_logs_acceso_area_id ON logs_acceso(area_id);
CREATE INDEX IF NOT EXISTS idx_logs_acceso_timestamp ON logs_acceso(timestamp);

-- =====================================================
-- DATOS INICIALES - ROLES
-- =====================================================

INSERT INTO roles (nombre, descripcion, nivel_acceso, color, icono) VALUES
('Super Administrador', 'Control total del sistema', 10, '#d32f2f', 'admin_panel_settings'),
('Administrador', 'Administración del sistema', 8, '#f57c00', 'security'),
('Gerente', 'Gestión de áreas y personal', 7, '#7b1fa2', 'supervisor_account'),
('Supervisor', 'Supervisión de áreas', 6, '#1976d2', 'manage_accounts'),
('Coordinador', 'Coordinación de actividades', 5, '#388e3c', 'group'),
('Usuario Avanzado', 'Acceso extendido', 4, '#ff9800', 'person_add'),
('Usuario Estándar', 'Acceso básico', 3, '#2196f3', 'person'),
('Usuario Limitado', 'Acceso restringido', 2, '#9e9e9e', 'person_outline'),
('Invitado', 'Acceso temporal', 1, '#757575', 'person_off'),
('Auditor', 'Solo lectura', 2, '#607d8b', 'assessment')
ON CONFLICT (nombre) DO NOTHING;

-- =====================================================
-- DATOS INICIALES - PERFILES
-- =====================================================

INSERT INTO perfiles (nombre, descripcion, permisos, nivel_seguridad, color, icono) VALUES
('Super Administrador del Sistema', 'Control total del sistema', 
 '{"all": true, "system": true, "users": true, "areas": true, "devices": true, "reports": true}', 
 5, '#d32f2f', 'admin_panel_settings'),

('Administrador del Sistema', 'Administración completa', 
 '{"users": true, "areas": true, "devices": true, "reports": true, "settings": true}', 
 4, '#f57c00', 'security'),

('Gerente de Seguridad', 'Gestión de seguridad', 
 '{"users": {"read": true, "write": true}, "areas": true, "reports": true}', 
 4, '#7b1fa2', 'supervisor_account'),

('Supervisor de Área', 'Supervisión de áreas', 
 '{"users": {"read": true}, "areas": {"read": true, "write": true}, "reports": {"read": true}}', 
 3, '#1976d2', 'manage_accounts'),

('Coordinador de Accesos', 'Coordinación de accesos', 
 '{"users": {"read": true}, "areas": {"read": true}, "access_control": true}', 
 3, '#388e3c', 'group'),

('Usuario Avanzado', 'Acceso extendido', 
 '{"areas": {"read": true, "write": true}, "profile": true, "reports": {"read": true}}', 
 2, '#ff9800', 'person_add'),

('Usuario Estándar', 'Acceso básico', 
 '{"areas": {"read": true}, "profile": {"read": true, "write": true}}', 
 2, '#2196f3', 'person'),

('Usuario Limitado', 'Acceso restringido', 
 '{"areas": {"read": true}, "profile": {"read": true}}', 
 1, '#9e9e9e', 'person_outline'),

('Invitado Temporal', 'Acceso temporal', 
 '{"areas": {"read": true, "temporary": true}, "profile": {"read": true}}', 
 1, '#757575', 'person_off'),

('Auditor del Sistema', 'Solo lectura', 
 '{"reports": {"read": true}, "logs": {"read": true}, "audit": true}', 
 2, '#607d8b', 'assessment')
ON CONFLICT (nombre) DO NOTHING;

-- =====================================================
-- DATOS INICIALES - USUARIO ADMIN
-- =====================================================

INSERT INTO usuarios (nombre, apellido, email, username, password_hash, rol_id, perfil_id, estado) VALUES
('Admin', 'Sistema', 'admin@controlacceso.com', 'admin', '$2a$10$rQZ8N3YqX9K2M1L4P7O6Q5R4S3T2U1V0W9X8Y7Z6A5B4C3D2E1F0G9H8I7J6K5L4M3N2O1P0Q9R8S7T6U5V4W3X2Y1Z0', 2, 2, 'activo')
ON CONFLICT (username) DO NOTHING;

-- =====================================================
-- DATOS INICIALES - ÁREAS
-- =====================================================

INSERT INTO areas (nombre, descripcion, ubicacion, nivel_acceso) VALUES
('Oficina Principal', 'Área principal de oficinas', 'Planta Baja - Ala Norte', 1),
('Sala de Reuniones', 'Sala para reuniones', 'Planta Baja - Centro', 2),
('Laboratorio', 'Área de laboratorio', 'Planta Alta - Ala Este', 3),
('Centro de Datos', 'Sala de servidores', 'Sótano - Nivel 1', 4),
('Almacén', 'Área de almacenamiento', 'Sótano - Nivel 2', 3),
('Estacionamiento', 'Estacionamiento empleados', 'Exterior - Nivel 0', 1),
('Área de Descanso', 'Zona de descanso', 'Planta Baja - Ala Sur', 1),
('Sala de Capacitación', 'Sala para entrenamientos', 'Planta Alta - Ala Oeste', 2),
('Oficinas Ejecutivas', 'Oficinas privadas', 'Planta Alta - Centro', 3),
('Área de Mantenimiento', 'Zona de mantenimiento', 'Sótano - Nivel 3', 4)
ON CONFLICT (nombre) DO NOTHING;

-- =====================================================
-- DATOS INICIALES - DISPOSITIVOS
-- =====================================================

INSERT INTO dispositivos (nombre, tipo, modelo, ubicacion, area_id, ip_address) VALUES
('Lector Principal', 'card_reader', 'HID ProxCard II Plus', 'Entrada Principal', 1, '192.168.1.100'),
('Lector Secundario', 'card_reader', 'HID ProxCard II Plus', 'Entrada Secundaria', 2, '192.168.1.101'),
('Terminal Admin', 'computer', 'Dell OptiPlex 7090', 'Oficina Administrativa', 1, '192.168.1.50'),
('Lector de Laboratorio', 'card_reader', 'HID iCLASS SE', 'Entrada Laboratorio', 3, '192.168.1.102'),
('Terminal de Datos', 'computer', 'HP EliteDesk 800', 'Centro de Datos', 4, '192.168.1.51')
ON CONFLICT DO NOTHING;

-- =====================================================
-- DATOS INICIALES - CONFIGURACIÓN
-- =====================================================

INSERT INTO configuracion_sistema (clave, valor, descripcion, tipo) VALUES
('session_timeout', '3600', 'Tiempo de sesión en segundos', 'integer'),
('max_login_attempts', '5', 'Máximo de intentos de login', 'integer'),
('password_expiry_days', '90', 'Días de expiración de contraseña', 'integer'),
('system_name', 'ControlAcceso Pro', 'Nombre del sistema', 'string'),
('maintenance_mode', 'false', 'Modo mantenimiento', 'boolean')
ON CONFLICT (clave) DO NOTHING;

-- =====================================================
-- VISTA SIMPLE
-- =====================================================

DROP VIEW IF EXISTS v_usuarios_completos;
CREATE VIEW v_usuarios_completos AS
SELECT 
    u.id,
    u.uuid,
    u.nombre,
    u.apellido,
    u.email,
    u.username,
    u.estado,
    u.ultimo_acceso,
    u.created_at,
    u.updated_at,
    r.nombre as rol_nombre,
    r.nivel_acceso as rol_nivel,
    r.color as rol_color,
    r.icono as rol_icono,
    p.nombre as perfil_nombre,
    p.permisos as perfil_permisos,
    p.nivel_seguridad as perfil_nivel_seguridad,
    p.color as perfil_color,
    p.icono as perfil_icono
FROM usuarios u
JOIN roles r ON u.rol_id = r.id
JOIN perfiles p ON u.perfil_id = p.id
WHERE u.is_active = true;





