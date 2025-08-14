# 🗄️ Arquitectura de Base de Datos - Sistema de Control de Acceso

## 🏗️ Diseño de Base de Datos

### Diagrama de Esquema Completo

```mermaid
erDiagram
    USERS {
        int id PK "AUTO_INCREMENT"
        string username "UNIQUE, NOT NULL"
        string email "UNIQUE, NOT NULL"
        string password_hash "NOT NULL"
        string first_name "NOT NULL"
        string last_name "NOT NULL"
        string status "ENUM: active, inactive, suspended"
        int role_id FK "NOT NULL"
        int profile_id FK
        int area_id FK
        int created_by FK "SELF REFERENCE"
        int updated_by FK "SELF REFERENCE"
        timestamp created_at "DEFAULT NOW()"
        timestamp updated_at "DEFAULT NOW()"
    }
    
    ROLES {
        int id PK "AUTO_INCREMENT"
        string name "UNIQUE, NOT NULL"
        string description
        json permissions "NOT NULL"
        timestamp created_at "DEFAULT NOW()"
        timestamp updated_at "DEFAULT NOW()"
    }
    
    PROFILES {
        int id PK "AUTO_INCREMENT"
        string name "UNIQUE, NOT NULL"
        string description
        json settings "DEFAULT {}"
        timestamp created_at "DEFAULT NOW()"
        timestamp updated_at "DEFAULT NOW()"
    }
    
    AREAS {
        int id PK "AUTO_INCREMENT"
        string name "UNIQUE, NOT NULL"
        string description
        string location "NOT NULL"
        int capacity "DEFAULT 0"
        timestamp created_at "DEFAULT NOW()"
        timestamp updated_at "DEFAULT NOW()"
    }
    
    VISITAS {
        int id PK "AUTO_INCREMENT"
        string nombre "NOT NULL"
        string apellido_paterno "NOT NULL"
        string apellido_materno
        string documento "NOT NULL"
        string motivo "NOT NULL"
        string ubicacion "NOT NULL"
        string vehiculo
        string placa
        string estado "ENUM: activa, finalizada, cancelada"
        timestamp fecha_entrada "DEFAULT NOW()"
        timestamp fecha_salida
        int created_by FK "NOT NULL"
        int updated_by FK
        timestamp created_at "DEFAULT NOW()"
        timestamp updated_at "DEFAULT NOW()"
    }
    
    VISITAS_EXTERNAS {
        int id PK "AUTO_INCREMENT"
        string nombre "NOT NULL"
        string apellido_paterno "NOT NULL"
        string apellido_materno
        string documento "NOT NULL"
        string empresa "NOT NULL"
        string motivo "NOT NULL"
        string ubicacion "NOT NULL"
        string vehiculo
        string placa
        string estado "ENUM: activa, finalizada, cancelada"
        timestamp fecha_entrada "DEFAULT NOW()"
        timestamp fecha_salida
        int created_by FK "NOT NULL"
        int updated_by FK
        timestamp created_at "DEFAULT NOW()"
        timestamp updated_at "DEFAULT NOW()"
    }
    
    DEVICES {
        int id PK "AUTO_INCREMENT"
        string name "UNIQUE, NOT NULL"
        string type "ENUM: card_reader, biometric, camera, gate"
        string location "NOT NULL"
        string status "ENUM: active, inactive, maintenance"
        json configuration "DEFAULT {}"
        timestamp created_at "DEFAULT NOW()"
        timestamp updated_at "DEFAULT NOW()"
    }
    
    ACCESS_LOGS {
        int id PK "AUTO_INCREMENT"
        int user_id FK "NOT NULL"
        int device_id FK "NOT NULL"
        int area_id FK "NOT NULL"
        string action "ENUM: entry, exit, denied, timeout"
        timestamp timestamp "DEFAULT NOW()"
        json metadata "DEFAULT {}"
    }
    
    ACCESS_PERMISSIONS {
        int id PK "AUTO_INCREMENT"
        int user_id FK "NOT NULL"
        int area_id FK "NOT NULL"
        string permission_type "ENUM: read, write, admin"
        timestamp valid_from "DEFAULT NOW()"
        timestamp valid_until
        timestamp created_at "DEFAULT NOW()"
        timestamp updated_at "DEFAULT NOW()"
    }
    
    SESSIONS {
        int id PK "AUTO_INCREMENT"
        int user_id FK "NOT NULL"
        string token "UNIQUE, NOT NULL"
        timestamp expires_at "NOT NULL"
        timestamp created_at "DEFAULT NOW()"
    }
    
    AUDIT_LOGS {
        int id PK "AUTO_INCREMENT"
        int user_id FK "NOT NULL"
        string action "NOT NULL"
        string table_name "NOT NULL"
        int record_id "NOT NULL"
        json old_values
        json new_values
        timestamp created_at "DEFAULT NOW()"
    }
    
    SYSTEM_CONFIG {
        int id PK "AUTO_INCREMENT"
        string key "UNIQUE, NOT NULL"
        string value "NOT NULL"
        string description
        timestamp created_at "DEFAULT NOW()"
        timestamp updated_at "DEFAULT NOW()"
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
    USERS ||--o{ USERS : "created_by/updated_by"
    DEVICES ||--o{ ACCESS_LOGS : "records"
    AREAS ||--o{ ACCESS_LOGS : "location"
    AREAS ||--o{ ACCESS_PERMISSIONS : "grants access to"
```

