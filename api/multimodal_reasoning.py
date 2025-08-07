from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
import json
import os
import aiofiles

from services.gpt_integration import GPTService
from services.prompt_engineering import PromptEngineer, TaskType, ModalityType

router = APIRouter(prefix="/api/multimodal", tags=["multimodal"])

# Initialize services
gpt_service = GPTService()
prompt_engineer = PromptEngineer()

# Pydantic models for request/response
class MultimodalRequest(BaseModel):
    prompt: str
    tactile_data: Optional[str] = None
    text_context: Optional[str] = None
    prompt_type: Optional[str] = "tactile-text"

class MultimodalResponse(BaseModel):
    success: bool
    response: Optional[str] = None
    error: Optional[str] = None
    prompt_used: Optional[str] = None
    model_info: Optional[Dict[str, Any]] = None

class FewShotRequest(BaseModel):
    examples: List[Dict[str, Any]]
    current_input: Dict[str, Any]

class TemplateRequest(BaseModel):
    name: str
    template: str
    description: Optional[str] = None

# Create upload directory if it doesn't exist
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def save_upload_file(upload_file: UploadFile, file_prefix: str = "file") -> str:
    """Save uploaded file and return the file path"""
    file_extension = os.path.splitext(upload_file.filename)[1]
    file_path = os.path.join(UPLOAD_DIR, f"{file_prefix}_{upload_file.filename}")
    
    async with aiofiles.open(file_path, 'wb') as f:
        content = await upload_file.read()
        await f.write(content)
    
    return file_path

async def read_tactile_file(file_path: str) -> str:
    """Read and parse tactile data file"""
    try:
        async with aiofiles.open(file_path, 'r', encoding='utf-8') as f:
            content = await f.read()
            
        # Try to parse as JSON first
        try:
            data = json.loads(content)
            return f"Tactile data (JSON): {json.dumps(data, indent=2)}"
        except json.JSONDecodeError:
            # If not JSON, treat as plain text
            return f"Tactile data (Text): {content}"
            
    except Exception as e:
        return f"Error reading tactile file: {str(e)}"

@router.post("/unified-analysis", response_model=MultimodalResponse)
async def unified_multimodal_analysis(
    prompt: str = Form(...),
    prompt_type: str = Form("Tactile-Text"),
    tactile_file: Optional[UploadFile] = File(None),
    image: Optional[UploadFile] = File(None),
    text_context: Optional[str] = Form(None),
    add_contextual_info: bool = Form(False)
):
    """
    统一的多模态分析端点 - 支持触觉文件、图片和文本的任意组合
    """
    try:
        # 处理触觉数据
        tactile_data = None
        if tactile_file:
            tactile_file_path = await save_upload_file(tactile_file, "tactile")
            tactile_data = await read_tactile_file(tactile_file_path)
            # 处理完后删除临时文件
            try:
                os.remove(tactile_file_path)
            except:
                pass

        # 处理图片数据
        image_bytes = None
        if image:
            image_bytes = await image.read()

        # 构建增强的prompt
        enhanced_prompt = prompt
        
        if tactile_data and "tactile" in prompt_type.lower():
            enhanced_prompt += f"\n\nTactile Information:\n{tactile_data}"
        
        if text_context:
            enhanced_prompt += f"\n\nTextual Context:\n{text_context}"
        
        if add_contextual_info:
            enhanced_prompt += f"\n\nPlease provide detailed analysis considering all available modalities and their interactions."

        # 根据prompt类型选择处理方式
        if image_bytes and ("vision" in prompt_type.lower() or "combined" in prompt_type.lower()):
            # 使用vision模型
            result = await gpt_service.generate_vision_response(
                enhanced_prompt, 
                image_bytes,
                system_message="You are an advanced multimodal AI assistant specialized in analyzing tactile, visual, and textual information."
            )
        else:
            # 使用文本模型
            result = await gpt_service.generate_text_response(
                enhanced_prompt,
                system_message="You are an advanced multimodal AI assistant specialized in analyzing tactile and textual information."
            )

        return MultimodalResponse(
            success=result["success"],
            response=result.get("response"),
            error=result.get("error"),
            prompt_used=enhanced_prompt,
            model_info=gpt_service.get_model_info()
        )

    except Exception as e:
        return MultimodalResponse(
            success=False,
            error=f"Processing failed: {str(e)}"
        )

