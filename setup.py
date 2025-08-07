#!/usr/bin/env python3
"""
Setup script for Tactile-Text-Vision Multimodal Reasoning System
"""

import os
import sys
import subprocess
from pathlib import Path

def create_env_file():
    """Create .env file from template if it doesn't exist"""
    env_file = Path('.env')
    if not env_file.exists():
        print("Creating .env file...")
        with open(env_file, 'w') as f:
            f.write("""# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Model Settings
OPENAI_MODEL=gpt-4-vision-preview

# File Upload Settings
MAX_FILE_SIZE=10485760

# Server Configuration (optional)
# HOST=0.0.0.0
# PORT=8000

# Logging Level (optional)
# LOG_LEVEL=INFO
""")
        print("✅ .env file created! Please edit it and add your OpenAI API key.")
        return False
    else:
        print("✅ .env file already exists.")
        return True

def install_dependencies():
    """Install Python dependencies"""
    print("Installing Python dependencies...")
    try:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'])
        print("✅ Dependencies installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing dependencies: {e}")
        return False

def create_directories():
    """Create necessary directories"""
    directories = ['uploads', 'static']
    for directory in directories:
        Path(directory).mkdir(exist_ok=True)
    print("✅ Directories created.")

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required!")
        return False
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detected.")
    return True

def main():
    """Main setup function"""
    print("🚀 Setting up Tactile-Text-Vision Multimodal Reasoning System")
    print("=" * 60)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Create directories
    create_directories()
    
    # Install dependencies
    if not install_dependencies():
        sys.exit(1)
    
    # Create .env file
    env_created = create_env_file()
    
    print("\n" + "=" * 60)
    print("🎉 Setup completed!")
    
    if not env_created:
        print("\n📝 Next steps:")
        print("1. Edit the .env file and add your OpenAI API key")
        print("2. Run: python main.py")
        print("3. Open http://localhost:8000 in your browser")
    else:
        print("\n📝 To start the application:")
        print("1. Run: python main.py")
        print("2. Open http://localhost:8000 in your browser")
    
    print("\n📚 For more information, see README.md")

if __name__ == "__main__":
    main() 