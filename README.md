# Tactile-Text-Vision Multimodal Reasoning System

An interactive web-based application that leverages GPT models to align tactile, visual, and textual modalities for advanced multimodal reasoning and understanding.

## 🌟 Features

### Core Capabilities
- **Multimodal Analysis**: Combine tactile data, visual information, and text for comprehensive analysis
- **Question Answering**: Single, dual, and multi-modality question answering system
- **Few-Shot Learning**: Learn from examples to analyze new multimodal data
- **Prompt Engineering**: Advanced prompt templates for different modality combinations
- **Interactive Web Interface**: Modern, responsive UI with real-time processing

### Supported Modality Combinations
1. **Tactile + Text**: Analyze tactile sensor data with textual descriptions
2. **Vision + Text**: Process images with accompanying text descriptions  
3. **Tactile + Vision + Text**: Complete multimodal analysis using all three modalities
4. **Custom Prompts**: Create and use custom prompt templates for specialized tasks

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- OpenAI API key with GPT-4 and GPT-4 Vision access

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tactile-text-vision-reasoning
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file
   cp .env.example .env
   
   # Edit .env and add your OpenAI API key
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=gpt-4-vision-preview
   MAX_FILE_SIZE=10485760
   ```

4. **Run the application**
   ```bash
   python main.py
   ```

5. **Access the application**
   Open your browser and navigate to `http://localhost:8000`

## 📖 Usage Guide

### Multimodal Analysis

#### Tactile + Text Analysis
1. Navigate to the "Multimodal Analysis" tab
2. Select "Tactile + Text" mode
3. Enter tactile data description (e.g., "smooth, metallic, high friction")
4. Provide task instruction (e.g., "identify material and predict use cases")
5. Click "Analyze" to get comprehensive insights

#### Vision + Text Analysis
1. Select "Vision + Text" mode
2. Upload an image file
3. Enter text description
4. Specify analysis requirements
5. Process to get multimodal insights

#### Complete Multimodal Analysis
1. Select "All Modalities" mode
2. Provide tactile data, upload image, and enter text description
3. Specify comprehensive analysis requirements
4. Get integrated analysis from all three modalities

### Question Answering

#### Single Modality QA
```python
# Example questions:
- "What material feels smooth, has low friction, and is metallic?"
- "Describe the texture characteristics of this tactile data"
- "What are the key visual characteristics of this object?"
```

#### Dual Modality QA
```python
# Example questions:
- "Given this tactile pattern and image, identify the likely use of this material"
- "How do the tactile and visual properties align for this object?"
- "Does the tactile data match what you would expect from the visual appearance?"
```

### Few-Shot Learning
1. Navigate to "Few-Shot Learning" tab
2. Add training examples with tactile data, text context, and expected outputs
3. Provide new input data to analyze
4. The system learns from examples to analyze new data

### Custom Prompt Templates
1. Go to "Prompt Templates" tab
2. View available templates or create custom ones
3. Define template with placeholders like `{tactile_data}`, `{text_description}`
4. Specify required inputs as JSON array

## 🛠️ API Documentation

### Multimodal Analysis Endpoints

#### POST `/api/multimodal/tactile-text`
Analyze tactile data with textual context.

**Request Body:**
```json
{
  "tactile_data": "smooth, metallic surface with low friction",
  "task_instruction": "identify material and potential applications",
  "use_custom_prompt": false,
  "custom_prompt": null
}
```

#### POST `/api/multimodal/vision-text`
Analyze image with textual context.

**Form Data:**
- `text_description`: Text description
- `task_instruction`: Analysis instructions
- `image`: Image file upload
- `use_custom_prompt`: Boolean
- `custom_prompt`: Optional custom prompt

#### POST `/api/multimodal/multimodal-complete`
Complete analysis using all three modalities.

**Form Data:**
- `tactile_data`: Tactile sensor data
- `text_description`: Text description
- `task_instruction`: Analysis instructions
- `image`: Image file upload

### Question Answering Endpoints

#### POST `/api/qa/single-modality`
Answer questions based on single modality input.