# 保留原有的端点以保持兼容性
@router.post("/tactile-text", response_model=MultimodalResponse)
async def analyze_tactile_text(request: MultimodalRequest):
    """Analyze tactile and text data combination"""
    try:
        prompt = prompt_engineer.create_tactile_text_prompt(
            request.tactile_data or "",
            request.text_context or "",
            request.prompt
        )
        
        result = await gpt_service.generate_text_response(prompt)
        
        return MultimodalResponse(
            success=result["success"],
            response=result.get("response"),
            error=result.get("error"),
            prompt_used=prompt,
            model_info=gpt_service.get_model_info()
        )
    
    except Exception as e:
        return MultimodalResponse(
            success=False,
            error=f"Analysis failed: {str(e)}"
        )

@router.post("/vision-text", response_model=MultimodalResponse)
async def analyze_vision_text(
    prompt: str = Form(...),
    text_context: Optional[str] = Form(None),
    image: UploadFile = File(...)
):
    """Analyze vision and text data combination"""
    try:
        image_bytes = await image.read()
        
        enhanced_prompt = prompt
        if text_context:
            enhanced_prompt += f"\n\nText Context: {text_context}"
        
        full_prompt = prompt_engineer.create_vision_text_prompt(
            enhanced_prompt,
            text_context or ""
        )
        
        result = await gpt_service.generate_vision_response(full_prompt, image_bytes)
        
        return MultimodalResponse(
            success=result["success"],
            response=result.get("response"),
            error=result.get("error"),
            prompt_used=full_prompt,
            model_info=gpt_service.get_model_info()
        )
    
    except Exception as e:
        return MultimodalResponse(
            success=False,
            error=f"Analysis failed: {str(e)}"
        )

@router.post("/multimodal-complete", response_model=MultimodalResponse)
async def analyze_multimodal_complete(
    prompt: str = Form(...),
    tactile_data: Optional[str] = Form(None),
    text_context: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None)
):
    """Complete multimodal analysis with all data types"""
    try:
        image_bytes = None
        if image:
            image_bytes = await image.read()
        
        result = await gpt_service.process_multimodal_request(
            prompt=prompt,
            tactile_data=tactile_data,
            image_bytes=image_bytes,
            text_context=text_context
        )
        
        return MultimodalResponse(
            success=result["success"],
            response=result.get("response"),
            error=result.get("error"),
            prompt_used=prompt,
            model_info=gpt_service.get_model_info()
        )
    
    except Exception as e:
        return MultimodalResponse(
            success=False,
            error=f"Analysis failed: {str(e)}"
        )

@router.post("/few-shot-learning", response_model=MultimodalResponse)
async def few_shot_learning_analysis(request: FewShotRequest):
    """Perform few-shot learning analysis"""
    try:
        result = await gpt_service.generate_few_shot_response(
            request.examples,
            request.current_input
        )
        
        return MultimodalResponse(
            success=result["success"],
            response=result.get("response"),
            error=result.get("error"),
            model_info=gpt_service.get_model_info()
        )
    
    except Exception as e:
        return MultimodalResponse(
            success=False,
            error=f"Few-shot learning failed: {str(e)}"
        )

@router.get("/available-templates")
async def get_available_templates():
    """Get all available prompt templates"""
    try:
        templates = prompt_engineer.get_available_templates()
        return {"success": True, "templates": templates}
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.post("/custom-template")
async def add_custom_template(request: TemplateRequest):
    """Add a custom prompt template"""
    try:
        success = prompt_engineer.add_custom_template(
            request.name,
            request.template,
            request.description
        )
        return {"success": success}
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.get("/model-info")
async def get_model_info():
    """Get current model information"""
    try:
        info = gpt_service.get_model_info()
        return {"success": True, "model_info": info}
    except Exception as e:
        return {"success": False, "error": str(e)} 