import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/global.css';

const ErrorPage = ({ statusCode = 404, status = 'Not Found', error = 'The page you are looking for could not be found.' }) => {
  const location = useLocation();
  
  return (
    <div className="py-5">
      <div className="container bg-light py-3 px-lg-5 py-lg-5">
        <h1>Uh, oh!</h1>
        <p>Something has failed. Below are some details for debugging.</p>

        <p><strong>HTTP Status:</strong> {statusCode} {status}</p>
        <p><strong>Path:</strong> {location.pathname}</p>
        
        <pre className="border border-danger p-3" style={{ whiteSpace: 'pre-wrap', wordBreak: 'keep-all' }}>
          {error}
        </pre>
      </div>
    </div>
  );
};

export default ErrorPage;