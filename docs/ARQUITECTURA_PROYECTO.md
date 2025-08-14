# 📋 Documentación de Arquitectura - Sistema de Control de Acceso

## 🏗️ Arquitectura General del Sistema

### Diagrama de Arquitectura de Alto Nivel

```mermaid
graph TB
    subgraph "Frontend (React.js)"
        A[React App] --> B[Components]
        B --> C[Pages]
        B --> D[Layout]
        B --> E[Contexts]
    end
    
    subgraph "Backend (Node.js/Express)"
        F[Express Server] --> G[Controllers]
        F --> H[Routes]
        F --> I[Models]
        F --> J[Middleware]
    end
    
    subgraph "Base de Datos"
        K[PostgreSQL]
    end
    
    subgraph "Autenticación"
        L[JWT Tokens]
    end
    
    A <--> F
    F <--> K
    F <--> L
    
    style A fill:#61dafb
    style F fill:#68a063
    style K fill:#336791
    style L fill:#f7df1e
```

## 🗂️ Estructura de Directorios

### Estructura Completa del Proyecto

```mermaid
graph TD
    A[ControlAcceso/] --> B[frontend/]
    A --> C[backend/]
    A --> D[database/]
    A --> E[docs/]
    
    B --> B1[src/]
    B1 --> B2[components/]
    B1 --> B3[contexts/]
    B1 --> B4[config/]
    B1 --> B5[utils/]
    
    B2 --> B2A[Layout.js]
    B2 --> B2B[Login.js]
    B2 --> B2C[Dashboard.js]
    B2 --> B2D[ProtectedRoute.js]
    B2 --> B2E[usuarios/]
    B2 --> B2F[visitas/]
    B2 --> B2G[Visita_Externa/]
    B2 --> B2H[propietarios/]
    
    C --> C1[src/]
    C1 --> C2[controllers/]
    C1 --> C3[models/]
    C1 --> C4[routes/]
    C1 --> C5[middleware/]
    C1 --> C6[seeds/]
    C1 --> C7[config/]
    
    C2 --> C2A[authController.js]
    C2 --> C2B[userController.js]
    C2 --> C2C[visitaController.js]
    C2 --> C2D[visitaExternaController.js]
    C2 --> C2E[accessController.js]
    
    C3 --> C3A[User.js]
    C3 --> C3B[Role.js]
    C3 --> C3C[Profile.js]
    C3 --> C3D[Visita.js]
    C3 --> C3E[VisitaExterna.js]
    C3 --> C3F[Area.js]
    C3 --> C3G[Device.js]
    C3 --> C3H[AccessLog.js]
    C3 --> C3I[AccessPermission.js]
    C3 --> C3J[Session.js]
    C3 --> C3K[Audit.js]
    C3 --> C3L[SystemConfig.js]
    
    style A fill:#ff6b6b
    style B fill:#4ecdc4
    style C fill:#45b7d1
    style D fill:#96ceb4
    style E fill:#feca57
```

## 🗄️ Modelo de Datos

### Diagrama Entidad-Relación

