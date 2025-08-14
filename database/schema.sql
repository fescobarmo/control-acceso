-- =====================================================
-- ESQUEMA DE BASE DE DATOS: CONTROL_ACC_DB
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
    permisos_especiales JSONB DEFAULT '{}',
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
    modulos_acceso TEXT[] DEFAULT '{}',
    restricciones_horarias JSONB DEFAULT '{"dias_semana": [1,2,3,4,5], "hora_inicio": "08:00", "hora_fin": "18:00"}',
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
    password_salt VARCHAR(100),
    rol_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    perfil_id INTEGER NOT NULL REFERENCES perfiles(id) ON DELETE RESTRICT,
    estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'bloqueado', 'pendiente')),
    ultimo_acceso TIMESTAMP,
    intentos_fallidos INTEGER DEFAULT 0,
    fecha_expiracion_password DATE,
    telefono VARCHAR(20),
    direccion TEXT,
    foto_perfil VARCHAR(255),
    metadata JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES usuarios(id),
    updated_by INTEGER REFERENCES usuarios(id)
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
    mac_address MACADDR,
    area_id INTEGER REFERENCES areas(id) ON DELETE SET NULL,
    estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'mantenimiento', 'error')),
    configuracion JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: permisos_acceso
-- =====================================================
CREATE TABLE IF NOT EXISTS permisos_acceso (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    area_id INTEGER NOT NULL REFERENCES areas(id) ON DELETE CASCADE,
    tipo_permiso VARCHAR(20) DEFAULT 'lectura' CHECK (tipo_permiso IN ('lectura', 'escritura', 'admin')),
    horario_inicio TIME DEFAULT '00:00:00',
    horario_fin TIME DEFAULT '23:59:59',
    dias_semana INTEGER[] DEFAULT '{1,2,3,4,5,6,7}',
    fecha_inicio DATE DEFAULT CURRENT_DATE,
    fecha_fin DATE,
    granted_by INTEGER REFERENCES usuarios(id),
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(usuario_id, area_id)
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
    ip_address INET,
    user_agent TEXT,
    resultado VARCHAR(20) DEFAULT 'exitoso' CHECK (resultado IN ('exitoso', 'denegado', 'error')),
    motivo_denegacion TEXT,
    metadata JSONB
);

