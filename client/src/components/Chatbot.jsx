import React, { useState } from 'react';
import './Chatbot.css';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="chatbot-wrapper">
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h4>Krushi AI Assistant</h4>
            <button onClick={() => setIsOpen(false)}>×</button>
          </div>
          <div className="chatbot-body">
            <p className="bot-msg">Hello! How can I help you with your farm today?</p>
          </div>
          <div className="chatbot-input">
            <input type="text" placeholder="Type a message..." />
            <button>Send</button>
          </div>
        </div>
      )}
      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        💬
      </button>
    </div>
  );
}

export default Chatbot;
