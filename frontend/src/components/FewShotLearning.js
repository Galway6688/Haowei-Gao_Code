import React, { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGraduationCap, 
  faList, 
  faPlay, 
  faPlus,
  faStar,
  faMagic 
} from '@fortawesome/free-solid-svg-icons';

import { multimodalAPI } from '../services/api';
import InputField from './common/InputField';
import FileUpload from './common/FileUpload';
import Button from './common/Button';
import ResultsDisplay from './common/ResultsDisplay';

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

const Section = styled.div`
  margin-bottom: 30px;
  padding: 25px;
  background: #f8f9fa;
  border-radius: 10px;
  
  h3 {
    color: #2c3e50;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    
    .icon {
      color: #9b59b6;
    }
  }
`;

const ExampleItem = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #e0e0e0;
  
  h4 {
    color: #9b59b6;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const RemoveButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  
  &:hover {
    background: #c0392b;
  }
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const FewShotLearning = ({ setIsLoading }) => {
  const [examples, setExamples] = useState([
    { id: 1, tactile: '', text: '', output: '' }
  ]);
  const [newInput, setNewInput] = useState({
    tactile: '',
    text: '',
    imageFile: null
  });
  const [results, setResults] = useState(null);

  const addExample = () => {
    const newId = Math.max(...examples.map(e => e.id)) + 1;
    setExamples(prev => [...prev, { id: newId, tactile: '', text: '', output: '' }]);
  };

  const removeExample = (id) => {
    if (examples.length > 1) {
      setExamples(prev => prev.filter(e => e.id !== id));
    }
  };

  const updateExample = (id, field, value) => {
    setExamples(prev => prev.map(example => 
      example.id === id ? { ...example, [field]: value } : example
    ));
  };

  const handleNewInputChange = (field, value) => {
    setNewInput(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (file) => {
    setNewInput(prev => ({
      ...prev,
      imageFile: file
    }));
  };

  const validateForm = () => {
    // Check if at least one example has some content
    const hasValidExample = examples.some(example => 
      example.tactile || example.text || example.output
    );

    if (!hasValidExample) {
      toast.error('Please provide at least one example with some content');
      return false;
    }

    if (!newInput.tactile || !newInput.text) {
      toast.error('Please fill in the new input fields');
      return false;
    }

    return true;
  };

  const handleAnalyze = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      
      // Filter and format examples
      const validExamples = examples.filter(example => 
        example.tactile || example.text || example.output
      ).map(example => ({
        tactile: example.tactile,
        text: example.text,
        output: example.output
      }));

      formData.append('examples_json', JSON.stringify(validExamples));
      formData.append('tactile_data', newInput.tactile);
      formData.append('text_description', newInput.text);
      
      if (newInput.imageFile) {
        formData.append('image', newInput.imageFile);
      }

      const result = await multimodalAPI.fewShotLearning(formData);

      if (result.success) {
        setResults(result);
        toast.success('Few-shot learning completed successfully!');
      } else {
        toast.error(`Few-shot learning failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Few-shot learning error:', error);
      toast.error(`Error processing request: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDemoExamples = () => {
    const demoExamples = [
      {
        id: 1,
        tactile: 'Smooth, metallic surface with low friction',
        text: 'Industrial steel plate',
        output: 'A smooth steel object likely used in construction or manufacturing. The metallic properties suggest it\'s used for structural applications.'
      },
      {
        id: 2,
        tactile: 'Rough, grainy texture with high friction',
        text: 'Abrasive material for surface finishing',
        output: 'This is sandpaper or similar abrasive material. The high friction tactile data aligns with its use for smoothing surfaces.'
      },
      {
        id: 3,
        tactile: 'Soft, flexible material with medium grip',
        text: 'Protective covering material',
        output: 'This appears to be rubber or silicone material used for protection or grip enhancement in various applications.'
      }
    ];
    
    setExamples(demoExamples);
    toast.info('Demo examples loaded!');
  };

  return (
    <Container>
      <SectionHeader>
        <h2>
          <FontAwesomeIcon icon={faGraduationCap} className="icon" />
          Few-Shot Learning
        </h2>
        <p>Learn from examples to analyze new data</p>
      </SectionHeader>

      <Section>
        <h3>
          <FontAwesomeIcon icon={faList} className="icon" />
          Training Examples
        </h3>
        
        <div style={{ marginBottom: '20px' }}>
          <Button onClick={loadDemoExamples} variant="secondary" size="small">
            Load Demo Examples
          </Button>
        </div>

        {examples.map((example) => (
          <ExampleItem key={example.id}>
            <h4>
              Example {example.id}
              {examples.length > 1 && (
                <RemoveButton onClick={() => removeExample(example.id)}>
                  Remove
                </RemoveButton>
              )}
            </h4>
            <InputGrid>
              <InputField
                label="Tactile Data"
                value={example.tactile}
                onChange={(value) => updateExample(example.id, 'tactile', value)}
                placeholder="Example tactile data..."
                multiline
              />
              <InputField
                label="Text Context"
                value={example.text}
                onChange={(value) => updateExample(example.id, 'text', value)}
                placeholder="Example text..."
                multiline
              />
              <InputField
                label="Expected Output"
                value={example.output}
                onChange={(value) => updateExample(example.id, 'output', value)}
                placeholder="Expected analysis result..."
                multiline
              />
            </InputGrid>
          </ExampleItem>
        ))}

        <Button onClick={addExample} icon={faPlus} variant="secondary">
          Add Example
        </Button>
      </Section>

      <Section>
        <h3>
          <FontAwesomeIcon icon={faPlay} className="icon" />
          New Input to Analyze
        </h3>
        <InputGrid>
          <InputField
            label="Tactile Data"
            value={newInput.tactile}
            onChange={(value) => handleNewInputChange('tactile', value)}
            placeholder="New tactile data to analyze..."
            multiline
          />
          <InputField
            label="Text Description"
            value={newInput.text}
            onChange={(value) => handleNewInputChange('text', value)}
            placeholder="New text description..."
            multiline
          />
          <FileUpload
            label="Image (Optional)"
            onFileChange={handleFileChange}
            accept="image/*"
          />
        </InputGrid>
        <Button onClick={handleAnalyze} icon={faMagic} variant="primary">
          Analyze with Few-Shot Learning
        </Button>
      </Section>

      {results && (
        <ResultsDisplay
          title="Few-Shot Analysis Results"
          icon={faStar}
          results={results}
        />
      )}
    </Container>
  );
};

export default FewShotLearning; 