```json
{
  "question": "What material has these characteristics?",
  "modality_type": "tactile",
  "modality_data": "rough, grainy texture with high friction"
}
```

#### POST `/api/qa/dual-modality`
Answer questions using multiple modalities.

**Form Data:**
- `question`: Question to answer
- `tactile_data`: Optional tactile data
- `text_data`: Optional text data
- `image`: Optional image file

### Template Management Endpoints

#### GET `/api/multimodal/available-templates`
Get list of available prompt templates.

#### POST `/api/multimodal/custom-template`
Create custom prompt template.

**Form Data:**
- `name`: Template name
- `template`: Template content with placeholders
- `required_inputs`: JSON array of required inputs

## 🏗️ Architecture

### Backend Structure
```
├── main.py                 # FastAPI application entry point
├── api/                    # API route handlers
│   ├── multimodal_reasoning.py
│   └── qa_system.py
├── services/               # Core business logic
│   ├── prompt_engineering.py
│   └── gpt_integration.py
├── static/                 # Frontend assets
│   ├── index.html
│   ├── styles.css
│   └── script.js
└── uploads/                # Temporary file storage
```

### Key Components

#### Prompt Engineering (`services/prompt_engineering.py`)
- **PromptTemplate**: Template management system
- **ModalityType**: Enum for different input modalities
- **TaskType**: Categorization of different analysis tasks
- Pre-built templates for various modality combinations

#### GPT Integration (`services/gpt_integration.py`)
- **GPTService**: Main service for OpenAI API interaction
- Vision and text processing capabilities
- Image preprocessing and optimization
- Multimodal request handling

#### API Routes
- **Multimodal Reasoning**: Endpoints for different analysis modes
- **Question Answering**: QA system with various modality support
- File upload handling and validation
- Response formatting and error handling

## 🔧 Configuration

### Environment Variables
```bash
OPENAI_API_KEY=your_openai_api_key_here    # Required: OpenAI API key
OPENAI_MODEL=gpt-4-vision-preview          # GPT model to use
MAX_FILE_SIZE=10485760                     # Maximum upload file size (10MB)
```

### Model Configuration
The system uses:
- **GPT-4**: For text-only analysis and reasoning
- **GPT-4 Vision**: For image analysis and multimodal tasks
- **Temperature**: 0.7 (configurable in `GPTService`)
- **Max Tokens**: 1500 (configurable in `GPTService`)

## 📊 Example Use Cases

### Material Identification
```python
# Input:
Tactile: "Smooth surface, metallic feel, moderate weight"
Image: [Steel plate image]
Text: "Industrial component with reflective surface"

# Output:
"This appears to be a steel or aluminum plate commonly used in manufacturing. 
The smooth tactile properties combined with the metallic appearance suggest 
it's likely used for structural applications or as a base material for 
precision components."
```

### Texture Analysis
```python
# Input:
Tactile: "Rough, grainy texture with high friction"
Image: [Sandpaper image]
Text: "Abrasive material for surface finishing"

# Output:
"This is sandpaper or similar abrasive material. The high friction tactile 
data aligns with the visible grain structure in the image. Likely used for 
smoothing surfaces or preparing materials for painting/finishing."
```

### Object Recognition
```python
# Question: "What is this object and what is it used for?"
# Modalities: Tactile + Vision + Text
# Result: Comprehensive identification with use case predictions
```

## 🚨 Error Handling

The system includes comprehensive error handling for:
- **API Errors**: OpenAI API failures and rate limiting
- **File Upload Issues**: Invalid formats, size limits
- **Input Validation**: Missing required fields, invalid data
- **Processing Errors**: GPT response parsing, network issues

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues, questions, or feature requests:
1. Check existing issues in the repository
2. Create a new issue with detailed description
3. Include error logs and reproduction steps

## 🔮 Future Enhancements

- **Real-time Streaming**: Streaming responses for long analyses
- **Batch Processing**: Process multiple files simultaneously
- **Model Fine-tuning**: Custom model training for specific domains
- **Advanced Visualization**: Interactive charts and graphs for results
- **Export Features**: PDF reports and data export capabilities
- **Multi-language Support**: Interface and analysis in multiple languages 