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
  const [showLogin, setShowLogin] = useState(true); // Toggle between login/register

  // Reload state on login/logout
  const handleAuth = () => setIsLoggedIn(!!localStorage.getItem("token"));

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="container">
        <h1>AI HTML Tutor</h1>
        <div style={{maxWidth: 350, margin: "0 auto"}}>
          {showLogin ? (
            <>
              <LoginForm onLogin={handleAuth} />
              <p>
                Don't have an account?{" "}
                <button onClick={() => setShowLogin(false)}>Register</button>
              </p>
            </>
          ) : (
            <>
              <RegisterForm onRegistered={() => setShowLogin(true)} />
              <p>
                Already have an account?{" "}
                <button onClick={() => setShowLogin(true)}>Login</button>
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  // If logged in, show the main app
  return (
    <div className="container">
      <h1>AI HTML Tutor</h1>
      <UserProfile />
      <LogoutButton onLogout={handleAuth} />
      <div className="card ask-section">
        <AskSection />
      </div>
      <div className="row">
        <div className="card quiz-section">
          <QuizSection />
        </div>
        <div className="card code-review-section">
          <CodeReviewSection />
        </div>
      </div>
    </div>
  );
}

export default App;
