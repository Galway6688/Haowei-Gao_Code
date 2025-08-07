import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Container = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 0.95rem;
  
  .icon {
    color: #9b59b6;
    margin-right: 5px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  resize: vertical;
  min-height: ${props => props.multiline ? '100px' : 'auto'};
  
  &:focus {
    outline: none;
    border-color: #9b59b6;
    box-shadow: 0 0 0 3px rgba(155, 89, 182, 0.1);
  }
  
  &::placeholder {
    color: #a0a0a0;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #9b59b6;
    box-shadow: 0 0 0 3px rgba(155, 89, 182, 0.1);
  }
  
  &::placeholder {
    color: #a0a0a0;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  background: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #9b59b6;
    box-shadow: 0 0 0 3px rgba(155, 89, 182, 0.1);
  }
`;

const InputField = ({ 
  label, 
  icon, 
  type = 'text', 
  multiline = false, 
  options = null, 
  value, 
  onChange, 
  placeholder = '', 
  required = false,
  style = {},
  ...props 
}) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const renderInput = () => {
    if (options) {
      return (
        <Select value={value} onChange={handleChange} required={required} {...props}>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      );
    }

    if (multiline) {
      return (
        <TextArea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          {...props}
        />
      );
    }

    return (
      <Input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        {...props}
      />
    );
  };

  return (
    <Container style={style}>
      {label && (
        <Label>
          {icon && <FontAwesomeIcon icon={icon} className="icon" />}
          {label}
        </Label>
      )}
      {renderInput()}
    </Container>
  );
};

export default InputField; 