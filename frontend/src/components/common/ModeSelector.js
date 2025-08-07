import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Container = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
`;

const ModeButton = styled.button`
  padding: 12px 20px;
  border: 2px solid #e0e0e0;
  background: ${props => props.active ? '#9b59b6' : 'white'};
  color: ${props => props.active ? 'white' : '#7f8c8d'};
  border-color: ${props => props.active ? '#9b59b6' : '#e0e0e0'};
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    border-color: #9b59b6;
    color: ${props => props.active ? 'white' : '#9b59b6'};
  }
  
  ${props => props.active && `
    box-shadow: 0 3px 10px rgba(155, 89, 182, 0.3);
  `}
  
  .icon {
    margin-right: 4px;
  }
  
  .icon + .icon {
    margin-left: 2px;
  }
`;

const ModeSelector = ({ modes, activeMode, onModeChange }) => {
  const renderIcon = (icon) => {
    if (Array.isArray(icon)) {
      return icon.map((iconItem, index) => (
        <FontAwesomeIcon key={index} icon={iconItem} className="icon" />
      ));
    }
    return <FontAwesomeIcon icon={icon} className="icon" />;
  };

  return (
    <Container>
      {modes.map(mode => (
        <ModeButton
          key={mode.id}
          active={activeMode === mode.id}
          onClick={() => onModeChange(mode.id)}
        >
          {renderIcon(mode.icon)}
          {mode.label}
        </ModeButton>
      ))}
    </Container>
  );
};

export default ModeSelector; 