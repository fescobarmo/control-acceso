#!/bin/bash

# Firebase Deployment Script for ControlAcceso
# This script handles the complete deployment process

set -e  # Exit on any error

echo "🔥 Starting Firebase deployment for ControlAcceso"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    print_error "Firebase CLI is not installed. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in to Firebase
if ! firebase projects:list &> /dev/null; then
    print_error "You are not logged in to Firebase. Please run:"
    echo "firebase login"
    exit 1
fi

# Get current project
PROJECT_ID=$(firebase use | grep "Now using project" | cut -d' ' -f4 || echo "")
if [ -z "$PROJECT_ID" ]; then
    print_error "No Firebase project selected. Please run:"
    echo "firebase use PROJECT_ID"
    exit 1
fi

print_status "Using Firebase project: $PROJECT_ID"

# Check if we're in the right directory
if [ ! -f "firebase.json" ]; then
    print_error "firebase.json not found. Please run this script from the project root."
    exit 1
fi

# Function to build frontend
build_frontend() {
    print_status "Building frontend..."
    
    cd frontend
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        npm install
    fi
    
    # Create production build
    print_status "Creating production build..."
    npm run build
    
    if [ ! -d "build" ]; then
        print_error "Frontend build failed - build directory not found"
        exit 1
    fi
    
    print_success "Frontend build completed"
    cd ..
}

# Function to prepare backend
prepare_backend() {
    print_status "Preparing backend for Cloud Functions..."
    
    cd backend
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_status "Installing backend dependencies..."
        npm install
    fi
    
    # Check if all required files exist
    if [ ! -f "index.js" ]; then
        print_error "Backend index.js not found"
        exit 1
    fi
    
    if [ ! -f "package.json" ]; then
        print_error "Backend package.json not found"
        exit 1
    fi
    
    print_success "Backend preparation completed"
    cd ..
}

# Function to deploy specific services
deploy_service() {
    local service=$1
    local description=$2
    
    print_status "Deploying $description..."
    
    if firebase deploy --only $service; then
        print_success "$description deployed successfully"
    else
        print_error "Failed to deploy $description"
        exit 1
    fi
}

# Function to run full deployment
deploy_all() {
    print_status "Deploying all services..."
    
    if firebase deploy; then
        print_success "All services deployed successfully"
    else
        print_error "Deployment failed"
        exit 1
    fi
}

# Main deployment logic
main() {
    # Parse command line arguments
    case ${1:-all} in
        "frontend"|"hosting")
            build_frontend
            deploy_service "hosting" "Frontend (Hosting)"
            ;;
        "backend"|"functions")
            prepare_backend
            deploy_service "functions" "Backend (Cloud Functions)"
            ;;
        "firestore"|"database")
            deploy_service "firestore" "Database Rules"
            ;;
        "storage")
            deploy_service "storage" "Storage Rules"
            ;;
        "rules")
            deploy_service "firestore" "Firestore Rules"
            deploy_service "storage" "Storage Rules"
            ;;
        "all"|"")
            build_frontend
            prepare_backend
            deploy_all
            ;;
        "help"|"-h"|"--help")
            echo "Usage: $0 [SERVICE]"
            echo ""
            echo "Services:"
            echo "  frontend, hosting    Deploy only frontend"
            echo "  backend, functions   Deploy only backend"
            echo "  firestore, database  Deploy only Firestore rules"
            echo "  storage              Deploy only Storage rules"
            echo "  rules                Deploy all rules"
            echo "  all                  Deploy everything (default)"
            echo "  help                 Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                   # Deploy everything"
            echo "  $0 frontend          # Deploy only frontend"
            echo "  $0 backend           # Deploy only backend"
            echo "  $0 rules             # Deploy only rules"
            exit 0
            ;;
        *)
            print_error "Unknown service: $1"
            echo "Use '$0 help' for usage information"
            exit 1
            ;;
    esac
}

# Cleanup function
cleanup() {
    print_status "Cleaning up..."
    # Add any cleanup logic here if needed
}

# Set up trap for cleanup on exit
trap cleanup EXIT

# Run main function
main "$@"

print_success "Deployment completed successfully! 🎉"
print_status "You can view your app at: https://$PROJECT_ID.web.app"
print_status "API endpoint: https://us-central1-$PROJECT_ID.cloudfunctions.net/api"

echo ""
print_status "Next steps:"
echo "1. Test your application at the hosting URL"
echo "2. Check Cloud Functions logs: firebase functions:log"
echo "3. Monitor performance in Firebase Console"
echo "4. Set up monitoring and alerts"

