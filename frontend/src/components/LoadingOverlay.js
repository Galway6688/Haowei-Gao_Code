import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const LoadingSpinner = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const SpinnerIcon = styled(FontAwesomeIcon)`
  font-size: 3rem;
  color: #9b59b6;
  margin-bottom: 15px;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  color: #2c3e50;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
`;

const LoadingOverlay = () => {
  return (
    <Overlay>
      <LoadingSpinner>
        <SpinnerIcon icon={faSpinner} />
        <LoadingText>Processing your request...</LoadingText>
      </LoadingSpinner>
    </Overlay>
  );
};

export default LoadingOverlay; 