```mermaid
erDiagram
    USERS {
        int id PK
        string username
        string email
        string password_hash
        string first_name
        string last_name
        string status
        int role_id FK
        int profile_id FK
        int area_id FK
        int created_by FK
        int updated_by FK
        timestamp created_at
        timestamp updated_at
    }
    
    ROLES {
        int id PK
        string name
        string description
        json permissions
        timestamp created_at
        timestamp updated_at
    }
    
    PROFILES {
        int id PK
        string name
        string description
        json settings
        timestamp created_at
        timestamp updated_at
    }
    
    AREAS {
        int id PK
        string name
        string description
        string location
        int capacity
        timestamp created_at
        timestamp updated_at
    }
    
    VISITAS {
        int id PK
        string nombre
        string apellido_paterno
        string apellido_materno
        string documento
        string motivo
        string ubicacion
        string vehiculo
        string placa
        string estado
        timestamp fecha_entrada
        timestamp fecha_salida
        int created_by FK
        int updated_by FK
        timestamp created_at
        timestamp updated_at
    }
    
    VISITAS_EXTERNAS {
        int id PK
        string nombre
        string apellido_paterno
        string apellido_materno
        string documento
        string empresa
        string motivo
        string ubicacion
        string vehiculo
        string placa
        string estado
        timestamp fecha_entrada
        timestamp fecha_salida
        int created_by FK
        int updated_by FK
        timestamp created_at
        timestamp updated_at
    }
    
    DEVICES {
        int id PK
        string name
        string type
        string location
        string status
        json configuration
        timestamp created_at
        timestamp updated_at
    }
    
    ACCESS_LOGS {
        int id PK
        int user_id FK
        int device_id FK
        int area_id FK
        string action
        timestamp timestamp
        json metadata
    }
    
    ACCESS_PERMISSIONS {
        int id PK
        int user_id FK
        int area_id FK
        string permission_type
        timestamp valid_from
        timestamp valid_until
        timestamp created_at
        timestamp updated_at
    }
    
    SESSIONS {
        int id PK
        int user_id FK
        string token
        timestamp expires_at
        timestamp created_at
    }
    
    AUDIT_LOGS {
        int id PK
        int user_id FK
        string action
        string table_name
        int record_id
        json old_values
        json new_values
        timestamp created_at
    }
    
    SYSTEM_CONFIG {
        int id PK
        string key
        string value
        string description
        timestamp created_at
        timestamp updated_at
    }
    
    USERS ||--o{ ROLES : "belongs to"
    USERS ||--o{ PROFILES : "has"
    USERS ||--o{ AREAS : "assigned to"
    USERS ||--o{ VISITAS : "creates"
    USERS ||--o{ VISITAS_EXTERNAS : "creates"
    USERS ||--o{ ACCESS_LOGS : "generates"
    USERS ||--o{ ACCESS_PERMISSIONS : "has"
    USERS ||--o{ SESSIONS : "has"
    USERS ||--o{ AUDIT_LOGS : "creates"
    DEVICES ||--o{ ACCESS_LOGS : "records"
    AREAS ||--o{ ACCESS_LOGS : "location"
    AREAS ||--o{ ACCESS_PERMISSIONS : "grants access to"
```

## 🔄 Flujo de Datos

### Flujo de Autenticación

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant B as Backend
    participant DB as Base de Datos
    
    U->>F: Ingresa credenciales
    F->>B: POST /api/auth/login
    B->>DB: Verifica usuario y contraseña
    DB-->>B: Datos del usuario
    B->>B: Genera JWT token
    B-->>F: Token + datos del usuario
    F->>F: Almacena token en localStorage
    F-->>U: Redirige al Dashboard
    
    Note over F: Token se incluye en todas las requests
    F->>B: Request con Authorization header
    B->>B: Valida JWT token
    B->>DB: Consulta datos
    DB-->>B: Resultados
    B-->>F: Respuesta con datos
    F-->>U: Muestra información
```

### Flujo de Gestión de Visitas

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant B as Backend
    participant DB as Base de Datos
    
    U->>F: Accede a página de visitas
    F->>B: GET /api/visitas (con filtros)
    B->>B: Valida JWT token
    B->>DB: Consulta visitas con paginación
    DB-->>B: Lista de visitas
    B-->>F: Datos de visitas
    F-->>U: Muestra tabla de visitas
    
    U->>F: Crea nueva visita
    F->>B: POST /api/visitas
    B->>B: Valida datos
    B->>DB: Inserta nueva visita
    DB-->>B: Visita creada
    B-->>F: Confirmación
    F-->>U: Muestra mensaje de éxito
    
    U->>F: Edita visita existente
    F->>B: PUT /api/visitas/:id
    B->>DB: Actualiza visita
    DB-->>B: Visita actualizada
    B-->>F: Confirmación
    F-->>U: Actualiza tabla
```

