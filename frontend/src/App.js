import React, { useState } from 'react';
import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header';
import LoadingOverlay from './components/LoadingOverlay';
import MainInterface from './components/MainInterface';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
`;

function App() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AppContainer>
      <ContentWrapper>
        <Header />
        <MainInterface setIsLoading={setIsLoading} />
      </ContentWrapper>
      
      {isLoading && <LoadingOverlay />}
      
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </AppContainer>
  );
}

export default App; 