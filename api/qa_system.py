from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import json

from services.prompt_engineering import PromptEngineer
from services.gpt_integration import GPTService

router = APIRouter()

# Initialize services
prompt_engineer = PromptEngineer()
gpt_service = GPTService()

# Pydantic models
class SingleModalityQARequest(BaseModel):
    question: str
    modality_type: str  # "tactile", "vision", or "text"
    modality_data: str

class DualModalityQARequest(BaseModel):
    question: str
    tactile_data: Optional[str] = None
    text_data: Optional[str] = None

class QAResponse(BaseModel):
    success: bool
    answer: Optional[str] = None
    error: Optional[str] = None
    question: str
    modalities_used: List[str]
    confidence_score: Optional[float] = None

@router.post("/single-modality", response_model=QAResponse)
async def single_modality_qa(request: SingleModalityQARequest):
    """
    Answer questions based on single modality input (tactile, vision, or text only).
    """
    try:
        # Validate modality type
        valid_modalities = ["tactile", "vision", "text"]
        if request.modality_type not in valid_modalities:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid modality type. Must be one of: {valid_modalities}"
            )
        
        # Prepare modality data
        modality_data = {request.modality_type: request.modality_data}
        
        # Generate QA prompt
        prompt = prompt_engineer.create_qa_prompt(request.question, modality_data)
        
        # Process with GPT
        result = await gpt_service.process_qa_request(request.question, modality_data)
        
        return QAResponse(
            success=result["success"],
            answer=result.get("response"),
            error=result.get("error"),
            question=request.question,
            modalities_used=[request.modality_type]
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/dual-modality", response_model=QAResponse)
async def dual_modality_qa(
    question: str = Form(...),
    tactile_data: Optional[str] = Form(None),
    text_data: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None)
):
    """
    Answer questions using dual modality inputs (combinations of tactile, vision, and text).
    """
    try:
        # Prepare context data
        context_data = {}
        modalities_used = []
        
        if tactile_data:
            context_data["tactile"] = tactile_data
            modalities_used.append("tactile")
        
        if text_data:
            context_data["text"] = text_data
            modalities_used.append("text")
        
        if image and image.content_type.startswith('image/'):
            image_data = await image.read()
            context_data["image"] = image_data
            modalities_used.append("vision")
        
        # Validate that we have at least one modality
        if not context_data:
            raise HTTPException(
                status_code=400, 
                detail="At least one modality input is required"
            )
        
        # Process with GPT
        result = await gpt_service.process_qa_request(question, context_data)
        
        return QAResponse(
            success=result["success"],
            answer=result.get("response"),
            error=result.get("error"),
            question=question,
            modalities_used=modalities_used
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/multimodal-qa", response_model=QAResponse)
async def multimodal_qa(
    question: str = Form(...),
    tactile_data: str = Form(...),
    text_data: str = Form(...),
    image: UploadFile = File(...)
):
    """
    Answer questions using all three modalities: tactile, vision, and text.
    This is the most comprehensive QA endpoint.
    """
    try:
        # Validate image file
        if not image.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read image data
        image_data = await image.read()
        
        # Prepare context data with all modalities
        context_data = {
            "tactile": tactile_data,
            "text": text_data,
            "image": image_data
        }
        
        # Process with GPT
        result = await gpt_service.process_qa_request(question, context_data)
        
        return QAResponse(
            success=result["success"],
            answer=result.get("response"),
            error=result.get("error"),
            question=question,
            modalities_used=["tactile", "vision", "text"]
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/contextual-qa", response_model=QAResponse)
async def contextual_qa(
    question: str = Form(...),
    context_instruction: str = Form(...),
    tactile_data: Optional[str] = Form(None),
    text_data: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None)
):
    """
    Answer questions with additional contextual instructions.
    This endpoint allows for more specific guidance on how to approach the question.
    """
    try:
        # Prepare context data
        context_data = {}
        modalities_used = []
        
        if tactile_data:
            context_data["tactile"] = tactile_data
            modalities_used.append("tactile")
        
        if text_data:
            context_data["text"] = text_data
            modalities_used.append("text")
        
        if image and image.content_type.startswith('image/'):
            image_data = await image.read()
            context_data["image"] = image_data
            modalities_used.append("vision")
        
        # Validate that we have at least one modality
        if not context_data:
            raise HTTPException(
                status_code=400, 
                detail="At least one modality input is required"
            )
        
        # Enhance question with context instruction
        enhanced_question = f"{question}\n\nContext Instructions: {context_instruction}"
        
        # Process with GPT
        result = await gpt_service.process_qa_request(enhanced_question, context_data)
        
        return QAResponse(
            success=result["success"],
            answer=result.get("response"),
            error=result.get("error"),
            question=enhanced_question,
            modalities_used=modalities_used
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sample-questions")
async def get_sample_questions():
    """
    Get sample questions for different modality combinations to help users get started.
    """
    try:
        sample_questions = {
            "single_modality": {
                "tactile": [
                    "What material feels smooth, has low friction, and is metallic?",
                    "Describe the texture characteristics of this tactile data.",
                    "What object would produce these tactile sensations?"
                ],
                "vision": [
                    "What material is shown in this image?",
                    "Describe the texture visible in this image.",
                    "What are the key visual characteristics of this object?"
                ],
                "text": [
                    "Based on this description, what material properties can be inferred?",
                    "What tactile sensations would this object likely produce?",
                    "What visual characteristics would you expect from this description?"
                ]
            },
            "dual_modality": [
                "Given this tactile pattern and image, identify the likely use of this material.",
                "How do the tactile and visual properties align for this object?",
                "What additional properties can be inferred from combining this tactile and visual data?",
                "Does the tactile data match what you would expect from the visual appearance?"
            ],
            "multimodal": [
                "Integrate all available information to identify this object and its potential uses.",
                "How do all three modalities (tactile, visual, textual) support or contradict each other?",
                "What comprehensive analysis can be made using all available data?",
                "Predict additional properties not directly observable from the given data."
            ]
        }
        
        return {
            "success": True,
            "sample_questions": sample_questions,
            "usage_tips": [
                "Start with specific questions about material properties",
                "Ask about correlations between different modalities",
                "Request predictions or inferences beyond the given data",
                "Use contextual instructions for more targeted analysis"
            ]
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/batch-qa")
async def batch_qa(
    questions_json: str = Form(...),
    tactile_data: Optional[str] = Form(None),
    text_data: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None)
):
    """
    Process multiple questions against the same set of multimodal data.
    Questions should be provided as a JSON array in the questions_json field.
    """
    try:
        # Parse questions from JSON
        try:
            questions = json.loads(questions_json)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid JSON format for questions")
        
        if not isinstance(questions, list):
            raise HTTPException(status_code=400, detail="Questions must be provided as an array")
        
        # Prepare context data
        context_data = {}
        modalities_used = []
        
        if tactile_data:
            context_data["tactile"] = tactile_data
            modalities_used.append("tactile")
        
        if text_data:
            context_data["text"] = text_data
            modalities_used.append("text")
        
        if image and image.content_type.startswith('image/'):
            image_data = await image.read()
            context_data["image"] = image_data
            modalities_used.append("vision")
        
        # Validate that we have at least one modality
        if not context_data:
            raise HTTPException(
                status_code=400, 
                detail="At least one modality input is required"
            )
        
        # Process each question
        results = []
        for question in questions:
            result = await gpt_service.process_qa_request(question, context_data)
            results.append({
                "question": question,
                "success": result["success"],
                "answer": result.get("response"),
                "error": result.get("error")
            })
        
        return {
            "success": True,
            "results": results,
            "modalities_used": modalities_used,
            "total_questions": len(questions)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 