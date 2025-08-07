from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, FileResponse
from pydantic import BaseModel
from typing import Optional, List
import os
import uvicorn
from pathlib import Path

# Import our custom modules
from api.multimodal_reasoning import router as multimodal_router
# from api.qa_system import router as qa_router
from services.prompt_engineering import PromptEngineer
from services.gpt_integration import GPTService

app = FastAPI(
    title="Tactile-Text-Vision Multimodal Reasoning System",
    description="Interactive web-based application for multimodal reasoning using GPT",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(multimodal_router, tags=["Multimodal Reasoning"])
# app.include_router(qa_router, tags=["Question Answering"])

# Create upload directory
upload_dir = Path("uploads")
upload_dir.mkdir(exist_ok=True)

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "Tactile-Text-Vision Multimodal Reasoning System is running"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 