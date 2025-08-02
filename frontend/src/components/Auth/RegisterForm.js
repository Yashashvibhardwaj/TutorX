import React, { useState } from "react";

function RegisterForm({ onRegistered }) {
  const [form, setForm] = useState({ username: "", password: "", role: "student" });
  const [message, setMessage] = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("Registering...");
    try {
      const res = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      setMessage(data.message || "Registered!");
      if (res.ok) onRegistered && onRegistered();
    } catch {
      setMessage("Error registering.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input name="username" placeholder="Username" required onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" required onChange={handleChange} />
      <select name="role" onChange={handleChange} value={form.role}>
        <option value="student">Student</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">Register</button>
      <div>{message}</div>
    </form>
  );
}
export default RegisterForm;