## 🔗 Relaciones y Constraints

### Diagrama de Relaciones Principales

```mermaid
graph TD
    subgraph "Entidades Principales"
        A[USERS]
        B[ROLES]
        C[PROFILES]
        D[AREAS]
    end
    
    subgraph "Entidades de Visitas"
        E[VISITAS]
        F[VISITAS_EXTERNAS]
    end
    
    subgraph "Entidades de Seguridad"
        G[DEVICES]
        H[ACCESS_LOGS]
        I[ACCESS_PERMISSIONS]
        J[SESSIONS]
    end
    
    subgraph "Entidades de Auditoría"
        K[AUDIT_LOGS]
        L[SYSTEM_CONFIG]
    end
    
    A -->|role_id| B
    A -->|profile_id| C
    A -->|area_id| D
    A -->|created_by| A
    A -->|updated_by| A
    
    A -->|created_by| E
    A -->|created_by| F
    
    A -->|user_id| H
    A -->|user_id| I
    A -->|user_id| J
    A -->|user_id| K
    
    G -->|device_id| H
    D -->|area_id| H
    D -->|area_id| I
    
    style A fill:#ff6b6b
    style B fill:#4ecdc4
    style C fill:#45b7d1
    style D fill:#96ceb4
    style E fill:#feca57
    style F fill:#ff9ff3
```

## 📊 Índices y Optimización

### Estructura de Índices

```mermaid
graph TD
    subgraph "Índices Primarios"
        A[PRIMARY KEY - id]
        A --> A1[USERS.id]
        A --> A2[ROLES.id]
        A --> A3[VISITAS.id]
        A --> A4[VISITAS_EXTERNAS.id]
    end
    
    subgraph "Índices Únicos"
        B[UNIQUE INDEXES]
        B --> B1[USERS.username]
        B --> B2[USERS.email]
        B --> B3[ROLES.name]
        B --> B4[PROFILES.name]
        B --> B5[AREAS.name]
        B --> B6[DEVICES.name]
        B --> B7[SESSIONS.token]
        B --> B8[SYSTEM_CONFIG.key]
    end
    
    subgraph "Índices de Rendimiento"
        C[PERFORMANCE INDEXES]
        C --> C1[USERS.role_id]
        C --> C2[USERS.status]
        C --> C3[VISITAS.estado]
        C --> C4[VISITAS.fecha_entrada]
        C --> C5[VISITAS_EXTERNAS.estado]
        C --> C6[VISITAS_EXTERNAS.fecha_entrada]
        C --> C7[ACCESS_LOGS.timestamp]
        C --> C8[ACCESS_LOGS.user_id]
        C --> C9[AUDIT_LOGS.created_at]
        C --> C10[AUDIT_LOGS.user_id]
    end
    
    subgraph "Índices Compuestos"
        D[COMPOSITE INDEXES]
        D --> D1[VISITAS: estado, fecha_entrada]
        D --> D2[VISITAS_EXTERNAS: estado, fecha_entrada]
        D --> D3[ACCESS_LOGS: user_id, timestamp]
        D --> D4[ACCESS_PERMISSIONS: user_id, area_id]
    end
    
    style A fill:#ff6b6b
    style B fill:#4ecdc4
    style C fill:#45b7d1
    style D fill:#feca57
```

