import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Container = styled.div`
  margin-top: 30px;
  padding: 25px;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 5px solid #9b59b6;
`;

const Header = styled.h3`
  color: #2c3e50;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  
  .icon {
    color: #9b59b6;
  }
`;

const ResultText = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  line-height: 1.6;
  color: #2c3e50;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  white-space: pre-wrap;
`;

const MetaInfo = styled.div`
  display: grid;
  gap: 15px;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const MetaSection = styled.div`
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  
  h4 {
    color: #2c3e50;
    margin-bottom: 10px;
    font-size: 1rem;
  }
  
  pre {
    background: #f8f9fa;
    padding: 10px;
    border-radius: 5px;
    overflow-x: auto;
    font-size: 0.9rem;
    color: #2c3e50;
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
  }
  
  .text-content {
    color: #555;
    font-size: 0.95rem;
    line-height: 1.5;
  }
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c53030;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #e53e3e;
  font-weight: 500;
`;

const ResultsDisplay = ({ title, icon, results }) => {
  if (!results) return null;

  if (!results.success) {
    return (
      <Container>
        <Header>
          {icon && <FontAwesomeIcon icon={icon} className="icon" />}
          {title}
        </Header>
        <ErrorMessage>
          Error: {results.error || 'Unknown error occurred'}
        </ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        {icon && <FontAwesomeIcon icon={icon} className="icon" />}
        {title}
      </Header>
      
      <ResultText>
        {results.response || results.answer}
      </ResultText>
      
      <MetaInfo>
        {results.prompt_used && (
          <MetaSection>
            <h4>Prompt Used</h4>
            <pre>{results.prompt_used}</pre>
          </MetaSection>
        )}
        
        {results.model_info && (
          <MetaSection>
            <h4>Model Information</h4>
            <pre>{JSON.stringify(results.model_info, null, 2)}</pre>
          </MetaSection>
        )}
        
        {results.modalities_used && (
          <MetaSection>
            <h4>Modalities Used</h4>
            <div className="text-content">
              {Array.isArray(results.modalities_used) 
                ? results.modalities_used.join(', ')
                : results.modalities_used
              }
            </div>
          </MetaSection>
        )}
        
        {results.question && (
          <MetaSection>
            <h4>Original Question</h4>
            <div className="text-content">{results.question}</div>
          </MetaSection>
        )}
      </MetaInfo>
    </Container>
  );
};

export default ResultsDisplay; 