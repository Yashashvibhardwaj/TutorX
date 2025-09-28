import React, { useState } from "react";
import "./LogoutButton.css"; // We'll create this CSS file

function LogoutButton({ onLogout }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    
    try {
      if (token) {
        await fetch("http://localhost:8000/logout", {
          method: "POST",
          headers: { "Authorization": "Bearer " + token }
        });
      }
      localStorage.removeItem("token");
      onLogout && onLogout();
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API call fails, clear local storage
      localStorage.removeItem("token");
      onLogout && onLogout();
    } finally {
      setIsLoading(false);
      setShowConfirm(false);
    }
  };

  const handleLogoutClick = () => {
    setShowConfirm(true);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <div className="logout-container">
      {showConfirm ? (
        <div className="logout-confirm-dialog">
          <div className="confirm-message">
            <span className="confirm-icon">🚪</span>
            <span>Are you sure you want to logout?</span>
          </div>
          <div className="confirm-buttons">
            <button 
              className="confirm-btn confirm-yes"
              onClick={handleLogout}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Logging out...
                </>
              ) : (
                "Yes, Logout"
              )}
            </button>
            <button 
              className="confirm-btn confirm-no"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button 
          className="logout-btn"
          onClick={handleLogoutClick}
          title="Logout from your account"
        >
          <span className="logout-icon">⎋</span>
          <span className="logout-text">Logout</span>
        </button>
      )}
    </div>
  );
}

export default LogoutButton;