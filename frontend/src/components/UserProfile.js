import React, { useEffect, useState } from "react";

function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:8000/me", {
        headers: { "Authorization": "Bearer " + token }
      })
        .then(res => res.json())
        .then(setUser)
        .catch(() => setUser(null));
    }
  }, []);

  if (!user) return null;

  return (
    <div style={{ margin: "10px 0" }}>
      <strong>Logged in as:</strong> {user.username} <br />
      <strong>Role:</strong> {user.role}
    </div>
  );
}

export default UserProfile;
