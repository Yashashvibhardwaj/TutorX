import React, { useState } from "react";

function CodeReviewSection() {
  const [code, setCode] = useState("");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReview = async (e) => {
    e.preventDefault();
    setLoading(true);
    setReview("");
    try {
      const res = await fetch("http://localhost:8000/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      setReview(data.review || "No review.");
    } catch {
      setReview("Error connecting to the backend.");
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Code Review</h2>
      <form onSubmit={handleReview}>
        <textarea
          rows={4}
          value={code}
          placeholder="Enter HTML code for review..."
          onChange={e => setCode(e.target.value)}
          required
        />
        <button className="btn-blue" type="submit" disabled={loading}>
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>
      {review && <pre className="result">{review}</pre>}
    </div>
  );
}

export default CodeReviewSection;
