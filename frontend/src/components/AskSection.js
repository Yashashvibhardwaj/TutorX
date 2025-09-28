import React, { useState } from "react";
import "./AskSection.css"; // We'll create this CSS file

function AskSection() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setIsLoading(true);
    setResponse("Loading...");
    
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setResponse(data.response || "No response.");
    } catch {
      setResponse("Error connecting to the backend.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ask-section">
      <div className="ask-header">
        <h2 className="ask-title">Ask AI Assistant</h2>
        <p className="ask-subtitle">Get instant answers to your questions</p>
      </div>
      
      <form className="ask-form" onSubmit={handleAsk}>
        <div className="input-container">
          <input
            type="text"
            value={input}
            placeholder="What is an element in HTML?"
            onChange={(e) => setInput(e.target.value)}
            required
            className="ask-input"
            disabled={isLoading}
          />
          <button 
            className={`ask-button ${isLoading ? 'loading' : ''}`} 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="button-loader">
                <div className="spinner"></div>
                Asking...
              </div>
            ) : (
              <>
                <span>Ask AI</span>
                <svg className="ask-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>
        </div>
      </form>

      {response && (
        <div className={`response-container ${isLoading ? 'loading' : ''}`}>
          <div className="response-header">
            <div className="ai-avatar">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5V7H9V5.5L3 7V9L5 9.5V15.5L3 16V18L9 16.5V15.5L15 16.5V18L21 16V14L19 15.5V9.5L21 9Z"/>
              </svg>
            </div>
            <span>AI Response</span>
          </div>
          <div className="response-content">
            {response}
          </div>
        </div>
      )}
    </div>
  );
}

export default AskSection;