import React, { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUpload, 
  faImage, 
  faHandPaper, 
  faFileText,
  faPlay,
  faTrash,
  faTimes,
  faCog,
  faMagic,
  faHistory,
  faSpinner,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

import { multimodalAPI } from '../services/api';

const MainContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const Section = styled.div`
  margin-bottom: 30px;
  
  h2 {
    font-size: 1.3rem;
    color: #2c3e50;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    
    .icon {
      margin-right: 8px;
      color: #667eea;
    }
  }
`;

const DataInputGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InputCard = styled.div`
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.1);
  }
  
  h3 {
    margin: 0 0 15px 0;
    color: #2c3e50;
    font-size: 1rem;
    display: flex;
    align-items: center;
    
    .icon {
      margin-right: 8px;
      color: #667eea;
    }
  }
`;

const FileUploadArea = styled.div`
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  &:hover, &.dragover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.05);
  }
  
  .upload-icon {
    font-size: 2rem;
    color: #dee2e6;
    margin-bottom: 10px;
  }
  
  &.has-file {
    border-color: #28a745;
    background: rgba(40, 167, 69, 0.05);
    
    .upload-icon {
      color: #28a745;
    }
  }
  
  &.disabled {
    border-color: #e9ecef;
    background: #f8f9fa;
    cursor: not-allowed;
    opacity: 0.6;
    
    .upload-icon {
      color: #adb5bd;
    }
    
    &:hover {
      border-color: #e9ecef;
      background: #f8f9fa;
    }
  }
  
  p {
    margin: 0;
    color: #6c757d;
    font-size: 0.9rem;
  }
  
  .file-name {
    color: #28a745;
    font-weight: 500;
    margin-top: 5px;
  }
  
  .file-info {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 5px;
  }
`;

const FileDeleteButton = styled.button`
  background: #dc3545;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
  font-size: 0.7rem;
  
  &:hover {
    background: #c82333;
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.9rem;
  resize: vertical;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
  
  &::placeholder {
    color: #adb5bd;
  }
`;

const PromptSection = styled.div`
  border: 2px solid #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
`;

const PromptTypeSelector = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  flex-wrap: wrap;
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  
  input {
    margin-right: 8px;
  }
  
  span {
    font-size: 0.9rem;
    color: #495057;
  }
`;

const PromptEditor = styled.div`
  h4 {
    margin: 0 0 10px 0;
    color: #2c3e50;
    font-size: 1rem;
    display: flex;
    align-items: center;
    
    .icon {
      margin-right: 8px;
      color: #667eea;
    }
  }
`;

const PromptTextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  line-height: 1.5;
  background: #f8f9fa;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    background: white;
  }
`;

const CheckboxOption = styled.label`
  display: flex;
  align-items: center;
  margin-top: 10px;
  cursor: pointer;
  
  input {
    margin-right: 8px;
  }
  
  span {
    font-size: 0.9rem;
    color: #495057;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 30px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &.primary {
    background: #667eea;
    color: white;
    
    &:hover {
      background: #5a67d8;
      transform: translateY(-2px);
    }
  }
  
  &.secondary {
    background: #e9ecef;
    color: #495057;
    
    &:hover {
      background: #dee2e6;
    }
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ResponseSection = styled.div`
  border: 2px solid #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  min-height: 200px;
  
  h3 {
    margin: 0 0 15px 0;
    color: #2c3e50;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    
    .icon {
      margin-right: 8px;
      color: #28a745;
    }
  }
  
  .no-response {
    text-align: center;
    color: #adb5bd;
    font-style: italic;
    padding: 40px 20px;
  }
  
  .response-content {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    white-space: pre-wrap;
    font-family: inherit;
    line-height: 1.6;
  }
`;

const StatusIndicator = styled.div`
  margin-top: 8px;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  
  &.success {
    background: rgba(40, 167, 69, 0.1);
    color: #28a745;
    border: 1px solid rgba(40, 167, 69, 0.2);
  }
  
  &.empty {
    background: rgba(108, 117, 125, 0.1);
    color: #6c757d;
    border: 1px solid rgba(108, 117, 125, 0.2);
  }
`;

const OptimizationSection = styled.div`
  background: rgba(102, 126, 234, 0.05);
  border: 2px solid rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  
  h4 {
    margin: 0 0 15px 0;
    color: #2c3e50;
    font-size: 1rem;
    display: flex;
    align-items: center;
    
    .icon {
      margin-right: 8px;
      color: #667eea;
    }
  }
`;

const OptimizationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
  flex-wrap: wrap;
`;

const OptimizationButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #667eea;
  border-radius: 6px;
  background: ${props => props.loading ? '#f8f9fa' : '#667eea'};
  color: ${props => props.loading ? '#6c757d' : 'white'};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: ${props => props.loading ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover:not(:disabled) {
    background: #5a67d8;
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
  }
`;

const OptimizationSelect = styled.select`
  padding: 6px 12px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const OptimizationStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  padding: 8px 12px;
  background: ${props => props.optimized ? 'rgba(40, 167, 69, 0.1)' : 'rgba(108, 117, 125, 0.1)'};
  border-radius: 6px;
  font-size: 0.8rem;
  
  .status-text {
    color: ${props => props.optimized ? '#28a745' : '#6c757d'};
    font-weight: 500;
  }
  
  .version {
    color: #667eea;
    font-weight: 600;
  }
`;

const MainInterface = ({ setIsLoading }) => {
  const [tactileFile, setTactileFile] = useState(null);
  const [visualFile, setVisualFile] = useState(null);
  const [textualInput, setTextualInput] = useState('');
  const [promptType, setPromptType] = useState('Tactile-Vision-Text Combined');
  const [promptText, setPromptText] = useState('');
  const [addContextualInfo, setAddContextualInfo] = useState(false);
  const [response, setResponse] = useState(null);
  
  // Prompt optimization states
  const [autoOptimize, setAutoOptimize] = useState(true);
  const [optimizationStrategy, setOptimizationStrategy] = useState('Balanced Optimization');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationVersion, setOptimizationVersion] = useState('v2');
  const [promptHistory, setPromptHistory] = useState([]);
  const [isOptimized, setIsOptimized] = useState(false);

  // Generate prompt based on inputs
  const generateBasePrompt = () => {
    let sections = [];
    
    // Add contextual information first if enabled
    if (addContextualInfo) {
      sections.push(`[Context]
Task: Multimodal AI Analysis
Objective: Provide comprehensive reasoning across modalities
Output Format: Structured response with clear explanations`);
    }
    
    // Add content based on what's available
    if (tactileFile) {
      sections.push(`Tactile Data File: ${tactileFile.name}`);
    }
    
    if (visualFile) {
      sections.push(`Visual Data File: ${visualFile.name}`);
    }
    
    if (textualInput.trim()) {
      sections.push(`Text Input: ${textualInput}`);
    }
    
    return sections.length > 0 ? sections.join('\n\n') : 'No input provided yet.';
  };
  
  // Generate optimized prompt based on type and inputs
  const generateOptimizedPrompt = () => {
    if (promptType === 'Vision-Text') {
      return `Perform a detailed comprehensive multimodal analysis with cross-referencing of the following visual and textual information:

**Textual Input Analysis:**
Image Description:
Text Input:

Provide actionable insights with confidence levels utilizing the provided the visual and textual context.

[Context]`;
    }
    
    // Add other prompt types as needed
    return generateBasePrompt();
  };
  
  // Optimize prompt using AI techniques
  const optimizePrompt = async (basePrompt) => {
    setIsOptimizing(true);
    
    // Simulate AI optimization process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const optimizedPrompt = generateOptimizedPrompt();
    
    // Add to history
    setPromptHistory(prev => [...prev, { version: optimizationVersion, prompt: basePrompt, timestamp: new Date() }]);
    
    setIsOptimizing(false);
    setIsOptimized(true);
    
    return optimizedPrompt;
  };

  // Listen for input changes and auto-update prompt
  React.useEffect(() => {
    const updatePrompt = async () => {
      const basePrompt = generateBasePrompt();
      
      if (autoOptimize && (tactileFile || visualFile || textualInput.trim())) {
        const optimized = await optimizePrompt(basePrompt);
        setPromptText(optimized);
      } else {
        setPromptText(basePrompt);
        setIsOptimized(false);
      }
    };
    
    updatePrompt();
  }, [tactileFile, visualFile, textualInput, addContextualInfo, autoOptimize]);
  
  // Clear incompatible files when prompt type changes
  React.useEffect(() => {
    if (promptType === 'Vision-Text' && tactileFile) {
      setTactileFile(null);
      toast.info('Tactile file cleared - not compatible with Vision-Text mode');
    }
    if (promptType === 'Tactile-Text' && visualFile) {
      setVisualFile(null);
      toast.info('Visual file cleared - not compatible with Tactile-Text mode');
    }
    if (promptType === 'Text Only' && (tactileFile || visualFile)) {
      setTactileFile(null);
      setVisualFile(null);
      toast.info('Files cleared - Text Only mode selected');
    }
  }, [promptType]);
  
  // Manual optimization handler
  const handleManualOptimization = async () => {
    const basePrompt = generateBasePrompt();
    const optimized = await optimizePrompt(basePrompt);
    setPromptText(optimized);
  };
  
  // Revert to previous version
  const handleRevert = () => {
    if (promptHistory.length > 0) {
      const lastVersion = promptHistory[promptHistory.length - 1];
      setPromptText(lastVersion.prompt);
      setPromptHistory(prev => prev.slice(0, -1));
      setIsOptimized(false);
    }
  };
  
  // Insert example prompt
  const handleInsertExample = () => {
    const examplePrompt = `

**Example Analysis Framework:**
Perform a detailed comprehensive multimodal analysis with cross-referencing of the following visual and textual information:

**Textual Input Analysis:**
Image Description: [Your image description here]
Text Input: [Your text input here]

Provide actionable insights with confidence levels utilizing the provided the visual and textual context.

[Context]`;
    
    // Append to existing prompt instead of replacing
    const currentPrompt = promptText || '';
    const newPrompt = currentPrompt + examplePrompt;
    setPromptText(newPrompt);
    setIsOptimized(false);
  };

  const handleFileUpload = (file, type) => {
    if (file) {
      if (type === 'tactile') {
        setTactileFile(file);
        toast.success('Tactile file uploaded successfully');
      } else if (type === 'visual') {
        setVisualFile(file);
        toast.success('Visual file uploaded successfully');
      }
    }
  };

  const handleFileDelete = (type) => {
    if (type === 'tactile') {
      setTactileFile(null);
      toast.success('Tactile file removed');
    } else if (type === 'visual') {
      setVisualFile(null);
      toast.success('Visual file removed');
    }
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0], type);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const clearInputs = () => {
    setTactileFile(null);
    setVisualFile(null);
    setTextualInput('');
    setResponse(null);
  };

  const generateResponse = async () => {
    try {
      setIsLoading(true);
      
      // Check at least one input is provided
      if (!tactileFile && !visualFile && !textualInput.trim()) {
        toast.error('Please provide at least one input: tactile file, image, or text');
        return;
      }
      
      // Prepare data
      const formData = new FormData();
      let apiPrompt;
      
      // For Text Only mode, only send text (no files)
      if (promptType === 'Text Only') {
        apiPrompt = promptText || `Please analyze the following text: ${textualInput}`;
        if (!textualInput.trim()) {
          toast.error('Please enter text for Text Only mode');
          return;
        }
        formData.append('text_context', textualInput);
      } else {
        // For other modes, include files as before
        if (tactileFile) {
          formData.append('tactile_file', tactileFile);
        }
        
        if (visualFile) {
          formData.append('image', visualFile);
        }
        
        if (textualInput.trim()) {
          formData.append('text_context', textualInput);
        }
        
        // Use the optimized prompt or generate a fallback
        apiPrompt = promptText || 'Please analyze the provided data';
        if (!promptText && textualInput.trim()) {
          apiPrompt = `Please analyze the provided data. Additional context: ${textualInput}`;
        }
      }
      
      formData.append('prompt', apiPrompt);
      formData.append('prompt_type', promptType);
      formData.append('add_contextual_info', addContextualInfo);
      
      console.log('Sending request to API...', {
        prompt: apiPrompt,
        promptType: promptType,
        hasImage: !!visualFile,
        hasTactileFile: !!tactileFile,
        hasTextContext: !!textualInput.trim()
      });
      
      // Call unified multimodal analysis API
      const result = await multimodalAPI.processUnifiedAnalysis(formData);
      
      console.log('API response:', result);
      
      if (result.success) {
        setResponse(result.response);
        toast.success('Analysis completed!');
      } else {
        toast.error(`Analysis failed: ${result.error}`);
      }
      
    } catch (error) {
      console.error('Request error:', error);
      toast.error(`Request failed: ${error.message || error.error || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainContainer>
      {/* Data Input Section */}
      <Section>
        <h2>
          <FontAwesomeIcon icon={faUpload} className="icon" />
          Data Input Section
        </h2>
        
        <DataInputGrid>
          {/* Tactile Data Input */}
          <InputCard>
            <h3>
              <FontAwesomeIcon icon={faHandPaper} className="icon" />
              Tactile Data Input
            </h3>
            <FileUploadArea
              className={`${tactileFile ? 'has-file' : ''} ${(promptType === 'Text Only' || promptType === 'Vision-Text') ? 'disabled' : ''}`}
              onDrop={(promptType !== 'Text Only' && promptType !== 'Vision-Text') ? (e) => handleDrop(e, 'tactile') : undefined}
              onDragOver={(promptType !== 'Text Only' && promptType !== 'Vision-Text') ? handleDragOver : undefined}
              onClick={(promptType !== 'Text Only' && promptType !== 'Vision-Text') ? () => document.getElementById('tactile-input').click() : undefined}
            >
              <FontAwesomeIcon icon={faUpload} className="upload-icon" />
              {(promptType === 'Text Only' || promptType === 'Vision-Text') ? (
                <p>File upload disabled for {promptType} mode</p>
              ) : tactileFile ? (
                <>
                  <p>Tactile file uploaded</p>
                  <div className="file-info">
                    <p className="file-name">{tactileFile.name}</p>
                    <FileDeleteButton 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileDelete('tactile');
                      }}
                      title="Remove file"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </FileDeleteButton>
                  </div>
                </>
              ) : (
                <p>Upload Tactile File</p>
              )}
              <input
                id="tactile-input"
                type="file"
                style={{ display: 'none' }}
                accept=".csv,.json,.txt"
                onChange={(e) => {
                  handleFileUpload(e.target.files[0], 'tactile');
                  e.target.value = ''; // Reset input value to allow re-uploading same file
                }}
              />
            </FileUploadArea>
            <StatusIndicator className={tactileFile ? 'success' : 'empty'}>
              {tactileFile ? `File uploaded: ${tactileFile.name}` : 'No file uploaded'}
            </StatusIndicator>
          </InputCard>

          {/* Visual Data Input */}
          <InputCard>
            <h3>
              <FontAwesomeIcon icon={faImage} className="icon" />
              Visual Data Input
            </h3>
            <FileUploadArea
              className={`${visualFile ? 'has-file' : ''} ${(promptType === 'Text Only' || promptType === 'Tactile-Text') ? 'disabled' : ''}`}
              onDrop={(promptType !== 'Text Only' && promptType !== 'Tactile-Text') ? (e) => handleDrop(e, 'visual') : undefined}
              onDragOver={(promptType !== 'Text Only' && promptType !== 'Tactile-Text') ? handleDragOver : undefined}
              onClick={(promptType !== 'Text Only' && promptType !== 'Tactile-Text') ? () => document.getElementById('visual-input').click() : undefined}
            >
              <FontAwesomeIcon icon={faUpload} className="upload-icon" />
              {(promptType === 'Text Only' || promptType === 'Tactile-Text') ? (
                <p>File upload disabled for {promptType} mode</p>
              ) : visualFile ? (
                <>
                  <p>Image uploaded</p>
                  <div className="file-info">
                    <p className="file-name">{visualFile.name}</p>
                    <FileDeleteButton 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileDelete('visual');
                      }}
                      title="Remove file"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </FileDeleteButton>
                  </div>
                </>
              ) : (
                <p>No image uploaded</p>
              )}
              <input
                id="visual-input"
                type="file"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={(e) => {
                  handleFileUpload(e.target.files[0], 'visual');
                  e.target.value = ''; // Reset input value to allow re-uploading same file
                }}
              />
            </FileUploadArea>
            <StatusIndicator className={visualFile ? 'success' : 'empty'}>
              {visualFile ? `Image uploaded: ${visualFile.name}` : 'No image uploaded'}
            </StatusIndicator>
            <TextArea
              placeholder="Manual image description (optional)"
              style={{ marginTop: '10px', minHeight: '60px' }}
            />
          </InputCard>

          {/* Textual Input */}
          <InputCard>
            <h3>
              <FontAwesomeIcon icon={faFileText} className="icon" />
              Textual Input
            </h3>
            <TextArea
              placeholder="Enter additional text, questions, or queries here..."
              value={textualInput}
              onChange={(e) => setTextualInput(e.target.value)}
            />
            <StatusIndicator className={textualInput.trim() ? 'success' : 'empty'}>
              {textualInput.trim() ? `${textualInput.length} characters entered` : 'No text entered'}
            </StatusIndicator>
          </InputCard>
        </DataInputGrid>
      </Section>

      {/* Prompt Engineering & Controls */}
      <Section>
        <h2>
          <FontAwesomeIcon icon={faPlay} className="icon" />
          Prompt Engineering & Controls
        </h2>
        
                <PromptSection>
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Prompt Type Selection</h4>
            <PromptTypeSelector>
              <RadioOption>
                <input
                  type="radio"
                  name="promptType"
                  value="Tactile-Text"
                  checked={promptType === 'Tactile-Text'}
                  onChange={(e) => setPromptType(e.target.value)}
                />
                <span>Tactile-Text</span>
              </RadioOption>
              <RadioOption>
                <input
                  type="radio"
                  name="promptType"
                  value="Vision-Text"
                  checked={promptType === 'Vision-Text'}
                  onChange={(e) => setPromptType(e.target.value)}
                />
                <span>Vision-Text</span>
              </RadioOption>
              <RadioOption>
                <input
                  type="radio"
                  name="promptType"
                  value="Tactile-Vision-Text Combined"
                  checked={promptType === 'Tactile-Vision-Text Combined'}
                  onChange={(e) => setPromptType(e.target.value)}
                />
                <span>Tactile-Vision-Text Combined</span>
              </RadioOption>
              <RadioOption>
                <input
                  type="radio"
                  name="promptType"
                  value="Text Only"
                  checked={promptType === 'Text Only'}
                  onChange={(e) => setPromptType(e.target.value)}
                />
                <span>Text Only</span>
              </RadioOption>
            </PromptTypeSelector>
          </div>

          <OptimizationSection>
            <h4>
              <FontAwesomeIcon icon={faCog} className="icon" />
              Automatic Prompt Optimization
            </h4>
            
            <OptimizationControls>
              <CheckboxOption>
                <input
                  type="checkbox"
                  checked={autoOptimize}
                  onChange={(e) => setAutoOptimize(e.target.checked)}
                />
                <span>Auto-optimize</span>
              </CheckboxOption>
              
              <OptimizationSelect 
                value={optimizationStrategy} 
                onChange={(e) => setOptimizationStrategy(e.target.value)}
              >
                <option value="Balanced Optimization">Balanced Optimization</option>
                <option value="Clarity Focus">Clarity Focus</option>
                <option value="Structure Focus">Structure Focus</option>
                <option value="Specificity Focus">Specificity Focus</option>
              </OptimizationSelect>
              
              <OptimizationButton 
                onClick={handleManualOptimization}
                loading={isOptimizing}
                disabled={isOptimizing}
              >
                {isOptimizing ? (
                  <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                  <FontAwesomeIcon icon={faMagic} />
                )}
                Optimize Prompt
              </OptimizationButton>
              
              {promptHistory.length > 0 && (
                <OptimizationButton 
                  onClick={handleRevert}
                  style={{ background: '#6c757d', borderColor: '#6c757d' }}
                >
                  <FontAwesomeIcon icon={faHistory} />
                  Revert
                </OptimizationButton>
              )}
              

            </OptimizationControls>
            
            <OptimizationStatus optimized={isOptimized}>
              <FontAwesomeIcon 
                icon={isOptimized ? faCheckCircle : faCog} 
                style={{ color: isOptimized ? '#28a745' : '#6c757d' }}
              />
              <span className="status-text">
                {isOptimizing ? 'Optimizing...' : 
                 isOptimized ? 'This prompt has been optimized using AI prompt engineering techniques' : 
                 'Ready to process multimodal data'}
              </span>
              {isOptimized && <span className="version">Auto-optimized</span>}
            </OptimizationStatus>
          </OptimizationSection>

          <PromptEditor>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h4>
                <FontAwesomeIcon icon={faFileText} className="icon" />
                Prompt Preview/Editor
              </h4>
              <OptimizationButton 
                onClick={handleInsertExample}
                style={{ 
                  background: '#ffc107', 
                  borderColor: '#ffc107', 
                  color: '#212529',
                  fontSize: '0.8rem',
                  padding: '6px 12px'
                }}
              >
                Insert Example
              </OptimizationButton>
            </div>
            <PromptTextArea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Prompt content will appear here..."
              style={{
                background: '#f8f9fa'
              }}
            />
            <CheckboxOption>
              <input
                type="checkbox"
                checked={addContextualInfo}
                onChange={(e) => setAddContextualInfo(e.target.checked)}
              />
              <span>Add Contextual Information</span>
            </CheckboxOption>
          </PromptEditor>
        </PromptSection>

        <ButtonGroup>
          <Button className="primary" onClick={generateResponse}>
            <FontAwesomeIcon icon={faPlay} />
            Generate Response
          </Button>
          <Button className="secondary" onClick={clearInputs}>
            <FontAwesomeIcon icon={faTrash} />
            Clear Inputs
          </Button>
        </ButtonGroup>
      </Section>

      {/* AI Response Output */}
      <Section>
        <ResponseSection>
          <h3>
            <FontAwesomeIcon icon={faPlay} className="icon" />
            AI Response Output
          </h3>
          {response ? (
            <div className="response-content">
              {response}
            </div>
          ) : (
            <div className="no-response">
              <p>No response generated yet</p>
              <p>Configure your inputs and click "Generate Response" to see AI analysis</p>
            </div>
          )}
        </ResponseSection>
      </Section>
    </MainContainer>
  );
};

export default MainInterface; 