#!/bin/bash

echo "🚀 Script para subir el proyecto a GitHub"
echo "=========================================="

# Solicitar el nombre de usuario de GitHub
read -p "Ingresa tu nombre de usuario de GitHub: " GITHUB_USER

if [ -z "$GITHUB_USER" ]; then
    echo "❌ Error: Debes ingresar un nombre de usuario"
    exit 1
fi

echo "✅ Usuario de GitHub: $GITHUB_USER"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -d ".git" ]; then
    echo "❌ Error: No estás en un repositorio Git"
    echo "Asegúrate de estar en el directorio /Users/fescobarmo/ControlAcceso"
    exit 1
fi

echo "📋 Verificando estado del repositorio..."
git status

echo ""
echo "🔗 Agregando repositorio remoto..."
git remote add origin https://github.com/$GITHUB_USER/control-acceso.git

echo ""
echo "✅ Verificando repositorio remoto..."
git remote -v

echo ""
echo "📤 Subiendo código a GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "🎉 ¡Proyecto subido exitosamente!"
echo "🌐 Puedes ver tu repositorio en: https://github.com/$GITHUB_USER/control-acceso"
echo ""
echo "📝 Próximos pasos:"
echo "1. Ve a tu repositorio en GitHub"
echo "2. Verifica que todos los archivos estén presentes"
echo "3. Revisa que el README se muestre correctamente"
echo "4. Agrega topics al repositorio: control-acceso, react, nodejs, postgresql, docker"
