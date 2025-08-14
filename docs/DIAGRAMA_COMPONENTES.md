# 🧩 Diagrama de Componentes - Sistema de Control de Acceso

## 🎯 Componentes Principales y sus Interacciones

### Diagrama de Componentes Frontend

```mermaid
graph TB
    subgraph "App.js - Punto de Entrada"
        A[App.js]
        A --> B[BrowserRouter]
        B --> C[AuthProvider]
    end
    
    subgraph "Autenticación"
        C --> D[Login.js]
        C --> E[ProtectedRoute.js]
    end
    
    subgraph "Layout Principal"
        E --> F[Layout.js]
        F --> G[Sidebar Navigation]
        F --> H[AppBar Header]
        F --> I[Main Content Area]
    end
    
    subgraph "Páginas Principales"
        I --> J[Dashboard.js]
        I --> K[Usuarios.js]
        I --> L[Visitas.js]
        I --> M[VisitaExterna.js]
        I --> N[Propietarios.js]
    end
    
    subgraph "Componentes de Tabla"
        K --> K1[UserTable]
        K --> K2[UserModal]
        K --> K3[UserFilters]
        
        L --> L1[VisitasTable]
        L --> L2[VisitasModal]
        L --> L3[VisitasFilters]
        L --> L4[StatsCards]
        
        M --> M1[VisitasExternasTable]
        M --> M2[VisitasExternasModal]
        M --> M3[VisitasExternasFilters]
        M --> M4[StatsCards]
        
        N --> N1[PropietariosTable]
        N --> N2[PropietariosModal]
        N --> N3[PropietariosFilters]
        N --> N4[StatsCards]
    end
    
    subgraph "Context y Estado"
        O[AuthContext]
        O --> P[useAuth Hook]
        P --> Q[Login State]
        P --> R[User Data]
        P --> S[Token Management]
    end
    
    subgraph "Configuración"
        T[API Config]
        T --> U[Axios Instance]
        U --> V[Request Interceptors]
        U --> W[Response Interceptors]
    end
    
    style A fill:#61dafb
    style C fill:#ff6b6b
    style F fill:#4ecdc4
    style O fill:#feca57
    style T fill:#45b7d1
```

## 🔄 Flujo de Datos entre Componentes

### Diagrama de Flujo de Estado

```mermaid
flowchart TD
    A[Usuario Inicia Sesión] --> B[Login.js]
    B --> C[AuthContext.setUser]
    C --> D[Token en localStorage]
    D --> E[ProtectedRoute verifica]
    E --> F[Layout.js renderiza]
    
    F --> G[Sidebar muestra opciones]
    F --> H[Usuario navega]
    
    H --> I[Usuarios.js]
    H --> J[Visitas.js]
    H --> K[VisitaExterna.js]
    H --> L[Propietarios.js]
    
    I --> M[API Request con Token]
    J --> M
    K --> M
    L --> M
    
    M --> N[Backend valida Token]
    N --> O[Respuesta con datos]
    O --> P[Componente actualiza estado]
    P --> Q[UI se re-renderiza]
    
    style A fill:#4ecdc4
    style C fill:#ff6b6b
    style M fill:#45b7d1
    style P fill:#feca57
```

## 🎨 Estructura de UI Components

### Jerarquía de Componentes Material-UI

```mermaid
graph TD
    subgraph "Layout Components"
        A[Box Container]
        A --> B[Grid System]
        B --> C[Card Components]
        C --> D[Paper Components]
    end
    
    subgraph "Form Components"
        E[TextField]
        F[FormControl]
        G[Select]
        H[Button]
        I[Checkbox]
    end
    
    subgraph "Data Display"
        J[Table]
        J --> K[TableHead]
        J --> L[TableBody]
        J --> M[TableCell]
        J --> N[TablePagination]
    end
    
    subgraph "Navigation"
        O[AppBar]
        P[Drawer]
        Q[List]
        R[ListItem]
    end
    
    subgraph "Feedback"
        S[Alert]
        T[Snackbar]
        U[Dialog]
        V[Skeleton]
    end
    
    style A fill:#61dafb
    style E fill:#4ecdc4
    style J fill:#45b7d1
    style O fill:#ff6b6b
    style S fill:#feca57
```

## 🔐 Autenticación y Autorización

### Flujo de Autenticación Detallado

