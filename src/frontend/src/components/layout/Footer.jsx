import React from 'react';
import '../../styles/global.css';

const Footer = ({ sessionId, requestId, deploymentDetails, currentYear = new Date().getFullYear() }) => {
  return (
    <footer className="py-5">
      <div className="footer-top">
        <div className="container footer-social">
          <p className="footer-text">
            This website is hosted for demo purposes only. It is not an actual shop. 
          </p>
          <p className="footer-text">
            © {currentYear} AA
          </p>
          <p className="footer-text">
            <small>
              {sessionId && (
                <>session-id: {sessionId} — </>
              )}
              {requestId && (
                <>request-id: {requestId}</>
              )}
            </small>
            <br />
            <small>
              {deploymentDetails ? (
                <>
                  {deploymentDetails.CLUSTERNAME && (
                    <><b>Cluster: </b>{deploymentDetails.CLUSTERNAME}<br /></>
                  )}
                  {deploymentDetails.ZONE && (
                    <><b>Zone: </b>{deploymentDetails.ZONE}<br /></>
                  )}
                  {deploymentDetails.HOSTNAME && (
                    <><b>Pod: </b>{deploymentDetails.HOSTNAME}</>
                  )}
                </>
              ) : (
                <>
                  Deployment details are still loading.
                  Try refreshing this page.
                </>
              )}
            </small>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;