## 🎨 Arquitectura Frontend

### Estructura de Componentes

```mermaid
graph TD
    A[App.js] --> B[Layout.js]
    A --> C[Login.js]
    A --> D[ProtectedRoute.js]
    
    B --> E[Sidebar]
    B --> F[AppBar]
    B --> G[Main Content]
    
    G --> H[Dashboard.js]
    G --> I[Usuarios.js]
    G --> J[Visitas.js]
    G --> K[VisitaExterna.js]
    G --> L[Propietarios.js]
    
    H --> H1[Stats Cards]
    H --> H2[Charts]
    
    I --> I1[User Table]
    I --> I2[User Modal]
    I --> I3[Filters]
    
    J --> J1[Visitas Table]
    J --> J2[Visitas Modal]
    J --> J3[Stats Cards]
    J --> J4[Filters]
    
    K --> K1[Visitas Externas Table]
    K --> K2[Visitas Externas Modal]
    K --> K3[Stats Cards]
    K --> K4[Filters]
    
    L --> L1[Propietarios Table]
    L --> L2[Propietarios Modal]
    L --> L3[Stats Cards]
    L --> L4[Filters]
    
    style A fill:#61dafb
    style B fill:#4ecdc4
    style C fill:#ff6b6b
    style D fill:#feca57
```

### Flujo de Context y Estado

```mermaid
graph LR
    A[AuthContext] --> B[useAuth Hook]
    B --> C[Login State]
    B --> D[User Data]
    B --> E[Token Management]
    
    C --> F[Login Component]
    D --> G[User Profile]
    E --> H[API Requests]
    
    H --> I[Axios Interceptors]
    I --> J[Backend API]
    
    style A fill:#ff6b6b
    style B fill:#4ecdc4
    style I fill:#45b7d1
```

## 🔧 Arquitectura Backend

### Estructura de Capas

```mermaid
graph TD
    A[Express Server] --> B[Routes Layer]
    B --> C[Controllers Layer]
    C --> D[Models Layer]
    D --> E[Database Layer]
    
    A --> F[Middleware]
    F --> F1[Authentication]
    F --> F2[Validation]
    F --> F3[CORS]
    F --> F4[Error Handling]
    
    C --> C1[authController]
    C --> C2[userController]
    C --> C3[visitaController]
    C --> C4[visitaExternaController]
    C --> C5[accessController]
    
    D --> D1[User Model]
    D --> D2[Visita Model]
    D --> D3[VisitaExterna Model]
    D --> D4[Role Model]
    D --> D5[Profile Model]
    
    style A fill:#68a063
    style B fill:#4ecdc4
    style C fill:#45b7d1
    style D fill:#96ceb4
    style E fill:#feca57
```

### Patrón MVC Implementado

```mermaid
graph LR
    subgraph "Model (Sequelize)"
        A[User Model]
        B[Visita Model]
        C[Role Model]
    end
    
    subgraph "View (React Frontend)"
        D[Components]
        E[Pages]
        F[Layout]
    end
    
    subgraph "Controller (Express)"
        G[authController]
        H[userController]
        I[visitaController]
    end
    
    A --> G
    B --> I
    C --> H
    
    G --> D
    H --> E
    I --> F
    
    style A fill:#96ceb4
    style D fill:#61dafb
    style G fill:#45b7d1
```

## 🔐 Seguridad y Autenticación

### Arquitectura de Seguridad

```mermaid
graph TD
    A[Frontend Request] --> B[CORS Middleware]
    B --> C[JWT Authentication]
    C --> D[Role-based Access]
    D --> E[API Endpoint]
    E --> F[Database Query]
    
    C --> C1[Token Validation]
    C --> C2[Token Refresh]
    
    D --> D1[Admin Role]
    D --> D2[User Role]
    D --> D3[Guest Role]
    
    F --> F1[Encrypted Data]
    F --> F2[Audit Logs]
    
    style C fill:#ff6b6b
    style D fill:#feca57
    style F1 fill:#96ceb4
```

