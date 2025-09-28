import React, { useState, useEffect } from "react";
import RegisterForm from "./components/Auth/RegisterForm";
import LoginForm from "./components/Auth/LoginForm";
import LogoutButton from "./components/Auth/LogoutButton";
import UserProfile from "./components/UserProfile";
import AskSection from "./components/AskSection";
import QuizSection from "./components/QuizSection";
import CodeReviewSection from "./components/CodeReviewSection";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [showLogin, setShowLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const handleAuth = () => setIsLoggedIn(!!localStorage.getItem("token"));

  useEffect(() => {
    // Simulate loading for better UX
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <h2>Loading AI HTML Tutor...</h2>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="auth-container">
        <div className="auth-background">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
        
        <div className="auth-card">
          <div className="auth-header">
            <div className="logo">
              <div className="logo-icon">{"</>"}</div>
              <h1>AI HTML Tutor</h1>
            </div>
            <p className="tagline">Master HTML with AI-powered guidance</p>
          </div>

          <div className="auth-content">
            {showLogin ? (
              <>
                <LoginForm onLogin={handleAuth} compact />
                <div className="auth-switch">
                  <p>Don't have an account?</p>
                  <button 
                    className="switch-btn"
                    onClick={() => setShowLogin(false)}
                  >
                    Create Account
                  </button>
                </div>
              </>
            ) : (
              <>
                <RegisterForm onRegistered={() => setShowLogin(true)} />
                <div className="auth-switch">
                  <p>Already have an account?</p>
                  <button 
                    className="switch-btn"
                    onClick={() => setShowLogin(true)}
                  >
                    Sign In
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="brand">
            <div className="logo">
              <div className="logo-icon">{"</>"}</div>
              <h1>AI HTML Tutor</h1>
            </div>
          </div>
          <div className="header-actions">
            <UserProfile />
            <LogoutButton onLogout={handleAuth} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="welcome-banner">
          <h2>Welcome to Your Learning Journey!</h2>
          <p>Ask questions, take quizzes, and get code reviews to master HTML</p>
        </div>

        <div className="features-grid">
          {/* Ask Section - Full Width */}
          <div className="feature-card feature-card-wide">
            <div className="card-header">
              <div className="card-icon ask-icon">💬</div>
              <h3>Ask AI Tutor</h3>
            </div>
            <AskSection />
          </div>

          {/* Quiz and Code Review Side by Side */}
          <div className="feature-row">
            <div className="feature-card">
              <div className="card-header">
                <div className="card-icon quiz-icon">🧠</div>
                <h3>Interactive Quiz</h3>
              </div>
              <QuizSection />
            </div>

            <div className="feature-card">
              <div className="card-header">
                <div className="card-icon code-icon">🔍</div>
                <h3>Code Review</h3>
              </div>
              <CodeReviewSection />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;