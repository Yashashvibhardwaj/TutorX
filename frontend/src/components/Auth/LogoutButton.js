import React from "react";

function LogoutButton({ onLogout }) {
  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      await fetch("http://localhost:8000/logout", {
        method: "POST",
        headers: { "Authorization": "Bearer " + token }
      });
      localStorage.removeItem("token");
      onLogout && onLogout();
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}

export default LogoutButton;
