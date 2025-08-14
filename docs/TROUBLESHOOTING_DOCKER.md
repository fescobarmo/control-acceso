# 🐳 Troubleshooting Docker - Sistema de Control de Acceso

## ❌ Error: "Unknown command: brew docker-compose"

### 🔍 Problema
El error indica que estás intentando instalar `docker-compose` como un comando separado, pero en las versiones modernas de Docker, `docker-compose` ya no existe como un paquete independiente.

### ✅ Solución

#### 1. Verificar la versión de Docker
```bash
docker --version
docker compose version
```

#### 2. Usar Docker Compose V2 (Recomendado)
En las versiones modernas de Docker, `docker-compose` se reemplazó por `docker compose`:

```bash
# ❌ Comando antiguo (no funciona)
docker-compose -f docker-compose.override.yml up -d

# ✅ Comando nuevo (funciona)
docker compose -f docker-compose.override.yml up -d
```

#### 3. Ejecutar script de verificación
```bash
./check-docker.sh
```

## 🔧 Comandos Corregidos

### Comandos Docker Compose V2 (Recomendado)
```bash
# Levantar todos los entornos
docker compose -f docker-compose.override.yml up -d

# Ver logs
docker compose -f docker-compose.override.yml logs

# Detener todos los entornos
docker compose -f docker-compose.override.yml down

# Ver logs de un servicio específico
docker compose -f docker-compose.override.yml logs backend-dev

# Ejecutar comando en un contenedor
docker compose -f docker-compose.override.yml exec backend-dev npm test
```

### Comandos Docker Compose V1 (Legacy)
Si tienes una versión antigua de Docker:
```bash
# Levantar todos los entornos
docker-compose -f docker-compose.override.yml up -d

# Ver logs
docker-compose -f docker-compose.override.yml logs

# Detener todos los entornos
docker-compose -f docker-compose.override.yml down
```

## 🚀 Instalación de Docker

### macOS
1. Descarga Docker Desktop desde: https://www.docker.com/products/docker-desktop
2. Instala Docker Desktop
3. Inicia Docker Desktop desde Applications
4. Verifica la instalación:
   ```bash
   docker --version
   docker compose version
   ```

### Windows
1. Descarga Docker Desktop desde: https://www.docker.com/products/docker-desktop
2. Instala Docker Desktop
3. Inicia Docker Desktop
4. Verifica la instalación:
   ```bash
   docker --version
   docker compose version
   ```

### Linux (Ubuntu/Debian)
```bash
# Actualizar repositorios
sudo apt update

# Instalar Docker
sudo apt install docker.io

# Instalar Docker Compose
sudo apt install docker-compose

# Iniciar y habilitar Docker
sudo systemctl start docker
sudo systemctl enable docker

# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Verificar instalación
docker --version
docker compose version
```

### Linux (CentOS/RHEL)
```bash
# Instalar Docker
sudo yum install docker

# Instalar Docker Compose
sudo yum install docker-compose

# Iniciar y habilitar Docker
sudo systemctl start docker
sudo systemctl enable docker

# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Verificar instalación
docker --version
docker compose version
```

## 🔍 Verificación de Instalación

### Script de Verificación Automática
```bash
# Ejecutar script de verificación
./check-docker.sh
```

### Verificación Manual
```bash
# Verificar Docker
docker --version

# Verificar que Docker esté corriendo
docker info

# Verificar Docker Compose V2
docker compose version

# Verificar Docker Compose V1 (si existe)
docker-compose --version
```

## 🛠️ Crear Alias (Opcional)

Si prefieres seguir usando `docker-compose` por costumbre, puedes crear un alias:

### Para Bash
```bash
echo 'alias docker-compose="docker compose"' >> ~/.bashrc
source ~/.bashrc
```

### Para Zsh
```bash
echo 'alias docker-compose="docker compose"' >> ~/.zshrc
source ~/.zshrc
```

## 🚨 Problemas Comunes

### 1. Docker no está corriendo
```bash
# macOS/Windows
# Inicia Docker Desktop desde Applications

# Linux
sudo systemctl start docker
sudo systemctl status docker
```

### 2. Permisos de Docker
```bash
# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Reiniciar sesión o ejecutar
newgrp docker
```

### 3. Puerto ya en uso
```bash
# Ver qué está usando el puerto
lsof -i :3001

# Matar proceso
kill -9 <PID>
```

### 4. Contenedores no se inician
```bash
# Ver logs de Docker
docker compose -f docker-compose.override.yml logs

# Ver logs de un servicio específico
docker compose -f docker-compose.override.yml logs backend-dev

# Reconstruir contenedores
docker compose -f docker-compose.override.yml build --no-cache
docker compose -f docker-compose.override.yml up -d
```

### 5. Problemas de red
```bash
# Verificar redes de Docker
docker network ls

# Crear red si es necesario
docker network create controlacceso_network

# Verificar conectividad
docker compose -f docker-compose.override.yml exec backend-dev ping database-dev
```

## 📋 Checklist de Verificación

- [ ] Docker está instalado (`docker --version`)
- [ ] Docker está corriendo (`docker info`)
- [ ] Docker Compose está disponible (`docker compose version`)
- [ ] Usuario tiene permisos de Docker
- [ ] Puertos necesarios están libres
- [ ] Script de verificación pasa (`./check-docker.sh`)

## 🎯 Comandos de Prueba

### Prueba Básica
```bash
# Verificar que todo funciona
docker compose -f docker-compose.override.yml up -d

# Verificar health checks
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health

# Ver logs
docker compose -f docker-compose.override.yml logs

# Detener
docker compose -f docker-compose.override.yml down
```

### Prueba de Entorno Individual
```bash
# Solo desarrollo
docker compose -f docker-compose.override.yml up -d backend-dev frontend-dev database-dev

# Solo pruebas
docker compose -f docker-compose.override.yml up -d backend-test frontend-test database-test

# Solo producción
docker compose -f docker-compose.override.yml up -d backend-prod frontend-prod database-prod
```

## 📞 Soporte

Si continúas teniendo problemas:

1. Ejecuta `./check-docker.sh` para diagnóstico automático
2. Verifica la versión de Docker: `docker --version`
3. Verifica que Docker esté corriendo: `docker info`
4. Revisa los logs: `docker compose -f docker-compose.override.yml logs`

---

*Troubleshooting Docker - Sistema de Control de Acceso v1.0*

**Última actualización**: Diciembre 2024