## 📊 APIs y Endpoints

### Estructura de APIs

```mermaid
graph TD
    A[/api] --> B[/auth]
    A --> C[/users]
    A --> D[/visitas]
    A --> E[/visitas-externas]
    A --> F[/access]
    
    B --> B1[POST /login]
    B --> B2[POST /logout]
    B --> B3[GET /me]
    B --> B4[POST /refresh]
    
    C --> C1[GET / - List users]
    C --> C2[POST / - Create user]
    C --> C3[GET /:id - Get user]
    C --> C4[PUT /:id - Update user]
    C --> C5[DELETE /:id - Delete user]
    
    D --> D1[GET / - List visitas]
    D --> D2[POST / - Create visita]
    D --> D3[GET /:id - Get visita]
    D --> D4[PUT /:id - Update visita]
    D --> D5[DELETE /:id - Delete visita]
    
    E --> E1[GET / - List visitas externas]
    E --> E2[POST / - Create visita externa]
    E --> E3[GET /:id - Get visita externa]
    E --> E4[PUT /:id - Update visita externa]
    E --> E5[DELETE /:id - Delete visita externa]
    
    F --> F1[GET /logs - Access logs]
    F --> F2[POST /permissions - Grant access]
    F --> F3[DELETE /permissions - Revoke access]
    
    style A fill:#68a063
    style B fill:#ff6b6b
    style C fill:#4ecdc4
    style D fill:#45b7d1
    style E fill:#96ceb4
```

## 🚀 Despliegue y Configuración

### Arquitectura de Despliegue

```mermaid
graph TD
    A[Development] --> B[Frontend:3000]
    A --> C[Backend:3001]
    A --> D[PostgreSQL:5432]
    
    E[Production] --> F[Nginx Reverse Proxy]
    F --> G[Frontend Build]
    F --> H[Backend API]
    H --> I[PostgreSQL Database]
    
    J[Docker] --> K[Frontend Container]
    J --> L[Backend Container]
    J --> M[Database Container]
    
    style A fill:#4ecdc4
    style E fill:#ff6b6b
    style J fill:#45b7d1
```

## 📈 Monitoreo y Logs

### Sistema de Logging

```mermaid
graph LR
    A[Application Events] --> B[Audit Logs]
    A --> C[Access Logs]
    A --> D[Error Logs]
    
    B --> E[Database]
    C --> E
    D --> F[File System]
    
    E --> G[Analytics Dashboard]
    F --> G
    
    style A fill:#ff6b6b
    style B fill:#4ecdc4
    style C fill:#45b7d1
    style D fill:#feca57
```

## 🔄 Flujo de Desarrollo

### Git Workflow

```mermaid
graph LR
    A[Feature Branch] --> B[Development]
    B --> C[Testing]
    C --> D[Code Review]
    D --> E[Main Branch]
    E --> F[Production]
    
    style A fill:#4ecdc4
    style E fill:#ff6b6b
    style F fill:#45b7d1
```

---

## 📋 Resumen de Tecnologías

### Frontend
- **Framework:** React.js 18
- **UI Library:** Material-UI (MUI) v5
- **State Management:** React Context API
- **HTTP Client:** Axios
- **Routing:** React Router DOM v6
- **Build Tool:** Create React App

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **ORM:** Sequelize v6
- **Database:** PostgreSQL
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Validation:** Express-validator

### Base de Datos
- **Database:** PostgreSQL 14+
- **Connection Pool:** Sequelize
- **Migrations:** Sequelize CLI
- **Seeding:** Custom seeders

### DevOps
- **Containerization:** Docker
- **Orchestration:** Docker Compose
- **Version Control:** Git
- **Environment:** Development/Production

---

*Documentación generada automáticamente - Sistema de Control de Acceso v1.0*
