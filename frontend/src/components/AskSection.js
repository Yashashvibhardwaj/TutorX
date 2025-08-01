import React, { useState } from "react";

function AskSection() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleAsk = async (e) => {
    e.preventDefault();
    setResponse("Loading...");
    try {
      const res = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setResponse(data.response || "No response.");
    } catch {
      setResponse("Error connecting to the backend.");
    }
  };

  return (
    <div>
      <h2>Ask a question</h2>
      <form className="flex" onSubmit={handleAsk}>
        <input
          type="text"
          value={input}
          placeholder="What is an element in HTML?"
          onChange={(e) => setInput(e.target.value)}
          required
        />
        <button className="btn-blue" type="submit">Ask</button>
      </form>
      {response && <div className="result">{response}</div>}
    </div>
  );
}

export default AskSection;