## 🔄 Migraciones y Versionado

### Estructura de Migraciones

```mermaid
graph TD
    subgraph "Migraciones Base"
        A[001_create_users_table]
        B[002_create_roles_table]
        C[003_create_profiles_table]
        D[004_create_areas_table]
    end
    
    subgraph "Migraciones de Visitas"
        E[005_create_visitas_table]
        F[006_create_visitas_externas_table]
    end
    
    subgraph "Migraciones de Seguridad"
        G[007_create_devices_table]
        H[008_create_access_logs_table]
        I[009_create_access_permissions_table]
        J[010_create_sessions_table]
    end
    
    subgraph "Migraciones de Auditoría"
        K[011_create_audit_logs_table]
        L[012_create_system_config_table]
    end
    
    subgraph "Migraciones de Relaciones"
        M[013_add_foreign_keys]
        N[014_add_indexes]
        O[015_add_constraints]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L
    L --> M
    M --> N
    N --> O
    
    style A fill:#ff6b6b
    style E fill:#4ecdc4
    style G fill:#45b7d1
    style K fill:#feca57
```

## 🌱 Seeds y Datos Iniciales

### Estructura de Seeds

```mermaid
graph TD
    subgraph "Seeds de Configuración"
        A[seedRoles.js]
        A --> A1[Admin Role]
        A --> A2[User Role]
        A --> A3[Guest Role]
        
        B[seedProfiles.js]
        B --> B1[Default Profile]
        B --> B2[Admin Profile]
        B --> B3[User Profile]
        
        C[seedAreas.js]
        C --> C1[Recepción]
        C --> C2[Oficinas]
        C --> C3[Estacionamiento]
        C --> C4[Área Común]
    end
    
    subgraph "Seeds de Usuarios"
        D[seedUsers.js]
        D --> D1[Admin User]
        D --> D2[Test Users]
        D --> D3[Guest Users]
    end
    
    subgraph "Seeds de Dispositivos"
        E[seedDevices.js]
        E --> E1[Card Readers]
        E --> E2[Biometric Devices]
        E --> E3[Cameras]
        E --> E4[Gates]
    end
    
    subgraph "Seeds de Configuración"
        F[seedSystemConfig.js]
        F --> F1[System Settings]
        F --> F2[Default Values]
        F --> F3[Feature Flags]
    end
    
    A --> D
    B --> D
    C --> E
    F --> A
    
    style A fill:#ff6b6b
    style D fill:#4ecdc4
    style E fill:#45b7d1
    style F fill:#feca57
```

## 🔐 Seguridad de Datos

### Arquitectura de Seguridad

```mermaid
graph TD
    subgraph "Encriptación"
        A[Password Hashing]
        A --> A1[bcrypt - 10 rounds]
        A --> A2[Salt Generation]
        
        B[Token Encryption]
        B --> B1[JWT Secret]
        B --> B2[Token Expiration]
    end
    
    subgraph "Validación"
        C[Input Validation]
        C --> C1[Email Format]
        C --> C2[Password Strength]
        C --> C3[Document Validation]
        
        D[Data Sanitization]
        D --> D1[SQL Injection Prevention]
        D --> D2[XSS Prevention]
    end
    
    subgraph "Auditoría"
        E[Audit Trail]
        E --> E1[User Actions]
        E --> E2[Data Changes]
        E --> E3[Access Logs]
        
        F[Session Management]
        F --> F1[Token Refresh]
        F --> F2[Session Expiration]
        F --> F3[Concurrent Sessions]
    end
    
    subgraph "Permisos"
        G[Role-based Access]
        G --> G1[Admin Permissions]
        G --> G2[User Permissions]
        G --> G3[Guest Permissions]
        
        H[Area Permissions]
        H --> H1[Access Control]
        H --> H2[Time-based Access]
        H --> H3[Device Permissions]
    end
    
    style A fill:#ff6b6b
    style C fill:#4ecdc4
    style E fill:#45b7d1
    style G fill:#feca57
```

