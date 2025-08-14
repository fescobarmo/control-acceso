# Especificación de la API - ControlAcceso

## Información General

- **Base URL**: `http://localhost:3001/api`
- **Versión**: v1.0
- **Formato**: JSON
- **Autenticación**: JWT Bearer Token

## Autenticación

### Headers Requeridos
```
Authorization: Bearer <token>
Content-Type: application/json
```

## Endpoints

### Autenticación

#### POST /auth/login
Iniciar sesión de usuario.

**Request Body:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

#### POST /auth/register
Registrar nuevo usuario.

**Request Body:**
```json
{
  "username": "nuevo_usuario",
  "email": "usuario@ejemplo.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "user": {
    "username": "nuevo_usuario",
    "email": "usuario@ejemplo.com"
  }
}
```

#### POST /auth/logout
Cerrar sesión.

**Response (200):**
```json
{
  "success": true,
  "message": "Logout exitoso"
}
```

#### GET /auth/me
Obtener información del usuario actual.

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@controlacceso.com",
    "role": "admin"
  }
}
```

### Usuarios

#### GET /users
Obtener lista de usuarios.

**Query Parameters:**
- `page` (number): Número de página
- `limit` (number): Elementos por página
- `role` (string): Filtrar por rol

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "admin",
      "email": "admin@controlacceso.com",
      "role": "admin",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

#### GET /users/:id
Obtener usuario por ID.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "admin",
    "email": "admin@controlacceso.com",
    "role": "admin",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### POST /users
Crear nuevo usuario.

**Request Body:**
```json
{
  "username": "nuevo_usuario",
  "email": "usuario@ejemplo.com",
  "password": "password123",
  "role": "user"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Usuario creado exitosamente",
  "data": {
    "id": 2,
    "username": "nuevo_usuario",
    "email": "usuario@ejemplo.com",
    "role": "user"
  }
}
```

#### PUT /users/:id
Actualizar usuario.

**Request Body:**
```json
{
  "username": "usuario_actualizado",
  "email": "nuevo@email.com",
  "role": "supervisor"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Usuario actualizado exitosamente",
  "data": {
    "id": 2,
    "username": "usuario_actualizado",
    "email": "nuevo@email.com",
    "role": "supervisor"
  }
}
```

#### DELETE /users/:id
Eliminar usuario.

**Response (200):**
```json
{
  "success": true,
  "message": "Usuario eliminado exitosamente"
}
```

### Control de Acceso

#### GET /access
Obtener lista de accesos.

**Query Parameters:**
- `page` (number): Número de página
- `limit` (number): Elementos por página
- `user_id` (number): Filtrar por usuario
- `area_id` (number): Filtrar por área
- `type` (string): Filtrar por tipo (entrada/salida)
- `start_date` (string): Fecha de inicio (ISO)
- `end_date` (string): Fecha de fin (ISO)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "area_id": 1,
      "access_type": "entrada",
      "timestamp": "2024-01-01T10:00:00Z",
      "device_id": "LECTOR_001",
      "notes": "Acceso normal",
      "user": {
        "username": "admin"
      },
      "area": {
        "name": "Oficina Principal"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

#### GET /access/:id
Obtener acceso por ID.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "area_id": 1,
    "access_type": "entrada",
    "timestamp": "2024-01-01T10:00:00Z",
    "device_id": "LECTOR_001",
    "notes": "Acceso normal"
  }
}
```

#### POST /access
Registrar nuevo acceso.

**Request Body:**
```json
{
  "user_id": 1,
  "area_id": 1,
  "access_type": "entrada",
  "device_id": "LECTOR_001",
  "notes": "Acceso normal"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Acceso registrado exitosamente",
  "data": {
    "id": 1,
    "user_id": 1,
    "area_id": 1,
    "access_type": "entrada",
    "timestamp": "2024-01-01T10:00:00Z",
    "device_id": "LECTOR_001",
    "notes": "Acceso normal"
  }
}
```

#### GET /access/user/:userId
Obtener accesos de un usuario específico.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "area_id": 1,
      "access_type": "entrada",
      "timestamp": "2024-01-01T10:00:00Z",
      "area": {
        "name": "Oficina Principal"
      }
    }
  ]
}
```

## Códigos de Error

### 400 - Bad Request
```json
{
  "success": false,
  "message": "Datos inválidos",
  "errors": [
    {
      "field": "username",
      "message": "El usuario es requerido"
    }
  ]
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "message": "Credenciales inválidas"
}
```

### 403 - Forbidden
```json
{
  "success": false,
  "message": "No tienes permisos para realizar esta acción"
}
```

### 404 - Not Found
```json
{
  "success": false,
  "message": "Recurso no encontrado"
}
```

### 500 - Internal Server Error
```json
{
  "success": false,
  "message": "Error interno del servidor"
}
```

## Rate Limiting

- **Límite**: 100 requests por minuto por IP
- **Headers de respuesta**:
  - `X-RateLimit-Limit`: Límite de requests
  - `X-RateLimit-Remaining`: Requests restantes
  - `X-RateLimit-Reset`: Tiempo de reset

## Paginación

Todos los endpoints que devuelven listas soportan paginación:

**Query Parameters:**
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10, max: 100)

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```





