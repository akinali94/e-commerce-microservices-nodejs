import React from 'react';

const ChatMessage = ({ message, isUser, image }) => {
  if (isUser) {
    return (
      <>
        <p className="user-message">
          <span className="user-message-text">{message}</span>
        </p>
        {image && (
          <div className="user-image-div">
            <img src={image} className="user-image" alt="User uploaded" onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
        )}
      </>
    );
  }
  
  return (
    <p className={`bot-message ${!message ? 'bot-message-loading' : ''}`}>
      <span className="bot-message-text">{message || ''}</span>
    </p>
  );
};

export default ChatMessage;