## 📈 Rendimiento y Escalabilidad

### Estrategias de Optimización

```mermaid
graph TD
    subgraph "Optimización de Consultas"
        A[Query Optimization]
        A --> A1[Index Usage]
        A --> A2[Query Planning]
        A --> A3[Connection Pooling]
        
        B[Pagination]
        B --> B1[Limit/Offset]
        B --> B2[Cursor-based]
        B --> B3[Infinite Scroll]
    end
    
    subgraph "Caching"
        C[Application Cache]
        C --> C1[User Sessions]
        C --> C2[Configuration Data]
        C --> C3[Frequently Accessed Data]
        
        D[Database Cache]
        D --> D1[Query Result Cache]
        D --> D2[Connection Pool]
        D --> D3[Buffer Pool]
    end
    
    subgraph "Particionamiento"
        E[Table Partitioning]
        E --> E1[By Date - ACCESS_LOGS]
        E --> E2[By Status - VISITAS]
        E --> E3[By User - AUDIT_LOGS]
        
        F[Data Archiving]
        F --> F1[Old Access Logs]
        F --> F2[Completed Visits]
        F --> F3[Expired Sessions]
    end
    
    subgraph "Monitoreo"
        G[Performance Monitoring]
        G --> G1[Query Performance]
        G --> G2[Connection Usage]
        G --> G3[Index Usage]
        
        H[Alerting]
        H --> H1[Slow Queries]
        H --> H2[Connection Limits]
        H --> H3[Disk Space]
    end
    
    style A fill:#ff6b6b
    style C fill:#4ecdc4
    style E fill:#45b7d1
    style G fill:#feca57
```

## 🔄 Backup y Recuperación

### Estrategia de Backup

```mermaid
graph TD
    subgraph "Backup Automático"
        A[Daily Backups]
        A --> A1[Full Database Backup]
        A --> A2[Incremental Backups]
        A --> A3[Transaction Logs]
        
        B[Backup Storage]
        B --> B1[Local Storage]
        B --> B2[Cloud Storage]
        B --> B3[Offsite Storage]
    end
    
    subgraph "Recuperación"
        C[Disaster Recovery]
        C --> C1[Point-in-time Recovery]
        C --> C2[Full System Restore]
        C --> C3[Partial Data Recovery]
        
        D[Testing]
        D --> D1[Backup Validation]
        D --> D2[Recovery Testing]
        D --> D3[Performance Testing]
    end
    
    subgraph "Replicación"
        E[Database Replication]
        E --> E1[Master-Slave Setup]
        E --> E2[Read Replicas]
        E --> E3[Failover Configuration]
        
        F[High Availability]
        F --> F1[Load Balancing]
        F --> F2[Automatic Failover]
        F --> F3[Health Monitoring]
    end
    
    style A fill:#ff6b6b
    style C fill:#4ecdc4
    style E fill:#45b7d1
```

---

## 📋 Resumen de Configuración de Base de Datos

### 🗄️ Configuración PostgreSQL
- **Versión:** PostgreSQL 14+
- **Encoding:** UTF-8
- **Collation:** en_US.UTF-8
- **Connection Pool:** 20 connections
- **Timeout:** 30 seconds

### 🔧 Configuración Sequelize
- **Dialect:** postgres
- **Logging:** Development only
- **Pool:** Min 5, Max 20
- **Idle:** 10000ms
- **Acquire:** 60000ms

### 📊 Estadísticas de Tablas
- **Total Tables:** 12
- **Total Indexes:** 25+
- **Total Constraints:** 15+
- **Estimated Size:** 1-5 GB (production)

### 🔐 Configuración de Seguridad
- **Password Policy:** bcrypt with salt rounds 10
- **Session Timeout:** 24 hours
- **Token Expiration:** 24 hours
- **Max Login Attempts:** 5 per hour

---

*Arquitectura de Base de Datos - Sistema de Control de Acceso v1.0*
