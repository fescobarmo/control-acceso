#!/bin/bash

# ========================================
# SCRIPT DE INICIALIZACIÓN - MÚLTIPLES ENTORNOS
# Sistema de Control de Acceso
# ========================================

set -e  # Salir si hay algún error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_message() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Función para verificar si Docker está corriendo
check_docker() {
    print_info "Verificando Docker..."
    
    # Verificar si Docker está instalado
    if ! command -v docker &> /dev/null; then
        print_error "Docker no está instalado. Por favor instala Docker Desktop."
        print_info "Ejecuta './check-docker.sh' para instrucciones de instalación."
        exit 1
    fi
    
    # Verificar si Docker está corriendo
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker no está corriendo. Por favor inicia Docker Desktop."
        exit 1
    fi
    
    # Verificar Docker Compose
    if docker compose version >/dev/null 2>&1; then
        print_message "Docker Compose V2 está disponible"
    elif command -v docker-compose &> /dev/null; then
        print_warning "Docker Compose V1 (legacy) está disponible"
        print_info "Se recomienda actualizar a Docker Compose V2"
    else
        print_error "Docker Compose no está disponible"
        print_info "Ejecuta './check-docker.sh' para más información."
        exit 1
    fi
}

# Función para verificar si PostgreSQL está disponible
check_postgres() {
    if command_exists psql; then
        if psql -U admin -h localhost -c "SELECT 1;" >/dev/null 2>&1; then
            return 0
        fi
    fi
    return 1
}

# Función para crear bases de datos
create_databases() {
    print_info "Creando bases de datos..."
    
    if check_postgres; then
        psql -U admin -h localhost -c "CREATE DATABASE IF NOT EXISTS controlacceso_dev;" 2>/dev/null || print_warning "No se pudo crear controlacceso_dev"
        psql -U admin -h localhost -c "CREATE DATABASE IF NOT EXISTS controlacceso_test;" 2>/dev/null || print_warning "No se pudo crear controlacceso_test"
        psql -U admin -h localhost -c "CREATE DATABASE IF NOT EXISTS controlacceso_prod;" 2>/dev/null || print_warning "No se pudo crear controlacceso_prod"
        print_message "Bases de datos creadas (si PostgreSQL está disponible)"
    else
        print_warning "PostgreSQL no está disponible. Las bases de datos se crearán automáticamente con Docker."
    fi
}

# Función para instalar dependencias
install_dependencies() {
    print_info "Instalando dependencias..."
    
    # Backend
    if [ -d "backend" ]; then
        print_info "Instalando dependencias del backend..."
        cd backend
        npm install
        cd ..
        print_message "Dependencias del backend instaladas"
    else
        print_error "Directorio backend no encontrado"
        exit 1
    fi
    
    # Frontend
    if [ -d "frontend" ]; then
        print_info "Instalando dependencias del frontend..."
        cd frontend
        npm install
        cd ..
        print_message "Dependencias del frontend instaladas"
    else
        print_error "Directorio frontend no encontrado"
        exit 1
    fi
}

# Función para verificar archivos de configuración
check_config_files() {
    print_info "Verificando archivos de configuración..."
    
    # Verificar archivos de entorno del backend
    if [ ! -f "backend/env.development" ]; then
        print_error "backend/env.development no encontrado"
        exit 1
    fi
    
    if [ ! -f "backend/env.test" ]; then
        print_error "backend/env.test no encontrado"
        exit 1
    fi
    
    if [ ! -f "backend/env.production" ]; then
        print_error "backend/env.production no encontrado"
        exit 1
    fi
    
    # Verificar archivos de entorno del frontend
    if [ ! -f "frontend/env.development" ]; then
        print_error "frontend/env.development no encontrado"
        exit 1
    fi
    
    if [ ! -f "frontend/env.test" ]; then
        print_error "frontend/env.test no encontrado"
        exit 1
    fi
    
    if [ ! -f "frontend/env.production" ]; then
        print_error "frontend/env.production no encontrado"
        exit 1
    fi
    
    print_message "Archivos de configuración verificados"
}

# Función para mostrar información de uso
show_usage() {
    echo ""
    echo "🚀 Sistema de Control de Acceso - Entornos Configurados"
    echo "=================================================="
    echo ""
    echo "📋 Comandos disponibles:"
    echo ""
    echo "🔧 Backend:"
    echo "  npm run dev        - Entorno de desarrollo (puerto 3001)"
    echo "  npm run test-env   - Entorno de pruebas (puerto 3002)"
    echo "  npm run prod       - Entorno de producción (puerto 3003)"
    echo ""
    echo "🎨 Frontend:"
    echo "  npm run start:dev  - Entorno de desarrollo (puerto 3000)"
    echo "  npm run start:test - Entorno de pruebas (puerto 3003)"
    echo "  npm run start:prod - Entorno de producción (puerto 3004)"
    echo ""
    echo "🐳 Docker (todos los entornos simultáneamente):"
echo "  docker compose -f docker-compose.override.yml up -d"
echo "  docker compose -f docker-compose.override.yml down"
    echo ""
    echo "🌐 URLs de acceso:"
    echo "  Desarrollo:  http://localhost:3000 (frontend) + http://localhost:3001 (backend)"
    echo "  Pruebas:     http://localhost:3003 (frontend) + http://localhost:3002 (backend)"
    echo "  Producción:  http://localhost:3004 (frontend) + http://localhost:3003 (backend)"
    echo ""
    echo "🗄️ Bases de datos:"
    echo "  Desarrollo:  controlacceso_dev"
    echo "  Pruebas:     controlacceso_test"
    echo "  Producción:  controlacceso_prod"
    echo ""
    echo "📚 Documentación:"
    echo "  docs/CONFIGURACION_ENTORNOS.md"
    echo ""
}

# Función principal
main() {
    echo "🚀 Inicializando entornos de Control de Acceso..."
    echo "=================================================="
    echo ""
    
    # Verificar Docker
    check_docker
    print_message "Docker está disponible"
    
    # Verificar archivos de configuración
    check_config_files
    
    # Instalar dependencias
    install_dependencies
    
    # Crear bases de datos
    create_databases
    
    echo ""
    print_message "¡Inicialización completada exitosamente!"
    
    # Mostrar información de uso
    show_usage
}

# Ejecutar función principal
main "$@"