-- =====================================================
-- TABLA: sesiones
-- =====================================================
CREATE TABLE IF NOT EXISTS sesiones (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    refresh_token VARCHAR(500),
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: auditoria
-- =====================================================
CREATE TABLE IF NOT EXISTS auditoria (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    accion VARCHAR(100) NOT NULL,
    tabla_afectada VARCHAR(100),
    registro_id INTEGER,
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para usuarios
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_username ON usuarios(username);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol_id ON usuarios(rol_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_perfil_id ON usuarios(perfil_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_estado ON usuarios(estado);
CREATE INDEX IF NOT EXISTS idx_usuarios_created_at ON usuarios(created_at);

-- Índices para logs de acceso
CREATE INDEX IF NOT EXISTS idx_logs_acceso_usuario_id ON logs_acceso(usuario_id);
CREATE INDEX IF NOT EXISTS idx_logs_acceso_area_id ON logs_acceso(area_id);
CREATE INDEX IF NOT EXISTS idx_logs_acceso_timestamp ON logs_acceso(timestamp);
CREATE INDEX IF NOT EXISTS idx_logs_acceso_tipo_acceso ON logs_acceso(tipo_acceso);

-- Índices para permisos
CREATE INDEX IF NOT EXISTS idx_permisos_acceso_usuario_id ON permisos_acceso(usuario_id);
CREATE INDEX IF NOT EXISTS idx_permisos_acceso_area_id ON permisos_acceso(area_id);

-- Índices para sesiones
CREATE INDEX IF NOT EXISTS idx_sesiones_usuario_id ON sesiones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_sesiones_token ON sesiones(token);
CREATE INDEX IF NOT EXISTS idx_sesiones_expires_at ON sesiones(expires_at);

-- Índices para auditoria
CREATE INDEX IF NOT EXISTS idx_auditoria_usuario_id ON auditoria(usuario_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_timestamp ON auditoria(timestamp);
CREATE INDEX IF NOT EXISTS idx_auditoria_accion ON auditoria(accion);

-- =====================================================
-- TRIGGERS PARA AUDITORÍA AUTOMÁTICA
-- =====================================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para auditoría automática
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO auditoria (usuario_id, accion, tabla_afectada, registro_id, datos_nuevos)
        VALUES (current_setting('app.current_user_id', true)::integer, 'INSERT', TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO auditoria (usuario_id, accion, tabla_afectada, registro_id, datos_anteriores, datos_nuevos)
        VALUES (current_setting('app.current_user_id', true)::integer, 'UPDATE', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO auditoria (usuario_id, accion, tabla_afectada, registro_id, datos_anteriores)
        VALUES (current_setting('app.current_user_id', true)::integer, 'DELETE', TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers
DROP TRIGGER IF EXISTS update_usuarios_updated_at ON usuarios;
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_roles_updated_at ON roles;
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_perfiles_updated_at ON perfiles;
CREATE TRIGGER update_perfiles_updated_at BEFORE UPDATE ON perfiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_areas_updated_at ON areas;
CREATE TRIGGER update_areas_updated_at BEFORE UPDATE ON areas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_dispositivos_updated_at ON dispositivos;
CREATE TRIGGER update_dispositivos_updated_at BEFORE UPDATE ON dispositivos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers de auditoría para tablas críticas
DROP TRIGGER IF EXISTS audit_usuarios_trigger ON usuarios;
CREATE TRIGGER audit_usuarios_trigger AFTER INSERT OR UPDATE OR DELETE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF EXISTS audit_permisos_acceso_trigger ON permisos_acceso;
CREATE TRIGGER audit_permisos_acceso_trigger AFTER INSERT OR UPDATE OR DELETE ON permisos_acceso
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF EXISTS audit_logs_acceso_trigger ON logs_acceso;
CREATE TRIGGER audit_logs_acceso_trigger AFTER INSERT OR UPDATE OR DELETE ON logs_acceso
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- =====================================================
-- DATOS INICIALES - ROLES COMPLETOS
-- =====================================================

-- Insertar roles básicos con información detallada
INSERT INTO roles (nombre, descripcion, nivel_acceso, permisos_especiales, color, icono) VALUES
('Super Administrador', 'Control total del sistema con acceso a todas las funcionalidades', 10, '{"all": true, "system_admin": true}', '#d32f2f', 'admin_panel_settings'),
('Administrador', 'Administración completa del sistema de control de acceso', 8, '{"users": true, "areas": true, "devices": true, "reports": true, "settings": true}', '#f57c00', 'security'),
('Gerente', 'Gestión de áreas y supervisión de personal', 7, '{"users": {"read": true, "write": true}, "areas": true, "reports": true, "analytics": true}', '#7b1fa2', 'supervisor_account'),
('Supervisor', 'Supervisión de áreas asignadas y gestión de personal', 6, '{"users": {"read": true}, "areas": {"read": true, "write": true}, "reports": {"read": true}}', '#1976d2', 'manage_accounts'),
('Coordinador', 'Coordinación de actividades y gestión de accesos', 5, '{"users": {"read": true}, "areas": {"read": true}, "access_control": true}', '#388e3c', 'group'),
('Usuario Avanzado', 'Usuario con acceso extendido a funcionalidades específicas', 4, '{"areas": {"read": true, "write": true}, "profile": true, "reports": {"read": true}}', '#ff9800', 'person_add'),
('Usuario Estándar', 'Usuario básico con acceso a áreas autorizadas', 3, '{"areas": {"read": true}, "profile": {"read": true, "write": true}}', '#2196f3', 'person'),
('Usuario Limitado', 'Usuario con acceso restringido a áreas específicas', 2, '{"areas": {"read": true}, "profile": {"read": true}}', '#9e9e9e', 'person_outline'),
('Invitado', 'Acceso temporal y limitado al sistema', 1, '{"areas": {"read": true, "temporary": true}}', '#757575', 'person_off'),
('Auditor', 'Solo lectura de reportes y logs del sistema', 2, '{"reports": {"read": true}, "logs": {"read": true}, "audit": true}', '#607d8b', 'assessment')
ON CONFLICT (nombre) DO NOTHING;

-- =====================================================
-- DATOS INICIALES - PERFILES COMPLETOS
-- =====================================================

-- Insertar perfiles básicos con permisos detallados
INSERT INTO perfiles (nombre, descripcion, permisos, nivel_seguridad, modulos_acceso, restricciones_horarias, color, icono) VALUES
('Super Administrador del Sistema', 'Control total del sistema con acceso a todas las funcionalidades y configuraciones', 
 '{"all": true, "system": true, "users": true, "areas": true, "devices": true, "reports": true, "settings": true, "audit": true}', 
 5, 
 '{"dashboard", "usuarios", "areas", "dispositivos", "reportes", "configuracion", "auditoria", "sistema"}',
 '{"dias_semana": [1,2,3,4,5,6,7], "hora_inicio": "00:00", "hora_fin": "23:59"}',
 '#d32f2f', 'admin_panel_settings'),

('Administrador del Sistema', 'Administración completa del sistema de control de acceso', 
 '{"users": true, "areas": true, "devices": true, "reports": true, "settings": true, "audit": {"read": true}}', 
 4, 
 '{"dashboard", "usuarios", "areas", "dispositivos", "reportes", "configuracion"}',
 '{"dias_semana": [1,2,3,4,5], "hora_inicio": "07:00", "hora_fin": "22:00"}',
 '#f57c00', 'security'),

('Gerente de Seguridad', 'Gestión de áreas de seguridad y supervisión de personal', 
 '{"users": {"read": true, "write": true}, "areas": true, "reports": true, "analytics": true, "access_control": true}', 
 4, 
 '{"dashboard", "usuarios", "areas", "reportes", "analiticas", "control_acceso"}',
 '{"dias_semana": [1,2,3,4,5], "hora_inicio": "06:00", "hora_fin": "23:00"}',
 '#7b1fa2', 'supervisor_account'),

('Supervisor de Área', 'Supervisión de áreas asignadas y gestión de personal', 
 '{"users": {"read": true}, "areas": {"read": true, "write": true}, "reports": {"read": true}, "access_control": {"read": true}}', 
 3, 
 '{"dashboard", "usuarios", "areas", "reportes", "control_acceso"}',
 '{"dias_semana": [1,2,3,4,5], "hora_inicio": "07:00", "hora_fin": "20:00"}',
 '#1976d2', 'manage_accounts'),

('Coordinador de Accesos', 'Coordinación de actividades y gestión de accesos', 
 '{"users": {"read": true}, "areas": {"read": true}, "access_control": true, "reports": {"read": true}}', 
 3, 
 '{"dashboard", "usuarios", "areas", "control_acceso", "reportes"}',
 '{"dias_semana": [1,2,3,4,5], "hora_inicio": "08:00", "hora_fin": "18:00"}',
 '#388e3c', 'group'),

('Usuario Avanzado', 'Usuario con acceso extendido a funcionalidades específicas', 
 '{"areas": {"read": true, "write": true}, "profile": true, "reports": {"read": true}, "dashboard": true}', 
 2, 
 '{"dashboard", "areas", "perfil", "reportes"}',
 '{"dias_semana": [1,2,3,4,5], "hora_inicio": "08:00", "hora_fin": "18:00"}',
 '#ff9800', 'person_add'),

('Usuario Estándar', 'Usuario básico con acceso a áreas autorizadas', 
 '{"areas": {"read": true}, "profile": {"read": true, "write": true}, "dashboard": true}', 
 2, 
 '{"dashboard", "areas", "perfil"}',
 '{"dias_semana": [1,2,3,4,5], "hora_inicio": "08:00", "hora_fin": "18:00"}',
 '#2196f3', 'person'),

('Usuario Limitado', 'Usuario con acceso restringido a áreas específicas', 
 '{"areas": {"read": true}, "profile": {"read": true}, "dashboard": true}', 
 1, 
 '{"dashboard", "areas", "perfil"}',
 '{"dias_semana": [1,2,3,4,5], "hora_inicio": "09:00", "hora_fin": "17:00"}',
 '#9e9e9e', 'person_outline'),

('Invitado Temporal', 'Acceso temporal y limitado al sistema', 
 '{"areas": {"read": true, "temporary": true}, "profile": {"read": true}}', 
 1, 
 '{"areas", "perfil"}',
 '{"dias_semana": [1,2,3,4,5], "hora_inicio": "09:00", "hora_fin": "17:00"}',
 '#757575', 'person_off'),

('Auditor del Sistema', 'Solo lectura de reportes y logs del sistema', 
 '{"reports": {"read": true}, "logs": {"read": true}, "audit": true, "dashboard": true}', 
 2, 
 '{"dashboard", "reportes", "logs", "auditoria"}',
 '{"dias_semana": [1,2,3,4,5], "hora_inicio": "08:00", "hora_fin": "18:00"}',
 '#607d8b', 'assessment')
ON CONFLICT (nombre) DO NOTHING;

-- =====================================================
-- DATOS INICIALES - USUARIO ADMINISTRADOR
-- =====================================================

-- Insertar usuario administrador por defecto
INSERT INTO usuarios (nombre, apellido, email, username, password_hash, rol_id, perfil_id, estado) VALUES
('Admin', 'Sistema', 'admin@controlacceso.com', 'admin', '$2a$10$rQZ8N3YqX9K2M1L4P7O6Q5R4S3T2U1V0W9X8Y7Z6A5B4C3D2E1F0G9H8I7J6K5L4M3N2O1P0Q9R8S7T6U5V4W3X2Y1Z0', 2, 2, 'activo')
ON CONFLICT (username) DO NOTHING;

-- =====================================================
-- DATOS INICIALES - ÁREAS BÁSICAS
-- =====================================================

-- Insertar áreas básicas
INSERT INTO areas (nombre, descripcion, ubicacion, nivel_acceso) VALUES
('Oficina Principal', 'Área principal de oficinas administrativas', 'Planta Baja - Ala Norte', 1),
('Sala de Reuniones', 'Sala para reuniones y presentaciones ejecutivas', 'Planta Baja - Centro', 2),
('Laboratorio de Investigación', 'Área de laboratorio con equipos especializados', 'Planta Alta - Ala Este', 3),
('Centro de Datos', 'Sala de servidores y equipos de cómputo', 'Sótano - Nivel 1', 4),
('Almacén de Materiales', 'Área de almacenamiento de materiales y suministros', 'Sótano - Nivel 2', 3),
('Estacionamiento Empleados', 'Estacionamiento exclusivo para empleados', 'Exterior - Nivel 0', 1),
('Área de Descanso', 'Zona de descanso y cafetería', 'Planta Baja - Ala Sur', 1),
('Sala de Capacitación', 'Sala para entrenamientos y capacitaciones', 'Planta Alta - Ala Oeste', 2),
('Oficinas Ejecutivas', 'Oficinas privadas para ejecutivos', 'Planta Alta - Centro', 3),
('Área de Mantenimiento', 'Zona de mantenimiento y servicios técnicos', 'Sótano - Nivel 3', 4)
ON CONFLICT (nombre) DO NOTHING;

-- =====================================================
-- DATOS INICIALES - DISPOSITIVOS BÁSICOS
-- =====================================================

-- Insertar dispositivos básicos
INSERT INTO dispositivos (nombre, tipo, modelo, ubicacion, area_id, ip_address) VALUES
('Lector Principal', 'card_reader', 'HID ProxCard II Plus', 'Entrada Principal', 1, '192.168.1.100'),
('Lector Secundario', 'card_reader', 'HID ProxCard II Plus', 'Entrada Secundaria', 2, '192.168.1.101'),
('Terminal Administrativo', 'computer', 'Dell OptiPlex 7090', 'Oficina Administrativa', 1, '192.168.1.50'),
('Lector de Laboratorio', 'card_reader', 'HID iCLASS SE', 'Entrada Laboratorio', 3, '192.168.1.102'),
('Terminal de Datos', 'computer', 'HP EliteDesk 800', 'Centro de Datos', 4, '192.168.1.51'),
('Lector de Almacén', 'card_reader', 'HID ProxCard II', 'Entrada Almacén', 5, '192.168.1.103'),
('Lector de Estacionamiento', 'card_reader', 'HID ProxCard II', 'Entrada Estacionamiento', 6, '192.168.1.104'),
('Terminal de Recepción', 'computer', 'Lenovo ThinkCentre M90', 'Recepción', 1, '192.168.1.52'),
('Lector Ejecutivo', 'card_reader', 'HID iCLASS SE', 'Entrada Ejecutiva', 9, '192.168.1.105'),
('Terminal de Mantenimiento', 'computer', 'Dell OptiPlex 3080', 'Área Mantenimiento', 10, '192.168.1.53')
ON CONFLICT DO NOTHING;

-- =====================================================
-- DATOS INICIALES - CONFIGURACIÓN DEL SISTEMA
-- =====================================================

-- Insertar configuración del sistema
INSERT INTO configuracion_sistema (clave, valor, descripcion, tipo) VALUES
('session_timeout', '3600', 'Tiempo de sesión en segundos', 'integer'),
('max_login_attempts', '5', 'Máximo de intentos de login', 'integer'),
('password_expiry_days', '90', 'Días de expiración de contraseña', 'integer'),
('system_name', 'ControlAcceso Pro', 'Nombre del sistema', 'string'),
('maintenance_mode', 'false', 'Modo mantenimiento', 'boolean'),
('default_user_role', '8', 'ID del rol por defecto para nuevos usuarios', 'integer'),
('default_user_profile', '7', 'ID del perfil por defecto para nuevos usuarios', 'integer'),
('max_users_per_page', '25', 'Máximo de usuarios por página en listados', 'integer'),
('enable_audit_logs', 'true', 'Habilitar logs de auditoría', 'boolean'),
('backup_frequency_hours', '24', 'Frecuencia de respaldos en horas', 'integer')
ON CONFLICT (clave) DO NOTHING;

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista de usuarios con información completa
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

-- Vista de accesos recientes
DROP VIEW IF EXISTS v_accesos_recientes;
CREATE VIEW v_accesos_recientes AS
SELECT 
    la.id,
    la.timestamp,
    la.tipo_acceso,
    la.resultado,
    u.nombre || ' ' || u.apellido as usuario_nombre,
    u.username,
    r.nombre as rol_nombre,
    a.nombre as area_nombre,
    d.nombre as dispositivo_nombre
FROM logs_acceso la
JOIN usuarios u ON la.usuario_id = u.id
JOIN roles r ON u.rol_id = r.id
JOIN areas a ON la.area_id = a.id
LEFT JOIN dispositivos d ON la.dispositivo_id = d.id
WHERE la.timestamp >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY la.timestamp DESC;

-- Vista de permisos por usuario
DROP VIEW IF EXISTS v_permisos_usuario;
CREATE VIEW v_permisos_usuario AS
SELECT 
    u.id as usuario_id,
    u.nombre || ' ' || u.apellido as usuario_nombre,
    u.username,
    r.nombre as rol_nombre,
    p.nombre as perfil_nombre,
    p.permisos as perfil_permisos,
    pa.area_id,
    a.nombre as area_nombre,
    pa.tipo_permiso,
    pa.horario_inicio,
    pa.horario_fin,
    pa.dias_semana
FROM usuarios u
JOIN roles r ON u.rol_id = r.id
JOIN perfiles p ON u.perfil_id = p.id
LEFT JOIN permisos_acceso pa ON u.id = pa.usuario_id
LEFT JOIN areas a ON pa.area_id = a.id
WHERE u.is_active = true AND pa.is_active = true;

-- =====================================================
-- FUNCIONES ÚTILES
-- =====================================================

-- Función para obtener permisos de un usuario
CREATE OR REPLACE FUNCTION get_user_permissions(user_id INTEGER)
RETURNS TABLE(area_id INTEGER, area_nombre VARCHAR, tipo_permiso VARCHAR) AS $$
BEGIN
    RETURN QUERY
    SELECT pa.area_id, a.nombre, pa.tipo_permiso
    FROM permisos_acceso pa
    JOIN areas a ON pa.area_id = a.id
    WHERE pa.usuario_id = user_id 
    AND pa.is_active = true
    AND (pa.fecha_fin IS NULL OR pa.fecha_fin >= CURRENT_DATE);
END;
$$ LANGUAGE plpgsql;

-- Función para verificar acceso de usuario
CREATE OR REPLACE FUNCTION check_user_access(
    p_user_id INTEGER,
    p_area_id INTEGER,
    p_tipo_acceso VARCHAR DEFAULT 'lectura'
)
RETURNS BOOLEAN AS $$
DECLARE
    v_permiso VARCHAR;
    v_hora_actual TIME;
    v_dia_semana INTEGER;
BEGIN
    -- Obtener permiso del usuario
    SELECT tipo_permiso INTO v_permiso
    FROM permisos_acceso
    WHERE usuario_id = p_user_id 
    AND area_id = p_area_id
    AND is_active = true
    AND (fecha_fin IS NULL OR fecha_fin >= CURRENT_DATE);
    
    IF v_permiso IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Verificar horario
    v_hora_actual := CURRENT_TIME;
    v_dia_semana := EXTRACT(DOW FROM CURRENT_DATE) + 1;
    
    -- Verificar si está en el horario permitido
    SELECT EXISTS(
        SELECT 1 FROM permisos_acceso
        WHERE usuario_id = p_user_id 
        AND area_id = p_area_id
        AND is_active = true
        AND (fecha_fin IS NULL OR fecha_fin >= CURRENT_DATE)
        AND v_hora_actual BETWEEN horario_inicio AND horario_fin
        AND v_dia_semana = ANY(dias_semana)
    ) INTO v_permiso;
    
    RETURN v_permiso;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener estadísticas de usuarios por rol
CREATE OR REPLACE FUNCTION get_users_by_role_stats()
RETURNS TABLE(rol_nombre VARCHAR, total_usuarios BIGINT, usuarios_activos BIGINT, usuarios_inactivos BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.nombre,
        COUNT(u.id) as total_usuarios,
        COUNT(CASE WHEN u.estado = 'activo' THEN 1 END) as usuarios_activos,
        COUNT(CASE WHEN u.estado != 'activo' THEN 1 END) as usuarios_inactivos
    FROM roles r
    LEFT JOIN usuarios u ON r.id = u.rol_id AND u.is_active = true
    WHERE r.is_active = true
    GROUP BY r.id, r.nombre
    ORDER BY r.nivel_acceso DESC;
END;
$$ LANGUAGE plpgsql;
