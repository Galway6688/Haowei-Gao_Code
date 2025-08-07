import React, { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLayerGroup, 
  faHandPaper, 
  faFileText, 
  faEye, 
  faPlay,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';

import { multimodalAPI } from '../services/api';
import FileUpload from './common/FileUpload';
import InputField from './common/InputField';
import Button from './common/Button';
import ResultsDisplay from './common/ResultsDisplay';
import ModeSelector from './common/ModeSelector';

const Container = styled.div``;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
  
  h2 {
    font-size: 2rem;
    color: #2c3e50;
    margin-bottom: 10px;
    
    .icon {
      color: #9b59b6;
      margin-right: 10px;
    }
  }
  
  p {
    color: #7f8c8d;
    font-size: 1.1rem;
  }
`;

const AnalysisForm = styled.div`
  display: ${props => props.active ? 'block' : 'none'};
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const PromptOptions = styled.div`
  margin: 20px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-weight: 600;
  color: #2c3e50;
  
  input[type="checkbox"] {
    width: auto;
    min-height: auto;
  }
`;

const MultimodalAnalysis = ({ setIsLoading }) => {
  const [activeMode, setActiveMode] = useState('tactile-text');
  const [formData, setFormData] = useState({
    tactileData: '',
    textDescription: '',
    taskInstruction: '',
    useCustomPrompt: false,
    customPrompt: '',
    imageFile: null
  });
  const [results, setResults] = useState(null);

  const modes = [
    {
      id: 'tactile-text',
      icon: [faHandPaper, faFileText],
      label: 'Tactile + Text'
    },
    {
      id: 'vision-text',
      icon: [faEye, faFileText],
      label: 'Vision + Text'
    },
    {
      id: 'complete',
      icon: faLayerGroup,
      label: 'All Modalities'
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (file) => {
    setFormData(prev => ({
      ...prev,
      imageFile: file
    }));
  };

  const validateForm = () => {
    switch (activeMode) {
      case 'tactile-text':
        if (!formData.tactileData || !formData.taskInstruction) {
          toast.error('Please fill in all required fields');
          return false;
        }
        break;
      case 'vision-text':
        if (!formData.textDescription || !formData.taskInstruction || !formData.imageFile) {
          toast.error('Please fill in all required fields and upload an image');
          return false;
        }
        break;
      case 'complete':
        if (!formData.tactileData || !formData.textDescription || !formData.taskInstruction || !formData.imageFile) {
          toast.error('Please fill in all required fields and upload an image');
          return false;
        }
        break;
      default:
        return false;
    }
    return true;
  };

  const handleAnalyze = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let result;

      switch (activeMode) {
        case 'tactile-text':
          result = await multimodalAPI.analyzeTactileText({
            tactile_data: formData.tactileData,
            task_instruction: formData.taskInstruction,
            use_custom_prompt: formData.useCustomPrompt,
            custom_prompt: formData.customPrompt || null
          });
          break;

        case 'vision-text':
          const visionFormData = new FormData();
          visionFormData.append('text_description', formData.textDescription);
          visionFormData.append('task_instruction', formData.taskInstruction);
          visionFormData.append('image', formData.imageFile);
          visionFormData.append('use_custom_prompt', formData.useCustomPrompt);
          if (formData.customPrompt) {
            visionFormData.append('custom_prompt', formData.customPrompt);
          }
          result = await multimodalAPI.analyzeVisionText(visionFormData);
          break;

        case 'complete':
          const completeFormData = new FormData();
          completeFormData.append('tactile_data', formData.tactileData);
          completeFormData.append('text_description', formData.textDescription);
          completeFormData.append('task_instruction', formData.taskInstruction);
          completeFormData.append('image', formData.imageFile);
          completeFormData.append('use_custom_prompt', formData.useCustomPrompt);
          if (formData.customPrompt) {
            completeFormData.append('custom_prompt', formData.customPrompt);
          }
          result = await multimodalAPI.analyzeComplete(completeFormData);
          break;

        default:
          throw new Error('Invalid analysis mode');
      }

      if (result.success) {
        setResults(result);
        toast.success('Analysis completed successfully!');
      } else {
        toast.error(`Analysis failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(`Error processing request: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTactileTextMode = () => (
    <AnalysisForm active={activeMode === 'tactile-text'}>
      <InputGrid>
        <InputField
          label="Tactile Data"
          icon={faHandPaper}
          value={formData.tactileData}
          onChange={(value) => handleInputChange('tactileData', value)}
          placeholder="Describe tactile properties (e.g., smooth, metallic, high friction, coarse surface...)"
          multiline
        />
        <InputField
          label="Task Instruction"
          icon={faFileText}
          value={formData.taskInstruction}
          onChange={(value) => handleInputChange('taskInstruction', value)}
          placeholder="Specify what analysis you want (e.g., identify material, predict use case, describe texture...)"
          multiline
        />
      </InputGrid>
      <PromptOptions>
        <CheckboxLabel>
          <input
            type="checkbox"
            checked={formData.useCustomPrompt}
            onChange={(e) => handleInputChange('useCustomPrompt', e.target.checked)}
          />
          <span>Use Custom Prompt</span>
        </CheckboxLabel>
        {formData.useCustomPrompt && (
          <InputField
            value={formData.customPrompt}
            onChange={(value) => handleInputChange('customPrompt', value)}
            placeholder="Enter your custom prompt here..."
            multiline
            style={{ marginTop: '15px' }}
          />
        )}
      </PromptOptions>
      <Button onClick={handleAnalyze} icon={faPlay}>
        Analyze
      </Button>
    </AnalysisForm>
  );

  const renderVisionTextMode = () => (
    <AnalysisForm active={activeMode === 'vision-text'}>
      <InputGrid>
        <FileUpload
          label="Upload Image"
          icon={faEye}
          onFileChange={handleFileChange}
          accept="image/*"
        />
        <InputField
          label="Text Description"
          icon={faFileText}
          value={formData.textDescription}
          onChange={(value) => handleInputChange('textDescription', value)}
          placeholder="Provide textual context or description..."
          multiline
        />
        <InputField
          label="Task Instruction"
          icon={faFileText}
          value={formData.taskInstruction}
          onChange={(value) => handleInputChange('taskInstruction', value)}
          placeholder="Specify what analysis you want..."
          multiline
        />
      </InputGrid>
      <Button onClick={handleAnalyze} icon={faPlay}>
        Analyze
      </Button>
    </AnalysisForm>
  );

  const renderCompleteMode = () => (
    <AnalysisForm active={activeMode === 'complete'}>
      <InputGrid>
        <InputField
          label="Tactile Data"
          icon={faHandPaper}
          value={formData.tactileData}
          onChange={(value) => handleInputChange('tactileData', value)}
          placeholder="Describe tactile properties..."
          multiline
        />
        <FileUpload
          label="Upload Image"
          icon={faEye}
          onFileChange={handleFileChange}
          accept="image/*"
        />
        <InputField
          label="Text Description"
          icon={faFileText}
          value={formData.textDescription}
          onChange={(value) => handleInputChange('textDescription', value)}
          placeholder="Provide textual context..."
          multiline
        />
        <InputField
          label="Task Instruction"
          icon={faFileText}
          value={formData.taskInstruction}
          onChange={(value) => handleInputChange('taskInstruction', value)}
          placeholder="Specify comprehensive analysis requirements..."
          multiline
        />
      </InputGrid>
      <Button onClick={handleAnalyze} icon={faPlay} variant="primary">
        Comprehensive Analysis
      </Button>
    </AnalysisForm>
  );

  return (
    <Container>
      <SectionHeader>
        <h2>
          <FontAwesomeIcon icon={faLayerGroup} className="icon" />
          Multimodal Analysis
        </h2>
        <p>Combine tactile, visual, and textual inputs for comprehensive analysis</p>
      </SectionHeader>

      <ModeSelector
        modes={modes}
        activeMode={activeMode}
        onModeChange={setActiveMode}
      />

      {renderTactileTextMode()}
      {renderVisionTextMode()}
      {renderCompleteMode()}

      {results && (
        <ResultsDisplay
          title="Analysis Results"
          icon={faChartLine}
          results={results}
        />
      )}
    </Container>
  );
};

export default MultimodalAnalysis; 