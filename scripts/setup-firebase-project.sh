#!/bin/bash

# Firebase Project Setup Script for ControlAcceso
# This script helps with the initial Firebase project configuration

set -e  # Exit on any error

echo "🔥 Firebase Project Setup for ControlAcceso"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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
    print_error "Firebase CLI is not installed. Installing now..."
    npm install -g firebase-tools
fi

print_status "Firebase CLI version: $(firebase --version)"

# Login to Firebase if not already logged in
if ! firebase projects:list &> /dev/null; then
    print_status "Logging in to Firebase..."
    firebase login
fi

# Get project ID from user
read -p "Enter your Firebase Project ID: " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    print_error "Project ID cannot be empty"
    exit 1
fi

# Set the project
print_status "Setting Firebase project to: $PROJECT_ID"
firebase use $PROJECT_ID

# Initialize Firebase features
print_status "Initializing Firebase features..."

# Note: Since firebase init is interactive, we'll provide instructions instead
echo ""
print_warning "Manual Firebase initialization required:"
echo "1. Run: firebase init"
echo "2. Select the following features:"
echo "   - ✅ Firestore: Configure security rules and indexes files"
echo "   - ✅ Functions: Configure a Cloud Functions directory"
echo "   - ✅ Hosting: Configure files for Firebase Hosting"
echo "   - ✅ Storage: Configure a security rules file for Cloud Storage"
echo ""
echo "3. Use these settings:"
echo "   - Firestore rules file: firestore.rules"
echo "   - Firestore indexes file: firestore.indexes.json"
echo "   - Functions source directory: backend"
echo "   - Public directory for hosting: frontend/build"
echo "   - Configure as single-page app: Yes"
echo "   - Storage rules file: storage.rules"
echo ""

read -p "Have you completed the firebase init process? (y/n): " INIT_COMPLETE

if [ "$INIT_COMPLETE" != "y" ]; then
    print_warning "Please complete firebase init first, then run this script again"
    exit 0
fi

# Create environment file template
create_env_file() {
    local env_file="frontend/.env.production"
    
    print_status "Creating environment file template: $env_file"
    
    cat > "$env_file" << EOF
# Firebase Configuration
# Replace these values with your actual Firebase config
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=${PROJECT_ID}.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=${PROJECT_ID}
REACT_APP_FIREBASE_STORAGE_BUCKET=${PROJECT_ID}.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
REACT_APP_FIREBASE_APP_ID=your_app_id_here
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id_here

# API Configuration
REACT_APP_API_URL=https://us-central1-${PROJECT_ID}.cloudfunctions.net/api
REACT_APP_ENV=production

# Optional: Enable emulators for development
REACT_APP_USE_FIREBASE_EMULATOR=false
EOF
    
    print_success "Environment file created: $env_file"
    print_warning "⚠️  Remember to update the Firebase configuration values!"
}

# Update firebase.json with project-specific settings
update_firebase_config() {
    print_status "Updating firebase.json configuration..."
    
    # Backup original firebase.json if it exists
    if [ -f "firebase.json" ]; then
        cp firebase.json firebase.json.backup
        print_status "Backed up existing firebase.json"
    fi
    
    # Create or update firebase.json
    cat > firebase.json << EOF
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "functions": [
    {
      "source": "backend",
      "codebase": "default",
      "ignore": [
        "node_modules",
        ".git",
        "firebase-debug.log",
        "firebase-debug.*.log"
      ],
      "predeploy": []
    }
  ],
  "hosting": {
    "public": "frontend/build",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/static/**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  },
  "storage": {
    "rules": "storage.rules"
  },
  "emulators": {
    "auth": {
      "port": 9099
    },
    "functions": {
      "port": 5001
    },
    "firestore": {
      "port": 8080
    },
    "hosting": {
      "port": 5000
    },
    "storage": {
      "port": 9199
    },
    "ui": {
      "enabled": true,
      "port": 4000
    },
    "singleProjectMode": true
  }
}
EOF
    
    print_success "firebase.json updated"
}

# Setup Firebase Admin SDK service account
setup_service_account() {
    print_status "Setting up Firebase Admin SDK..."
    
    echo ""
    print_warning "To use Firebase Admin SDK, you need to:"
    echo "1. Go to Firebase Console > Project Settings > Service Accounts"
    echo "2. Click 'Generate new private key'"
    echo "3. Download the JSON file"
    echo "4. Save it as 'backend/serviceAccountKey.json'"
    echo "5. Add 'serviceAccountKey.json' to your .gitignore"
    echo ""
    echo "For production deployment, use environment variables instead:"
    echo "export GOOGLE_APPLICATION_CREDENTIALS='path/to/serviceAccountKey.json'"
    echo ""
}

# Install dependencies
install_dependencies() {
    print_status "Installing project dependencies..."
    
    # Install frontend dependencies
    if [ -d "frontend" ]; then
        print_status "Installing frontend dependencies..."
        cd frontend
        npm install
        cd ..
        print_success "Frontend dependencies installed"
    fi
    
    # Install backend dependencies
    if [ -d "backend" ]; then
        print_status "Installing backend dependencies..."
        cd backend
        npm install
        cd ..
        print_success "Backend dependencies installed"
    fi
    
    # Install migration dependencies
    if [ -d "migration" ]; then
        print_status "Installing migration dependencies..."
        cd migration
        npm install
        cd ..
        print_success "Migration dependencies installed"
    fi
}

# Test Firebase configuration
test_configuration() {
    print_status "Testing Firebase configuration..."
    
    # Test Firebase project access
    if firebase projects:list | grep -q "$PROJECT_ID"; then
        print_success "Firebase project access confirmed"
    else
        print_error "Cannot access Firebase project: $PROJECT_ID"
        return 1
    fi
    
    # Test Firebase services
    firebase use $PROJECT_ID
    print_success "Firebase configuration test completed"
}

# Main setup function
main() {
    print_status "Starting Firebase project setup..."
    
    # Create environment file
    create_env_file
    
    # Update Firebase configuration
    update_firebase_config
    
    # Setup service account instructions
    setup_service_account
    
    # Install dependencies
    install_dependencies
    
    # Test configuration
    test_configuration
    
    print_success "Firebase project setup completed! 🎉"
    
    echo ""
    print_status "Next steps:"
    echo "1. Update the environment file with your Firebase config:"
    echo "   frontend/.env.production"
    echo ""
    echo "2. Set up Firebase Admin SDK credentials:"
    echo "   Download service account key to backend/serviceAccountKey.json"
    echo ""
    echo "3. Enable Firebase services in the console:"
    echo "   - Authentication (Email/Password)"
    echo "   - Firestore Database"
    echo "   - Cloud Storage"
    echo "   - Cloud Functions"
    echo ""
    echo "4. Run migration (if needed):"
    echo "   cd migration && npm run migrate"
    echo ""
    echo "5. Deploy your application:"
    echo "   ./scripts/deploy-firebase.sh"
    echo ""
    echo "6. Test your application:"
    echo "   https://$PROJECT_ID.web.app"
}

# Run main function
main

print_success "Setup script completed successfully! 🚀"

