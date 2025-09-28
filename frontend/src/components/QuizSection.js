import React, { useState } from "react";
import "./QuizSection.css"; // We'll create this CSS file

function QuizSection() {
  const [quiz, setQuiz] = useState("");
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("HTML basics");

  const handleQuiz = async () => {
    setLoading(true);
    setQuiz("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8000/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ topic })
      });
      const data = await res.json();
      setQuiz(data.quiz || "No quiz generated.");
    } catch {
      setQuiz("Error connecting to the backend.");
    }
    setLoading(false);
  };

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2 className="quiz-title">Knowledge Challenge</h2>
        <div className="quiz-subtitle">Test your skills with AI-generated quizzes</div>
      </div>
      
      <div className="quiz-controls">
        <div className="input-group">
          <label htmlFor="quiz-topic" className="input-label">Quiz Topic</label>
          <input
            id="quiz-topic"
            type="text"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="Enter a topic (e.g., HTML basics, JavaScript functions)"
            className="quiz-input"
          />
        </div>
        
        <button 
          className={`quiz-button ${loading ? 'loading' : ''}`} 
          onClick={handleQuiz} 
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="spinner"></div>
              Generating Quiz...
            </>
          ) : (
            <>
              <span className="button-icon">🎯</span>
              Start Quiz Challenge
            </>
          )}
        </button>
      </div>

      {quiz && (
        <div className="quiz-result">
          <div className="result-header">
            <h3>Your Generated Quiz</h3>
            <div className="quiz-badge">Live</div>
          </div>
          <div className="quiz-content">
            <pre>{quiz}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizSection;