import React from "react";
import AskSection from "./components/AskSection";
import QuizSection from "./components/QuizSection";
import CodeReviewSection from "./components/CodeReviewSection";
import "./App.css";

function App() {
  return (
    <div className="container">
      <h1 className="title">AI HTML Tutor</h1>
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
