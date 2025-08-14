-- Script para insertar 5 registros de ejemplo en la tabla visitas
-- Ejecutar como usuario admin en la base de datos control_acc_DB

INSERT INTO visitas (
    nombre, 
    apellido, 
    apellido_paterno, 
    apellido_materno, 
    documento, 
    departamento, 
    ingreso_vehiculo, 
    fecha_ingreso, 
    fecha_salida, 
    estado, 
    observaciones, 
    created_by, 
    updated_by, 
    created_at, 
    updated_at
) VALUES 
-- Registro 1: Visitante con vehículo
(
    'María Elena',
    'González',
    'González',
    'Rodríguez',
    '12345678-9',
    'Recursos Humanos',
    true,
    '2025-08-14 08:30:00',
    '2025-08-14 17:00:00',
    'salida',
    'Entrevista de trabajo para puesto de Analista de RRHH',
    1,
    1,
    NOW(),
    NOW()
),

-- Registro 2: Visitante sin vehículo
(
    'Carlos Alberto',
    'Martínez',
    'Martínez',
    'Silva',
    '98765432-1',
    'Tecnología',
    false,
    '2025-08-14 09:15:00',
    NULL,
    'ingreso',
    'Reunión de consultoría sobre implementación de sistema ERP',
    1,
    1,
    NOW(),
    NOW()
),

-- Registro 3: Visitante con vehículo
(
    'Ana Patricia',
    'López',
    'López',
    'Fernández',
    '45678912-3',
    'Finanzas',
    true,
    '2025-08-14 10:00:00',
    '2025-08-14 16:30:00',
    'salida',
    'Auditoría financiera trimestral',
    1,
    1,
    NOW(),
    NOW()
),

-- Registro 4: Visitante sin vehículo
(
    'Roberto José',
    'Hernández',
    'Hernández',
    'Morales',
    '78912345-6',
    'Operaciones',
    false,
    '2025-08-14 11:30:00',
    NULL,
    'ingreso',
    'Capacitación del personal en procedimientos de seguridad',
    1,
    1,
    NOW(),
    NOW()
),

-- Registro 5: Visitante con vehículo
(
    'Laura Isabel',
    'Ramírez',
    'Ramírez',
    'Vargas',
    '32165498-7',
    'Marketing',
    true,
    '2025-08-14 13:00:00',
    '2025-08-14 18:00:00',
    'salida',
    'Presentación de nueva campaña publicitaria',
    1,
    1,
    NOW(),
    NOW()
);

-- Verificar que se insertaron correctamente
SELECT 
    id,
    nombre,
    apellido,
    apellido_paterno,
    apellido_materno,
    documento,
    departamento,
    ingreso_vehiculo,
    fecha_ingreso,
    fecha_salida,
    estado,
    observaciones
FROM visitas 
ORDER BY fecha_ingreso DESC 
LIMIT 5;
