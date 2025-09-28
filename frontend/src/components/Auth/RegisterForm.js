import React, { useState } from "react";
import "./RegisterForm.css"; // We'll create this CSS file

function RegisterForm({ onRegistered }) {
  const [form, setForm] = useState({ username: "", password: "", role: "student" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("Registering...");
    
    try {
      const res = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      setMessage(data.message || "Registration successful!");
      if (res.ok) onRegistered && onRegistered();
    } catch {
      setMessage("Error registering. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Create Account</h2>
        <p className="form-subtitle">Join our learning community</p>
        
        <div className="form-row">
          <div className="input-group">
            <input 
              name="username" 
              placeholder="Username" 
              required 
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div className="input-group">
            <input 
              name="password" 
              type="password" 
              placeholder="Password" 
              required 
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div className="input-group">
            <select 
              name="role" 
              onChange={handleChange} 
              value={form.role}
              className="form-select"
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            className={`submit-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Registering...
              </>
            ) : (
              'Register Now'
            )}
          </button>
        </div>
        
        {message && (
          <div className={`message ${message.includes("Error") ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
        
        <div className="form-footer">
          <p>Already have an account? <a href="/login" className="link">Sign in</a></p>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;