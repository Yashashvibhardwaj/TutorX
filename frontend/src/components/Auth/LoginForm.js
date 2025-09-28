import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import './LoginForm.css';

function LoginForm({ onLogin, compact = false }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [particles, setParticles] = useState([]);
  const containerRef = useRef(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (message) setMessage("");
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  // Enhanced particle animation - only for full mode
  useEffect(() => {
    if (compact) return; // Don't create particles in compact mode
    
    const createParticle = () => ({
      id: Math.random(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 12 + 8,
      delay: Math.random() * 2
    });

    const initialParticles = Array.from({ length: 20 }, createParticle);
    setParticles(initialParticles);

    const interval = setInterval(() => {
      setParticles(prev => [...prev.slice(-19), createParticle()]);
    }, 1200);

    return () => clearInterval(interval);
  }, [compact]);

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("Logging in...");

    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(form)
      });
      
      const data = await res.json();
      
      if (res.ok && data.access_token) {
        localStorage.setItem("token", data.access_token);
        setMessage("Login successful! Redirecting...");
        setTimeout(() => {
          onLogin && onLogin();
        }, 1500);
      } else {
        setMessage(data.detail || "Login failed. Please check your credentials.");
        triggerShake();
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
      triggerShake();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (message.includes("successful")) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className={`login-container ${compact ? 'compact' : ''}`} ref={containerRef}>
      {/* Enhanced Animated Background - only for full mode */}
      {!compact && (
        <>
          <div className="particles-container">
            {particles.map(particle => (
              <motion.div
                key={particle.id}
                className="particle"
                initial={{ 
                  opacity: 0,
                  x: particle.x + '%',
                  y: particle.y + '%'
                }}
                animate={{
                  opacity: [0, 0.6, 0],
                  y: particle.y - 25 + '%',
                  x: particle.x + (Math.random() - 0.5) * 8 + '%'
                }}
                transition={{
                  duration: particle.duration,
                  delay: particle.delay,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
                style={{
                  width: particle.size,
                  height: particle.size,
                  background: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`
                }}
              />
            ))}
          </div>

          {/* Animated Gradient Orbs - only for full mode */}
          <div className="gradient-orbs">
            <motion.div
              className="orb orb-1"
              animate={{
                x: [0, 30, 0],
                y: [0, -20, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="orb orb-2"
              animate={{
                x: [0, -40, 0],
                y: [0, 30, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 5
              }}
            />
          </div>
        </>
      )}

      <motion.div 
        className={`login-card ${compact ? 'compact' : ''}`}
        initial={{ opacity: 0, y: compact ? 10 : 30, scale: compact ? 0.98 : 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: compact ? 0.3 : 0.6, type: "spring" }}
        whileHover={compact ? {} : { scale: 1.005 }}
      >
        <div className={`login-content-wrapper ${compact ? 'compact' : ''}`}>
          {/* Left Section - Branding - hidden in compact mode */}
          {!compact && (
            <motion.div 
              className="brand-section"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="logo-container">
                <motion.div
                  className="logo-icon"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  🚀
                </motion.div>
              </div>
              
              <div className="brand-content">
                <motion.h1 
                  className="main-title"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  AI HTML TUTOR
                </motion.h1>
                <motion.p 
                  className="brand-subtitle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Master HTML with Artificial Intelligence
                </motion.p>
                
                <motion.div 
                  className="features-list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="feature-item">
                    <span className="feature-icon">✨</span>
                    <span>Interactive Learning</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🤖</span>
                    <span>AI-Powered Guidance</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🚀</span>
                    <span>Real-time Projects</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Right Section - Login Form */}
          <motion.div 
            className="form-section"
            initial={{ opacity: 0, x: compact ? 0 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: compact ? 0.1 : 0.3 }}
          >
            {compact && (
              <div className="compact-header">
                <h3 className="compact-title">Sign In</h3>
                <p className="compact-subtitle">Access your account</p>
              </div>
            )}
            
            {!compact && (
              <div className="form-header">
                <h2 className="form-title">Welcome Back</h2>
                <p className="form-subtitle">Sign in to continue your journey</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className={`form-row ${compact ? 'compact' : ''}`}>
                {/* Username Field */}
                <motion.div 
                  className={`form-group ${shake ? 'shake' : ''} ${activeField === 'username' ? 'active' : ''}`}
                  initial={{ opacity: 0, x: compact ? 0 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: compact ? 0.2 : 0.4 }}
                >
                  <label htmlFor="username" className="form-label">
                    <span className="label-icon">👤</span>
                    Username
                  </label>
                  <div className="input-container">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Enter username"
                      required
                      onChange={handleChange}
                      onFocus={() => setActiveField('username')}
                      onBlur={() => setActiveField(null)}
                      className="form-input"
                      disabled={isLoading}
                    />
                    <div className="input-highlight"></div>
                  </div>
                </motion.div>

                {/* Password Field */}
                <motion.div 
                  className={`form-group ${shake ? 'shake' : ''} ${activeField === 'password' ? 'active' : ''}`}
                  initial={{ opacity: 0, x: compact ? 0 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: compact ? 0.3 : 0.5 }}
                >
                  <label htmlFor="password" className="form-label">
                    <span className="label-icon">🔒</span>
                    Password
                  </label>
                  <div className="input-container">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter password"
                      required
                      onChange={handleChange}
                      onFocus={() => setActiveField('password')}
                      onBlur={() => setActiveField(null)}
                      className="form-input"
                      disabled={isLoading}
                    />
                    <div className="input-highlight"></div>
                  </div>
                </motion.div>
              </div>

              {/* Enhanced Remember Me & Forgot Password */}
              <motion.div 
                className="form-options-row"
                initial={{ opacity: 0, y: compact ? 0 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: compact ? 0.4 : 0.6 }}
              >
                <label className="remember-me">
                  <input type="checkbox" className="checkbox-hidden" />
                  <span className="custom-checkbox">
                    <motion.span 
                      className="checkmark"
                      initial={{ scale: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  </span>
                  <span className="remember-text">Remember me</span>
                </label>
                <a href="/forgot-password" className="forgot-password">
                  Forgot password?
                </a>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                className={`login-button ${isLoading ? 'loading' : ''} ${compact ? 'compact' : ''}`}
                disabled={isLoading}
                whileHover={{ 
                  scale: isLoading ? 1 : (compact ? 1.01 : 1.02),
                  boxShadow: isLoading ? "none" : "0 10px 25px rgba(102, 126, 234, 0.3)"
                }}
                whileTap={{ scale: isLoading ? 1 : (compact ? 0.99 : 0.98) }}
                initial={{ opacity: 0, y: compact ? 0 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: compact ? 0.5 : 0.7 }}
              >
                {isLoading ? (
                  <div className="button-loader">
                    <div className="spinner"></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <>
                    <span>Sign In</span>
                    <motion.span
                      initial={{ x: -5, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      →
                    </motion.span>
                  </>
                )}
              </motion.button>
            </form>

            {/* Enhanced Social Login - hidden in compact mode */}
            {!compact && (
              <motion.div 
                className="social-login"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="divider">
                  <span>Or continue with</span>
                </div>
                <div className="social-buttons">
                  <motion.button 
                    className="social-btn google-btn"
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="social-icon">
                      <svg viewBox="0 0 24 24" width="18" height="18">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </div>
                    <span>Google</span>
                  </motion.button>
                  <motion.button 
                    className="social-btn github-btn"
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="social-icon">
                      <svg viewBox="0 0 24 24" width="18" height="18">
                        <path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </div>
                    <span>GitHub</span>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Message Display */}
            <AnimatePresence>
              {message && (
                <motion.div
                  className={`message ${message.includes("successful") ? 'success' : 'error'} ${compact ? 'compact' : ''}`}
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  transition={{ duration: 0.3, type: "spring" }}
                >
                  <div className="message-icon">
                    {message.includes("successful") ? "✅" : "⚠️"}
                  </div>
                  <span className="message-text">{message}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer - hidden in compact mode */}
            {!compact && (
              <motion.div 
                className="login-footer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <p>New to AI HTML Tutor? <a href="/signup" className="footer-link">Start Learning</a></p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginForm;