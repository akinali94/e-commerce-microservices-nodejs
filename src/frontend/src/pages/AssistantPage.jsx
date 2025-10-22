import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from '../components/assistant/ChatMessage';
import ProductSuggestion from '../components/assistant/ProductSuggestion';
import { assistantService } from '../services/assistantservice';
import '../styles/global.css';
import '../styles/bot.css';

const AssistantPage = () => {
  const [messages, setMessages] = useState([
    { text: "Hi, I'm the Cymbal Shops assistant. I can help you with your shopping experience.", isUser: false },
    { text: "What can I help you with?", isUser: false }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  
  const messagesEndRef = useRef(null);
  const botMessagesRef = useRef(null);
  
  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, suggestedProducts]);
  
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };
  
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  
  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const imageData = await getBase64(e.target.files[0]);
      setImage(imageData);
    }
  };
  
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    // Add user message
    const userMessage = { text: inputText, isUser: true, image: image };
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input
    setInputText('');
    
    // Add loading message
    setIsLoading(true);
    setMessages(prev => [...prev, { text: '', isUser: false, isLoading: true }]);
    
    try {
      // Send message to assistant
      const response = await assistantService.sendMessage(userMessage.text, image);
      
      // Extract product IDs from response
      const extractedIds = assistantService.extractIdsFromString(response.message);
      
      // Update the last message (replacing loading message)
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { 
          text: response.message.replace(/\n+[-*\d][\S\s]*/g, ""), 
          isUser: false 
        };
        return updated;
      });
      
      // Fetch product data for each ID
      const productPromises = extractedIds.map(id => assistantService.getProductById(id));
      const productResults = await Promise.all(productPromises);
      
      setSuggestedProducts(productResults);
    } catch (error) {
      console.error('Error sending message:', error);
      // Update the last message to show error
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { 
          text: "Sorry, I couldn't process your request. Please try again.", 
          isUser: false 
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
      setImage(null); // Clear image after sending
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  return (
    <div className="chat-modal">
      <div className="bot-messages" ref={botMessagesRef}>
        {messages.map((message, index) => (
          <ChatMessage 
            key={index} 
            message={message.text} 
            isUser={message.isUser} 
            image={message.isUser ? image : null} 
          />
        ))}
        
        {suggestedProducts.length > 0 && (
          <div className="bot-products">
            {suggestedProducts.map((product, index) => (
              <ProductSuggestion key={index} product={product} />
            ))}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="bot-input">
        <input 
          id="bot-input-text" 
          type="text" 
          style={{ marginRight: '30px' }} 
          className="bot-input-text" 
          placeholder="Recommend me items..." 
          value={inputText}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <input 
          type="file" 
          className="bot-input-file-button" 
          onChange={handleFileChange}
          disabled={isLoading}
        />
        <button 
          id="bot-input-button" 
          className="bot-input-button"
          onClick={handleSendMessage}
          disabled={isLoading}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AssistantPage;