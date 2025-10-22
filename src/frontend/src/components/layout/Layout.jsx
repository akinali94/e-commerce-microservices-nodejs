import React from 'react';
import Header from './Header';
import Footer from './Footer';
import PlatformIndicator from './PlatformIndicator';

const Layout = ({ 
  children, 
  platformName = 'local', 
  isCymbalBrand = false,
  assistantEnabled = false,
  frontendMessage = '',
  sessionId = '',
  requestId = '',
  deploymentDetails = null
}) => {
  return (
    <>
      <Header 
        isCymbalBrand={isCymbalBrand} 
        assistantEnabled={assistantEnabled}
        frontendMessage={frontendMessage}
      />
      <PlatformIndicator platform={platformName} />
      <main role="main">
        {children}
      </main>
      <Footer
        sessionId={sessionId}
        requestId={requestId}
        deploymentDetails={deploymentDetails}
        currentYear={new Date().getFullYear()}
      />
    </>
  );
};

export default Layout;