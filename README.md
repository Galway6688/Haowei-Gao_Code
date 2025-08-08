# Multimodal Analysis Platform

A web-based platform for analyzing tactile, visual, and textual data using modern AI techniques. Built with FastAPI and React.

[![Python](https://img.shields.io/badge/python-3.13+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.95+-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/react-18.2+-61dafb.svg)](https://reactjs.org/)

## Overview

This platform enables comprehensive analysis of multimodal data through an intuitive web interface. It supports multiple analysis modes and provides real-time processing capabilities.

## Features

- Multiple analysis modes (Vision-Text, Tactile-Text, Combined)
- Real-time data processing
- Interactive file upload system
- Dynamic prompt engineering
- Responsive modern UI

## Quick Start

### Prerequisites

- Python 3.13+
- Node.js 16+
- npm or yarn

### Backend Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
.
├── api/                    # FastAPI endpoints
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   └── services/      # API services
├── services/              # Backend services
└── main.py               # Main application entry
```

## API Documentation

Key endpoints:

- `POST /api/multimodal/unified-analysis` - Process multimodal data
- `POST /api/multimodal/vision-text` - Vision-text analysis
- `POST /api/multimodal/tactile-text` - Tactile-text analysis

Full API documentation available at `http://localhost:8000/docs`

## Development

The project uses:

- FastAPI for backend services
- React with styled-components for frontend
- Together AI API for AI processing
- Python multipart for file handling

## Configuration

Create a `.env` file in the root directory:

```env
TOGETHER_AI_KEY=your_api_key
```

## Contact

Haowei Gao - Department of Bioengineering, Imperial College London