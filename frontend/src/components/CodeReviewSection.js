import React, { useState } from "react";
import "./CodeReviewSection.css"; // We'll create this CSS file

function CodeReviewSection() {
  const [code, setCode] = useState("");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleReview = async (e) => {
    e.preventDefault();
    setLoading(true);
    setReview("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8000/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      setReview(data.review || "No review provided.");
    } catch {
      setReview("Error connecting to the backend. Please try again.");
    }
    setLoading(false);
  };

  const handleClear = () => {
    setCode("");
    setReview("");
  };

  return (
    <div className="code-review-container">
      <div className="review-header">
        <div className="header-icon">💻</div>
        <h2>AI Code Review</h2>
        <p>Get instant feedback on your HTML code</p>
      </div>

      <form onSubmit={handleReview} className="review-form">
        <div className="input-section">
          <div className="section-header">
            <span className="section-title">Your Code</span>
            <div className="section-actions">
              <button 
                type="button" 
                className="btn-clear"
                onClick={handleClear}
                disabled={loading}
              >
                Clear
              </button>
              <button 
                type="button" 
                className="btn-expand"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "↗ Collapse" : "↘ Expand"}
              </button>
            </div>
          </div>
          
          <textarea
            rows={isExpanded ? 12 : 6}
            value={code}
            placeholder="Paste your HTML code here for review..."
            onChange={e => setCode(e.target.value)}
            required
            className="code-input"
            disabled={loading}
          />
          
          <div className="char-count">
            {code.length} characters
          </div>
        </div>

        <button 
          className={`submit-btn ${loading ? 'loading' : ''}`} 
          type="submit" 
          disabled={loading || !code.trim()}
        >
          {loading ? (
            <>
              <div className="spinner"></div>
              Analyzing Code...
            </>
          ) : (
            <>
              <span className="btn-icon">🔍</span>
              Review Code
            </>
          )}
        </button>
      </form>

      {review && (
        <div className="result-section">
          <div className="section-header">
            <span className="section-title">Review Results</span>
            <div className="result-indicator">
              <span className="indicator-dot"></span>
              Analysis Complete
            </div>
          </div>
          <div className="review-result">
            <div className="result-content">
              {review}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CodeReviewSection;