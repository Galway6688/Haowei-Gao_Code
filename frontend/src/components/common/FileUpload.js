import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

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

const UploadArea = styled.div`
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8f9fa;
  
  &:hover {
    border-color: #9b59b6;
    background: rgba(155, 89, 182, 0.05);
  }
  
  &.dragover {
    border-color: #9b59b6;
    background: rgba(155, 89, 182, 0.1);
  }
  
  &.has-file {
    border-color: #27ae60;
    background: rgba(39, 174, 96, 0.05);
  }
`;

const UploadIcon = styled(FontAwesomeIcon)`
  font-size: 2rem;
  color: #9b59b6;
  display: block;
  margin-bottom: 10px;
  
  &.success {
    color: #27ae60;
  }
`;

const UploadText = styled.p`
  color: #7f8c8d;
  margin: 0;
  
  &.success {
    color: #27ae60;
    font-weight: 600;
  }
`;

const Filename = styled.span`
  display: block;
  margin-top: 10px;
  color: #27ae60;
  font-weight: 600;
`;

const HiddenInput = styled.input`
  display: none;
`;

const FileUpload = ({ 
  label, 
  icon, 
  onFileChange, 
  accept = "*/*", 
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB default
  ...props 
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && file.size > maxSize) {
      alert(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
      return;
    }

    setSelectedFile(file);
    onFileChange(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const getUploadAreaClass = () => {
    if (selectedFile) return 'has-file';
    if (dragOver) return 'dragover';
    return '';
  };

  return (
    <Container {...props}>
      {label && (
        <Label>
          {icon && <FontAwesomeIcon icon={icon} className="icon" />}
          {label}
        </Label>
      )}
      
      <UploadArea
        className={getUploadAreaClass()}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <UploadIcon 
          icon={selectedFile ? faCheckCircle : faCloudUploadAlt}
          className={selectedFile ? 'success' : ''}
        />
        <UploadText className={selectedFile ? 'success' : ''}>
          {selectedFile 
            ? 'File uploaded successfully!' 
            : 'Click to upload file or drag & drop'
          }
        </UploadText>
        {selectedFile && (
          <Filename>{selectedFile.name}</Filename>
        )}
      </UploadArea>
      
      <HiddenInput
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInputChange}
      />
    </Container>
  );
};

export default FileUpload; 