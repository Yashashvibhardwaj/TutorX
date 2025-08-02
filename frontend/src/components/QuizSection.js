import React, { useState } from "react";

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
    <div>
      <h2>Quiz</h2>
      <input
        type="text"
        value={topic}
        onChange={e => setTopic(e.target.value)}
        placeholder="Quiz topic (e.g. HTML basics)"
        className="quiz-input"
      />
      <button className="btn-orange" onClick={handleQuiz} disabled={loading}>
        {loading ? "Loading..." : "Start Quiz"}
      </button>
      {quiz && <pre className="result">{quiz}</pre>}
    </div>
  );
}

export default QuizSection;
