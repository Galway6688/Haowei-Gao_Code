import React, { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faQuestionCircle, 
  faSearch, 
  faCommentAlt,
  faLightbulb 
} from '@fortawesome/free-solid-svg-icons';

import { qaAPI } from '../services/api';
import InputField from './common/InputField';
import FileUpload from './common/FileUpload';
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

const QAForm = styled.div`
  display: ${props => props.active ? 'block' : 'none'};
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const SampleQuestions = styled.div`
  margin-top: 30px;
  padding: 25px;
  background: #f8f9fa;
  border-radius: 10px;
  
  h4 {
    color: #2c3e50;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
    
    .icon {
      color: #9b59b6;
    }
  }
`;

const ExampleButton = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 10px 15px;
  font-size: 0.9rem;
  text-align: left;
  border-radius: 5px;
  margin: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: block;
  width: 100%;
  
  &:hover {
    background: #2980b9;
    transform: translateY(-1px);
  }
`;

const QuestionAnswering = ({ setIsLoading }) => {
  const [activeMode, setActiveMode] = useState('single-qa');
  const [formData, setFormData] = useState({
    question: '',
    modalityType: 'tactile',
    modalityData: '',
    tactileData: '',
    textData: '',
    imageFile: null
  });
  const [results, setResults] = useState(null);
  const [sampleQuestions, setSampleQuestions] = useState(null);

  const modes = [
    { id: 'single-qa', label: 'Single Modality' },
    { id: 'dual-qa', label: 'Dual Modality' },
    { id: 'multi-qa', label: 'All Modalities' },
    { id: 'batch-qa', label: 'Batch Questions' }
  ];

  const modalityOptions = [
    { value: 'tactile', label: 'Tactile' },
    { value: 'vision', label: 'Vision' },
    { value: 'text', label: 'Text' }
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
      case 'single-qa':
        if (!formData.question || !formData.modalityData) {
          toast.error('Please fill in all required fields');
          return false;
        }
        break;
      case 'dual-qa':
      case 'multi-qa':
        if (!formData.question) {
          toast.error('Please enter a question');
          return false;
        }
        if (!formData.tactileData && !formData.textData && !formData.imageFile) {
          toast.error('Please provide at least one type of data');
          return false;
        }
        break;
      default:
        return false;
    }
    return true;
  };

  const handleAskQuestion = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let result;

      switch (activeMode) {
        case 'single-qa':
          result = await qaAPI.askSingleModality({
            question: formData.question,
            modality_type: formData.modalityType,
            modality_data: formData.modalityData
          });
          break;

        case 'dual-qa':
          const dualFormData = new FormData();
          dualFormData.append('question', formData.question);
          if (formData.tactileData) dualFormData.append('tactile_data', formData.tactileData);
          if (formData.textData) dualFormData.append('text_data', formData.textData);
          if (formData.imageFile) dualFormData.append('image', formData.imageFile);
          result = await qaAPI.askDualModality(dualFormData);
          break;

        case 'multi-qa':
          const multiFormData = new FormData();
          multiFormData.append('question', formData.question);
          multiFormData.append('tactile_data', formData.tactileData);
          multiFormData.append('text_data', formData.textData);
          multiFormData.append('image', formData.imageFile);
          result = await qaAPI.askMultimodal(multiFormData);
          break;

        default:
          throw new Error('Invalid QA mode');
      }

      if (result.success) {
        setResults(result);
        toast.success('Question answered successfully!');
      } else {
        toast.error(`Question answering failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('QA error:', error);
      toast.error(`Error processing request: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleQuestions = async () => {
    try {
      const result = await qaAPI.getSampleQuestions();
      if (result.success) {
        setSampleQuestions(result.sample_questions);
        toast.info('Sample questions loaded!');
      }
    } catch (error) {
      console.error('Error loading sample questions:', error);
      toast.error('Failed to load sample questions');
    }
  };

  const useSampleQuestion = (question) => {
    setFormData(prev => ({
      ...prev,
      question: question
    }));
  };

  const renderSingleModalityQA = () => (
    <QAForm active={activeMode === 'single-qa'}>
      <InputField
        label="Question"
        icon={faQuestionCircle}
        value={formData.question}
        onChange={(value) => handleInputChange('question', value)}
        placeholder="Ask a question about the data..."
        multiline
      />
      <InputField
        label="Modality Type"
        value={formData.modalityType}
        onChange={(value) => handleInputChange('modalityType', value)}
        options={modalityOptions}
      />
      <InputField
        label="Data"
        value={formData.modalityData}
        onChange={(value) => handleInputChange('modalityData', value)}
        placeholder="Enter the data for the selected modality..."
        multiline
      />
      <Button onClick={handleAskQuestion} icon={faSearch}>
        Ask Question
      </Button>
    </QAForm>
  );

  const renderDualModalityQA = () => (
    <QAForm active={activeMode === 'dual-qa'}>
      <InputField
        label="Question"
        icon={faQuestionCircle}
        value={formData.question}
        onChange={(value) => handleInputChange('question', value)}
        placeholder="Ask a question using multiple modalities..."
        multiline
      />
      <InputGrid>
        <InputField
          label="Tactile Data (Optional)"
          value={formData.tactileData}
          onChange={(value) => handleInputChange('tactileData', value)}
          placeholder="Tactile information..."
          multiline
        />
        <InputField
          label="Text Data (Optional)"
          value={formData.textData}
          onChange={(value) => handleInputChange('textData', value)}
          placeholder="Text information..."
          multiline
        />
        <FileUpload
          label="Image (Optional)"
          onFileChange={handleFileChange}
          accept="image/*"
        />
      </InputGrid>
      <Button onClick={handleAskQuestion} icon={faSearch}>
        Ask Question
      </Button>
    </QAForm>
  );

  const renderMultiModalityQA = () => (
    <QAForm active={activeMode === 'multi-qa'}>
      <InputField
        label="Question"
        icon={faQuestionCircle}
        value={formData.question}
        onChange={(value) => handleInputChange('question', value)}
        placeholder="Ask a comprehensive question using all modalities..."
        multiline
      />
      <InputGrid>
        <InputField
          label="Tactile Data"
          value={formData.tactileData}
          onChange={(value) => handleInputChange('tactileData', value)}
          placeholder="Tactile information..."
          multiline
        />
        <InputField
          label="Text Data"
          value={formData.textData}
          onChange={(value) => handleInputChange('textData', value)}
          placeholder="Text information..."
          multiline
        />
        <FileUpload
          label="Upload Image"
          onFileChange={handleFileChange}
          accept="image/*"
        />
      </InputGrid>
      <Button onClick={handleAskQuestion} icon={faSearch} variant="primary">
        Ask Comprehensive Question
      </Button>
    </QAForm>
  );

  const renderSampleQuestions = () => {
    if (!sampleQuestions) return null;

    return (
      <div>
        {/* Single modality questions */}
        {Object.entries(sampleQuestions.single_modality).map(([modality, questions]) => (
          <div key={modality}>
            <h5>{modality.charAt(0).toUpperCase() + modality.slice(1)} Questions:</h5>
            {questions.map((question, index) => (
              <ExampleButton
                key={index}
                onClick={() => {
                  useSampleQuestion(question);
                  if (activeMode === 'single-qa') {
                    setFormData(prev => ({ ...prev, modalityType: modality }));
                  }
                }}
              >
                {question}
              </ExampleButton>
            ))}
          </div>
        ))}

        {/* Dual modality questions */}
        <div>
          <h5>Dual Modality Questions:</h5>
          {sampleQuestions.dual_modality.map((question, index) => (
            <ExampleButton
              key={index}
              onClick={() => useSampleQuestion(question)}
            >
              {question}
            </ExampleButton>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Container>
      <SectionHeader>
        <h2>
          <FontAwesomeIcon icon={faQuestionCircle} className="icon" />
          Question Answering
        </h2>
        <p>Ask questions about multimodal data</p>
      </SectionHeader>

      <ModeSelector
        modes={modes}
        activeMode={activeMode}
        onModeChange={setActiveMode}
      />

      {renderSingleModalityQA()}
      {renderDualModalityQA()}
      {renderMultiModalityQA()}

      <SampleQuestions>
        <h4>
          <FontAwesomeIcon icon={faLightbulb} className="icon" />
          Sample Questions
        </h4>
        {!sampleQuestions ? (
          <Button onClick={loadSampleQuestions} variant="secondary" size="small">
            Load Sample Questions
          </Button>
        ) : (
          renderSampleQuestions()
        )}
      </SampleQuestions>

      {results && (
        <ResultsDisplay
          title="Answer"
          icon={faCommentAlt}
          results={results}
        />
      )}
    </Container>
  );
};

export default QuestionAnswering; 