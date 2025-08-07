import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StyledButton = styled.button`
  background: ${props => {
    switch (props.variant) {
      case 'primary':
        return 'linear-gradient(135deg, #9b59b6, #8e44ad)';
      case 'secondary':
        return 'linear-gradient(135deg, #3498db, #2980b9)';
      case 'success':
        return 'linear-gradient(135deg, #27ae60, #229954)';
      case 'danger':
        return 'linear-gradient(135deg, #e74c3c, #c0392b)';
      default:
        return 'linear-gradient(135deg, #9b59b6, #8e44ad)';
    }
  }};
  color: white;
  border: none;
  padding: ${props => props.size === 'small' ? '10px 20px' : '15px 30px'};
  border-radius: 25px;
  font-size: ${props => props.size === 'small' ? '0.9rem' : '1rem'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 10px 5px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(155, 89, 182, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
  
  ${props => props.fullWidth && `
    width: 100%;
    justify-content: center;
  `}
  
  ${props => props.outline && `
    background: transparent;
    color: #9b59b6;
    border: 2px solid #9b59b6;
    
    &:hover {
      background: #9b59b6;
      color: white;
    }
  `}
`;

const Button = ({ 
  children, 
  icon, 
  variant = 'primary', 
  size = 'medium', 
  fullWidth = false,
  outline = false,
  disabled = false,
  onClick,
  ...props 
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      outline={outline}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {icon && <FontAwesomeIcon icon={icon} />}
      {children}
    </StyledButton>
  );
};

export default Button; 