from typing import Dict, List, Optional, Any
from enum import Enum
import json

class ModalityType(Enum):
    TACTILE = "tactile"
    VISION = "vision"
    TEXT = "text"

class TaskType(Enum):
    DESCRIPTION = "description"
    QA = "question_answering"
    ALIGNMENT = "alignment"
    PREDICTION = "prediction"

class PromptTemplate:
    def __init__(self, template: str, required_inputs: List[str]):
        self.template = template
        self.required_inputs = required_inputs
    
    def format(self, **kwargs) -> str:
        """Format the template with provided inputs"""
        return self.template.format(**kwargs)

class PromptEngineer:
    def __init__(self):
        self.templates = self._initialize_templates()
    
    def _initialize_templates(self) -> Dict[str, PromptTemplate]:
        """Initialize all prompt templates for different modality combinations"""
        return {
            # Single modality prompts
            "tactile_description": PromptTemplate(
                "Given the tactile data describing {tactile_properties}, provide a detailed textual description of how this material would feel and its likely characteristics. "
                "Tactile Data: {tactile_data}\n"
                "Please describe the texture, material type, and potential use cases.",
                ["tactile_properties", "tactile_data"]
            ),
            
            "vision_description": PromptTemplate(
                "Analyze the provided image and give a detailed description of the object's visual characteristics, including texture, material, and appearance. "
                "Focus on aspects that would be relevant for tactile understanding.\n"
                "Describe what you see in detail:",
                []
            ),
            
            # Dual modality prompts
            "tactile_text_alignment": PromptTemplate(
                "Given the tactile data and textual description below, analyze how well they align and provide insights about the object.\n"
                "Tactile Data: {tactile_data}\n"
                "Text Description: {text_description}\n"
                "Task: {task_instruction}",
                ["tactile_data", "text_description", "task_instruction"]
            ),
            
            "vision_text_analysis": PromptTemplate(
                "Analyze the provided image along with the textual description to provide comprehensive insights.\n"
                "Text Description: {text_description}\n"
                "Task: {task_instruction}\n"
                "Consider both visual and textual information in your response.",
                ["text_description", "task_instruction"]
            ),
            
            # Triple modality prompts
            "multimodal_complete": PromptTemplate(
                "You are analyzing an object using three types of information: tactile data, visual data (image), and textual description. "
                "Please provide a comprehensive analysis that integrates all three modalities.\n\n"
                "Tactile Data: {tactile_data}\n"
                "Text Description: {text_description}\n"
                "Task: {task_instruction}\n\n"
                "Please provide a detailed response that considers all available information sources.",
                ["tactile_data", "text_description", "task_instruction"]
            ),
            
            # QA-specific prompts
            "single_modality_qa": PromptTemplate(
                "Answer the following question based on the {modality_type} information provided:\n"
                "Question: {question}\n"
                "{modality_type} Data: {modality_data}\n"
                "Please provide a clear and detailed answer.",
                ["modality_type", "question", "modality_data"]
            ),
            
            "dual_modality_qa": PromptTemplate(
                "Answer the following question using both tactile and visual information:\n"
                "Question: {question}\n"
                "Tactile Data: {tactile_data}\n"
                "Additional Context: {additional_context}\n"
                "Please integrate information from both sources in your answer.",
                ["question", "tactile_data", "additional_context"]
            ),
            
            # Few-shot learning template
            "few_shot_example": PromptTemplate(
                "Here are some examples of tactile-vision-text analysis:\n\n"
                "{examples}\n\n"
                "Now analyze the following data in the same format:\n"
                "Tactile Data: {tactile_data}\n"
                "Text Description: {text_description}\n"
                "Please provide your analysis:",
                ["examples", "tactile_data", "text_description"]
            )
        }
    
    def generate_prompt(self, template_name: str, **kwargs) -> str:
        """Generate a prompt using the specified template and inputs"""
        if template_name not in self.templates:
            raise ValueError(f"Template '{template_name}' not found")
        
        template = self.templates[template_name]
        
        # Check if all required inputs are provided
        missing_inputs = []
        for required_input in template.required_inputs:
            if required_input not in kwargs:
                missing_inputs.append(required_input)
        
        if missing_inputs:
            raise ValueError(f"Missing required inputs: {missing_inputs}")
        
        return template.format(**kwargs)
    
    def create_tactile_text_prompt(self, tactile_data: str, task_instruction: str) -> str:
        """Create a prompt for tactile-text analysis"""
        return self.generate_prompt(
            "tactile_description",
            tactile_properties="the provided sensor data",
            tactile_data=tactile_data
        )
    
    def create_vision_text_prompt(self, text_description: str, task_instruction: str) -> str:
        """Create a prompt for vision-text analysis"""
        return self.generate_prompt(
            "vision_text_analysis",
            text_description=text_description,
            task_instruction=task_instruction
        )
    
    def create_multimodal_prompt(self, tactile_data: str, text_description: str, task_instruction: str) -> str:
        """Create a prompt that combines all three modalities"""
        return self.generate_prompt(
            "multimodal_complete",
            tactile_data=tactile_data,
            text_description=text_description,
            task_instruction=task_instruction
        )
    
    def create_qa_prompt(self, question: str, modality_data: Dict[str, Any]) -> str:
        """Create a QA prompt based on available modalities"""
        if len(modality_data) == 1:
            modality_type = list(modality_data.keys())[0]
            modality_value = list(modality_data.values())[0]
            
            return self.generate_prompt(
                "single_modality_qa",
                modality_type=modality_type,
                question=question,
                modality_data=modality_value
            )
        else:
            # Handle dual/multi-modality QA
            tactile_data = modality_data.get("tactile", "Not provided")
            additional_context = f"Vision: {modality_data.get('vision', 'Not provided')}, Text: {modality_data.get('text', 'Not provided')}"
            
            return self.generate_prompt(
                "dual_modality_qa",
                question=question,
                tactile_data=tactile_data,
                additional_context=additional_context
            )
    
    def create_few_shot_prompt(self, examples: List[Dict], tactile_data: str, text_description: str) -> str:
        """Create a few-shot learning prompt with examples"""
        formatted_examples = []
        for i, example in enumerate(examples, 1):
            formatted_examples.append(
                f"Example {i}:\n"
                f"Tactile Data: {example.get('tactile', '')}\n"
                f"Vision Data: {example.get('vision', 'Image provided')}\n"
                f"Text Output: {example.get('output', '')}\n"
            )
        
        examples_text = "\n".join(formatted_examples)
        
        return self.generate_prompt(
            "few_shot_example",
            examples=examples_text,
            tactile_data=tactile_data,
            text_description=text_description
        )
    
    def get_available_templates(self) -> List[str]:
        """Get list of available template names"""
        return list(self.templates.keys())
    
    def add_custom_template(self, name: str, template: str, required_inputs: List[str]) -> None:
        """Add a custom prompt template"""
        self.templates[name] = PromptTemplate(template, required_inputs) 