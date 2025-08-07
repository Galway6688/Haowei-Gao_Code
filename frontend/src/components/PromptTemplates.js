import React, { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCode, 
  faList, 
  faPlus, 
  faSave,
  faInfoCircle,
  faSync,
  faDownload 
} from '@fortawesome/free-solid-svg-icons';

import { multimodalAPI } from '../services/api';
import InputField from './common/InputField';
import Button from './common/Button';

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

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
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

const TemplatesList = styled.div`
  background: white;
  padding: 15px;
  border-radius: 8px;
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
`;

const TemplateItem = styled.div`
  padding: 10px;
  margin: 5px 0;
  background: #f8f9fa;
  border-radius: 5px;
  border-left: 3px solid #9b59b6;
  
  .template-name {
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 5px;
  }
  
  .template-description {
    font-size: 0.9rem;
    color: #7f8c8d;
  }
`;

const ModelInfoSection = styled.div`
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

const ModelStatus = styled.div`
  background: white;
  padding: 15px;
  border-radius: 8px;
  min-height: 200px;
  
  pre {
    background: #f8f9fa;
    padding: 10px;
    border-radius: 5px;
    overflow-x: auto;
    font-size: 0.9rem;
    margin: 10px 0;
  }
`;

const HelpText = styled.div`
  background: #e3f2fd;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #2196f3;
  margin-bottom: 20px;
  
  .icon {
    color: #2196f3;
    margin-right: 8px;
  }
  
  p {
    margin: 0;
    color: #1565c0;
    font-size: 0.95rem;
    line-height: 1.5;
  }
`;

const PromptTemplates = ({ setIsLoading }) => {
  const [availableTemplates, setAvailableTemplates] = useState([]);
  const [modelInfo, setModelInfo] = useState(null);
  const [customTemplate, setCustomTemplate] = useState({
    name: '',
    template: '',
    requiredInputs: ''
  });

  const loadAvailableTemplates = async () => {
    setIsLoading(true);
    try {
      const result = await multimodalAPI.getAvailableTemplates();
      if (result.success) {
        setAvailableTemplates(result.templates);
        toast.success(`Loaded ${result.templates.length} templates`);
      } else {
        toast.error('Error loading templates');
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error(`Error loading templates: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadModelInfo = async () => {
    setIsLoading(true);
    try {
      const result = await multimodalAPI.getModelInfo();
      if (result.success) {
        setModelInfo(result.model_info);
        toast.info('Model information loaded');
      } else {
        toast.error('Error loading model information');
      }
    } catch (error) {
      console.error('Error loading model info:', error);
      toast.error(`Error loading model information: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const createCustomTemplate = async () => {
    if (!customTemplate.name || !customTemplate.template || !customTemplate.requiredInputs) {
      toast.error('Please fill in all template fields');
      return;
    }

    // Validate JSON format for required inputs
    try {
      JSON.parse(customTemplate.requiredInputs);
    } catch (error) {
      toast.error('Required inputs must be valid JSON array format');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', customTemplate.name);
      formData.append('template', customTemplate.template);
      formData.append('required_inputs', customTemplate.requiredInputs);

      const result = await multimodalAPI.createCustomTemplate(formData);
      if (result.success) {
        toast.success('Template created successfully!');
        setCustomTemplate({ name: '', template: '', requiredInputs: '' });
        // Reload templates to show the new one
        loadAvailableTemplates();
      } else {
        toast.error('Error creating template');
      }
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error(`Error creating template: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateInputChange = (field, value) => {
    setCustomTemplate(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const loadExampleTemplate = () => {
    setCustomTemplate({
      name: 'custom_material_analysis',
      template: 'Analyze the following material data:\n\nTactile Properties: {tactile_data}\nVisual Description: {text_description}\nTask: {task_instruction}\n\nProvide a comprehensive analysis including material identification, properties, and potential applications.',
      requiredInputs: '["tactile_data", "text_description", "task_instruction"]'
    });
    toast.info('Example template loaded');
  };

  return (
    <Container>
      <SectionHeader>
        <h2>
          <FontAwesomeIcon icon={faCode} className="icon" />
          Prompt Templates
        </h2>
        <p>Manage and customize prompt templates</p>
      </SectionHeader>

      <SectionGrid>
        <Section>
          <h3>
            <FontAwesomeIcon icon={faList} className="icon" />
            Available Templates
          </h3>
          
          <Button onClick={loadAvailableTemplates} icon={faDownload} size="small">
            Load Available Templates
          </Button>
          
          <TemplatesList>
            {availableTemplates.length === 0 ? (
              <p style={{ color: '#7f8c8d', textAlign: 'center', marginTop: '50px' }}>
                No templates loaded. Click "Load Available Templates" to view.
              </p>
            ) : (
              availableTemplates.map((template, index) => (
                <TemplateItem key={index}>
                  <div className="template-name">{template}</div>
                  <div className="template-description">
                    Built-in template for {template.replace(/_/g, ' ')} tasks
                  </div>
                </TemplateItem>
              ))
            )}
          </TemplatesList>
        </Section>

        <Section>
          <h3>
            <FontAwesomeIcon icon={faPlus} className="icon" />
            Create Custom Template
          </h3>
          
          <HelpText>
            <FontAwesomeIcon icon={faInfoCircle} className="icon" />
            <p>
              Create custom templates with placeholders like {"{tactile_data}"}, {"{text_description}"}, etc. 
              Required inputs should be a JSON array of placeholder names.
            </p>
          </HelpText>

          <Button 
            onClick={loadExampleTemplate} 
            variant="secondary" 
            size="small"
            style={{ marginBottom: '15px' }}
          >
            Load Example Template
          </Button>

          <InputField
            label="Template Name"
            value={customTemplate.name}
            onChange={(value) => handleTemplateInputChange('name', value)}
            placeholder="Enter template name..."
          />
          
          <InputField
            label="Template Content"
            value={customTemplate.template}
            onChange={(value) => handleTemplateInputChange('template', value)}
            placeholder="Enter template with placeholders like {tactile_data}, {text_description}, etc."
            multiline
            style={{ minHeight: '120px' }}
          />
          
          <InputField
            label="Required Inputs (JSON array)"
            value={customTemplate.requiredInputs}
            onChange={(value) => handleTemplateInputChange('requiredInputs', value)}
            placeholder='["tactile_data", "text_description", "task_instruction"]'
            multiline
          />
          
          <Button onClick={createCustomTemplate} icon={faSave}>
            Save Template
          </Button>
        </Section>
      </SectionGrid>

      <ModelInfoSection>
        <h3>
          <FontAwesomeIcon icon={faInfoCircle} className="icon" />
          Model Information
        </h3>
        
        <Button onClick={loadModelInfo} icon={faSync} size="small">
          Load Model Information
        </Button>
        
        <ModelStatus>
          {!modelInfo ? (
            <p style={{ color: '#7f8c8d', textAlign: 'center', marginTop: '50px' }}>
              No model information loaded. Click "Load Model Information" to view current configuration.
            </p>
          ) : (
            <div>
              <h4>Current Model Configuration:</h4>
              <pre>{JSON.stringify(modelInfo, null, 2)}</pre>
            </div>
          )}
        </ModelStatus>
      </ModelInfoSection>
    </Container>
  );
};

export default PromptTemplates; 