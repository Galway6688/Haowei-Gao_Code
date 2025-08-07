import openai
import base64
import json
import os
from typing import Dict, Any, Optional, List
from PIL import Image
import io
from dotenv import load_dotenv
import httpx
import asyncio

# Load environment variables
load_dotenv()

class GPTService:
    def __init__(self):
        # Together AI 配置 - 兼容 OpenAI API
        self.api_key = "0440017c7e550247f094a703e2f4b5cf804bfaa44c3c6b2c74c725c98de61fe4"  # 你的 Together AI key
        self.model = "meta-llama/Llama-Vision-Free"  # Meta Llama Vision Free
        self.base_url = "https://api.together.xyz/v1"  # Together AI 的 API 端点
        self.max_tokens = 1500
        self.temperature = 0.7
        
        # Initialize OpenAI client with Together AI settings
        self.client = openai.OpenAI(
            api_key=self.api_key,
            base_url=self.base_url
        )
        
        # Meta Llama Vision Free 支持 vision，启用视觉功能
        self.vision_supported = True
    
    def encode_image(self, image_path: str) -> str:
        """Encode image to base64 string"""
        try:
            with open(image_path, "rb") as image_file:
                return base64.b64encode(image_file.read()).decode('utf-8')
        except Exception as e:
            raise ValueError(f"Error encoding image: {str(e)}")
    
    def encode_image_from_bytes(self, image_bytes: bytes) -> str:
        """Encode image bytes to base64 string"""
        return base64.b64encode(image_bytes).decode('utf-8')
    
    def resize_image_if_needed(self, image_bytes: bytes, max_size: int = 1024) -> bytes:
        """Resize image if it's too large"""
        try:
            image = Image.open(io.BytesIO(image_bytes))
            
            # Check if resizing is needed
            if max(image.size) > max_size:
                # Calculate new size maintaining aspect ratio
                ratio = max_size / max(image.size)
                new_size = tuple(int(dim * ratio) for dim in image.size)
                image = image.resize(new_size, Image.Resampling.LANCZOS)
            
            # Convert back to bytes
            output = io.BytesIO()
            image.save(output, format='JPEG', quality=85)
            return output.getvalue()
        except Exception as e:
            # If resizing fails, return original bytes
            return image_bytes
    
    async def generate_text_response(self, prompt: str, system_message: str = None) -> Dict[str, Any]:
        """Generate text-only response using configured model"""
        try:
            messages = []
            
            if system_message:
                messages.append({"role": "system", "content": system_message})
            
            messages.append({"role": "user", "content": prompt})
            
            response = await asyncio.to_thread(
                self.client.chat.completions.create,
                model=self.model,  # Use configured model
                messages=messages,
                max_tokens=self.max_tokens,
                temperature=self.temperature
            )
            
            return {
                "success": True,
                "response": response.choices[0].message.content,
                "usage": response.usage.dict() if response.usage else {},
                "model": self.model
            }
        
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "response": None
            }
    
    async def generate_vision_response(self, prompt: str, image_bytes: bytes, system_message: str = None) -> Dict[str, Any]:
        """Generate response using vision model for image + text analysis"""
        try:
            # Check if current model supports vision
            if not self.vision_supported:
                return {
                    "success": False,
                    "error": f"Current model '{self.model}' does not support vision. Please use a vision-capable model for image analysis.",
                    "response": None
                }
            
            # Resize image if needed
            processed_image = self.resize_image_if_needed(image_bytes)
            base64_image = self.encode_image_from_bytes(processed_image)
            
            messages = []
            
            if system_message:
                messages.append({"role": "system", "content": system_message})
            
            # Create message with image and text
            # Together AI uses a different format for vision models
            user_message = {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            }
            messages.append(user_message)
            
            response = await asyncio.to_thread(
                self.client.chat.completions.create,
                model=self.model,
                messages=messages,
                max_tokens=self.max_tokens,
                temperature=self.temperature,
                stream=False
            )
            
            return {
                "success": True,
                "response": response.choices[0].message.content,
                "usage": response.usage.dict() if response.usage else {},
                "model": self.model
            }
        
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "response": None
            }
    
    async def process_multimodal_request(self, 
                                       prompt: str, 
                                       tactile_data: Optional[str] = None,
                                       image_bytes: Optional[bytes] = None,
                                       text_context: Optional[str] = None) -> Dict[str, Any]:
        """Process a multimodal request with various input combinations"""
        
        # Construct enhanced prompt with available modalities
        enhanced_prompt = prompt
        
        if tactile_data:
            enhanced_prompt += f"\n\nTactile Information: {tactile_data}"
        
        if text_context:
            enhanced_prompt += f"\n\nTextual Context: {text_context}"
        
        # System message for multimodal reasoning
        system_message = (
            "You are an advanced AI system specialized in multimodal reasoning that can analyze "
            "tactile data, visual information, and textual descriptions. Provide comprehensive "
            "insights that integrate information from all available modalities. Focus on "
            "material properties, texture analysis, and practical applications."
        )
        
        # Choose appropriate method based on available inputs and model capabilities
        if image_bytes and self.vision_supported:
            return await self.generate_vision_response(enhanced_prompt, image_bytes, system_message)
        elif image_bytes and not self.vision_supported:
            # If image provided but model doesn't support vision, return error
            return {
                "success": False,
                "error": f"Image provided but current model '{self.model}' does not support vision analysis. Please use a vision-capable model.",
                "response": None
            }
        else:
            return await self.generate_text_response(enhanced_prompt, system_message)
    
    async def process_qa_request(self, 
                               question: str,
                               context_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process a question-answering request with multimodal context"""
        
        # Build context from available modalities
        context_parts = []
        
        if "tactile" in context_data:
            context_parts.append(f"Tactile Data: {context_data['tactile']}")
        
        if "text" in context_data:
            context_parts.append(f"Textual Information: {context_data['text']}")
        
        context_string = "\n".join(context_parts)
        
        qa_prompt = f"""
        Context Information:
        {context_string}
        
        Question: {question}
        
        Please provide a detailed answer based on the available context information.
        """
        
        # System message for QA tasks
        system_message = (
            "You are a specialized AI assistant for tactile-vision-text question answering. "
            "Analyze the provided multimodal context carefully and provide accurate, "
            "detailed answers. If information is insufficient, clearly state what's missing."
        )
        
        if "image" in context_data and self.vision_supported:
            return await self.generate_vision_response(
                qa_prompt, 
                context_data["image"], 
                system_message
            )
        elif "image" in context_data and not self.vision_supported:
            return {
                "success": False,
                "error": f"Image provided but current model '{self.model}' does not support vision analysis.",
                "response": None
            }
        else:
            return await self.generate_text_response(qa_prompt, system_message)
    
    async def generate_few_shot_response(self, 
                                       examples: List[Dict[str, Any]], 
                                       current_input: Dict[str, Any]) -> Dict[str, Any]:
        """Generate response using few-shot learning approach"""
        
        # Format examples
        example_texts = []
        for i, example in enumerate(examples, 1):
            example_text = f"Example {i}:"
            if "tactile" in example:
                example_text += f"\nTactile: {example['tactile']}"
            if "text" in example:
                example_text += f"\nText: {example['text']}"
            if "output" in example:
                example_text += f"\nExpected Output: {example['output']}"
            example_texts.append(example_text)
        
        examples_string = "\n\n".join(example_texts)
        
        # Format current input
        current_input_text = "Current Input:"
        if "tactile" in current_input:
            current_input_text += f"\nTactile: {current_input['tactile']}"
        if "text" in current_input:
            current_input_text += f"\nText: {current_input['text']}"
        
        few_shot_prompt = f"""
        Here are some examples of tactile-vision-text analysis:
        
        {examples_string}
        
        {current_input_text}
        
        Please analyze the current input following the same pattern as the examples.
        """
        
        system_message = (
            "You are learning from examples to perform multimodal analysis. "
            "Follow the pattern demonstrated in the examples to analyze new inputs."
        )
        
        if "image" in current_input and self.vision_supported:
            return await self.generate_vision_response(
                few_shot_prompt, 
                current_input["image"], 
                system_message
            )
        elif "image" in current_input and not self.vision_supported:
            return {
                "success": False,
                "error": f"Image provided but current model '{self.model}' does not support vision analysis.",
                "response": None
            }
        else:
            return await self.generate_text_response(few_shot_prompt, system_message)
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the current model configuration"""
        return {
            "model": self.model,
            "base_url": self.base_url,
            "max_tokens": self.max_tokens,
            "temperature": self.temperature,
            "vision_supported": self.vision_supported
        } 