```mermaid
sequenceDiagram
    participant U as Usuario
    participant L as Login.js
    participant A as AuthContext
    participant P as ProtectedRoute
    participant L2 as Layout.js
    participant API as Backend API
    
    U->>L: Ingresa credenciales
    L->>API: POST /api/auth/login
    API-->>L: JWT Token + User Data
    L->>A: setUser(userData)
    L->>A: setToken(token)
    A->>A: localStorage.setItem('token')
    A->>P: isAuthenticated = true
    P->>L2: Renderiza Layout
    L2->>U: Muestra aplicación
    
    Note over U,API: Navegación posterior
    U->>L2: Navega a página
    L2->>API: Request con Authorization header
    API->>API: Valida JWT
    API-->>L2: Datos solicitados
    L2->>U: Actualiza UI
```

## 📊 Gestión de Estado

### Arquitectura de Estado

```mermaid
graph LR
    subgraph "Global State"
        A[AuthContext]
        A --> B[User Info]
        A --> C[Authentication Status]
        A --> D[JWT Token]
    end
    
    subgraph "Local State"
        E[Component State]
        E --> F[Form Data]
        E --> G[Table Data]
        E --> H[Modal State]
        E --> I[Loading State]
    end
    
    subgraph "API State"
        J[Axios Interceptors]
        J --> K[Request Headers]
        J --> L[Response Handling]
        J --> M[Error Handling]
    end
    
    A --> J
    E --> J
    
    style A fill:#ff6b6b
    style E fill:#4ecdc4
    style J fill:#45b7d1
```

## 🎯 Patrones de Diseño Implementados

### Patrones Utilizados

```mermaid
graph TD
    subgraph "Patrón Provider"
        A[AuthProvider]
        A --> B[useAuth Hook]
        B --> C[Consumer Components]
    end
    
    subgraph "Patrón HOC"
        D[ProtectedRoute]
        D --> E[Wraps Components]
        E --> F[Authentication Check]
    end
    
    subgraph "Patrón Container/Presentational"
        G[Container Components]
        G --> H[API Calls]
        G --> I[State Management]
        
        J[Presentational Components]
        J --> K[UI Rendering]
        J --> L[Props Display]
    end
    
    subgraph "Patrón Custom Hooks"
        M[useApi Hook]
        M --> N[API Logic]
        
        O[useForm Hook]
        O --> P[Form Logic]
    end
    
    style A fill:#ff6b6b
    style D fill:#4ecdc4
    style G fill:#45b7d1
    style M fill:#feca57
```

## 🔧 Configuración y Utilidades

### Estructura de Configuración

```mermaid
graph TD
    subgraph "Config Files"
        A[api.js]
        A --> B[Base URL]
        A --> C[Headers]
        A --> D[Interceptors]
    end
    
    subgraph "Utils"
        E[dateUtils.js]
        E --> F[Date Formatting]
        E --> G[Date Validation]
        
        H[validationUtils.js]
        H --> I[Form Validation]
        H --> J[Data Validation]
        
        K[constants.js]
        K --> L[API Endpoints]
        K --> M[Status Codes]
        K --> N[User Roles]
    end
    
    subgraph "Contexts"
        O[AuthContext]
        O --> P[Authentication Logic]
        O --> Q[User Management]
    end
    
    style A fill:#45b7d1
    style E fill:#4ecdc4
    style O fill:#ff6b6b
```

---

## 📋 Resumen de Componentes por Funcionalidad

### 🔐 Autenticación
- **Login.js**: Formulario de inicio de sesión
- **ProtectedRoute.js**: Protección de rutas
- **AuthContext.js**: Gestión global de autenticación

### 🏠 Layout
- **Layout.js**: Estructura principal de la aplicación
- **Sidebar**: Navegación lateral
- **AppBar**: Barra superior

### 👥 Gestión de Usuarios
- **Usuarios.js**: Página principal de usuarios
- **UserTable**: Tabla de usuarios
- **UserModal**: Modal para crear/editar usuarios

### 📝 Gestión de Visitas
- **Visitas.js**: Página de visitas internas
- **VisitaExterna.js**: Página de visitas externas
- **VisitasTable**: Tabla de visitas
- **VisitasModal**: Modal para crear/editar visitas

### 🏘️ Gestión de Propietarios
- **Propietarios.js**: Página de propietarios/residentes
- **PropietariosTable**: Tabla de propietarios
- **PropietariosModal**: Modal para crear/editar propietarios

### 📊 Dashboard
- **Dashboard.js**: Página principal con estadísticas
- **StatsCards**: Tarjetas de estadísticas
- **Charts**: Gráficos y visualizaciones

---

*Diagrama de Componentes - Sistema de Control de Acceso v1.0*
