#!/bin/bash

# ========================================
# SCRIPT DE VERIFICACIÓN DE DOCKER
# Sistema de Control de Acceso
# ========================================

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

# Función para verificar si Docker está instalado
check_docker_installed() {
    print_info "Verificando instalación de Docker..."
    
    if command -v docker &> /dev/null; then
        print_message "Docker está instalado"
        docker --version
        return 0
    else
        print_error "Docker no está instalado"
        return 1
    fi
}

# Función para verificar si Docker está corriendo
check_docker_running() {
    print_info "Verificando que Docker esté corriendo..."
    
    if docker info &> /dev/null; then
        print_message "Docker está corriendo"
        return 0
    else
        print_error "Docker no está corriendo"
        print_info "Por favor inicia Docker Desktop"
        return 1
    fi
}

# Función para verificar si docker compose está disponible
check_docker_compose() {
    print_info "Verificando Docker Compose..."
    
    if docker compose version &> /dev/null; then
        print_message "Docker Compose está disponible"
        docker compose version
        return 0
    else
        print_error "Docker Compose no está disponible"
        print_info "Esto puede indicar que tienes una versión antigua de Docker"
        return 1
    fi
}

# Función para verificar si docker-compose está disponible (versión antigua)
check_docker_compose_legacy() {
    print_info "Verificando Docker Compose (versión antigua)..."
    
    if command -v docker-compose &> /dev/null; then
        print_warning "Docker Compose (versión antigua) está disponible"
        docker-compose --version
        print_info "Se recomienda actualizar a Docker Compose V2"
        return 0
    else
        print_error "Docker Compose no está disponible"
        return 1
    fi
}

# Función para mostrar instrucciones de instalación
show_installation_instructions() {
    echo ""
    print_info "Instrucciones de instalación de Docker:"
    echo ""
    echo "📦 macOS:"
    echo "  1. Descarga Docker Desktop desde: https://www.docker.com/products/docker-desktop"
    echo "  2. Instala Docker Desktop"
    echo "  3. Inicia Docker Desktop desde Applications"
    echo ""
    echo "📦 Windows:"
    echo "  1. Descarga Docker Desktop desde: https://www.docker.com/products/docker-desktop"
    echo "  2. Instala Docker Desktop"
    echo "  3. Inicia Docker Desktop"
    echo ""
    echo "📦 Linux (Ubuntu/Debian):"
    echo "  sudo apt update"
    echo "  sudo apt install docker.io docker-compose"
    echo "  sudo systemctl start docker"
    echo "  sudo systemctl enable docker"
    echo ""
    echo "📦 Linux (CentOS/RHEL):"
    echo "  sudo yum install docker docker-compose"
    echo "  sudo systemctl start docker"
    echo "  sudo systemctl enable docker"
    echo ""
}

# Función para mostrar comandos corregidos
show_corrected_commands() {
    echo ""
    print_info "Comandos corregidos para usar:"
    echo ""
    echo "🐳 Docker Compose V2 (recomendado):"
    echo "  docker compose -f docker-compose.override.yml up -d"
    echo "  docker compose -f docker-compose.override.yml down"
    echo "  docker compose -f docker-compose.override.yml logs"
    echo ""
    echo "🐳 Docker Compose V1 (legacy):"
    echo "  docker-compose -f docker-compose.override.yml up -d"
    echo "  docker-compose -f docker-compose.override.yml down"
    echo "  docker-compose -f docker-compose.override.yml logs"
    echo ""
}

# Función para crear alias si es necesario
create_docker_compose_alias() {
    print_info "Creando alias para docker-compose..."
    
    if ! command -v docker-compose &> /dev/null && docker compose version &> /dev/null; then
        echo 'alias docker-compose="docker compose"' >> ~/.bashrc
        echo 'alias docker-compose="docker compose"' >> ~/.zshrc
        print_message "Alias creado. Ejecuta 'source ~/.bashrc' o 'source ~/.zshrc' para activarlo"
    fi
}

# Función principal
main() {
    echo "🔍 Verificando configuración de Docker..."
    echo "=========================================="
    echo ""
    
    # Verificar instalación
    if ! check_docker_installed; then
        show_installation_instructions
        exit 1
    fi
    
    # Verificar que esté corriendo
    if ! check_docker_running; then
        show_installation_instructions
        exit 1
    fi
    
    # Verificar Docker Compose
    if check_docker_compose; then
        print_message "Docker Compose V2 está disponible"
        show_corrected_commands
    elif check_docker_compose_legacy; then
        print_warning "Usando Docker Compose V1 (legacy)"
        show_corrected_commands
    else
        print_error "Docker Compose no está disponible"
        show_installation_instructions
        exit 1
    fi
    
    # Crear alias si es necesario
    create_docker_compose_alias
    
    echo ""
    print_message "Verificación completada"
    echo ""
    print_info "Para usar el sistema con Docker:"
    echo "  docker compose -f docker-compose.override.yml up -d"
    echo ""
}

# Ejecutar función principal
main "$@"
