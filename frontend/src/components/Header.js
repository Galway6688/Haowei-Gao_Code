import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';

const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 20px 30px;
  margin-bottom: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  
  .icon {
    background: #667eea;
    color: white;
    padding: 8px;
    border-radius: 8px;
    margin-right: 12px;
    font-size: 1.2rem;
  }
  
  h1 {
    font-size: 1.5rem;
    color: #2c3e50;
    margin: 0;
    font-weight: 600;
  }
  
  .subtitle {
    font-size: 0.9rem;
    color: #7f8c8d;
    margin: 0;
    font-weight: 400;
  }
`;

const Navigation = styled.nav`
  display: flex;
  gap: 20px;
  
  a {
    color: #667eea;
    text-decoration: none;
    padding: 8px 16px;
    border-radius: 8px;
    transition: all 0.3s ease;
    
    &:hover {
      background: #667eea;
      color: white;
    }
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Logo>
        <FontAwesomeIcon icon={faLayerGroup} className="icon" />
        <div>
          <h1>Interactive Multimodal GPT</h1>
          <p className="subtitle">Advanced AI Reasoning Across Modalities</p>
        </div>
      </Logo>
      
      <Navigation>
        <a href="#dashboard">Dashboard</a>
        <a href="#history">History</a>
        <a href="#settings">Settings</a>
        <a href="#get-started" style={{ background: '#667eea', color: 'white' }}>Get Started</a>
      </Navigation>
    </HeaderContainer>
  );
};

export default Header; 