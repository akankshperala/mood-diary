import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "./AuthForm.css"; // Import the matching CSS below

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [avatarEmoji, setAvatarEmoji] = useState("🧑‍💻");
  const [showSparkle, setShowSparkle] = useState(false);
  const navigate = useNavigate();
  const avatarRef = useRef(null); // Add ref for avatar

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const endpoint = isLogin ? "login" : "register";
    const data = { username, password };
    const response = await api.post(`/auth/${endpoint}`, data);
    console.log("Response:", response.data);
    setMessage(response.data.message || "Success!");

    if (isLogin) {
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      // Trigger avatar animation
      if (avatarRef.current) {
        setAvatarEmoji("😁"); // Change to happy face
        avatarRef.current.classList.add("avatar-animate");
        setTimeout(() => {
          setShowSparkle(true); // Show sparkle at the end
        }, 800); // Sparkle near end of bounce
        setTimeout(() => {
          setShowSparkle(false); // Hide sparkle
          avatarRef.current.classList.remove("avatar-animate");
        }, 1000); // Match animation duration
      }
      document.querySelector(".login-btn").classList.add("fly"); // Trigger rocket animation

      setTimeout(() => {
        navigate("/welcome"); // Redirect to WelcomeKitten after animation
      }, 2000); // Wait 2 seconds before navigating
    }
  } catch (error) {
    console.error(error);
    setMessage(error.response?.data?.message || "Something went wrong");
  }
};


  return (
    <div className="auth-page">
      <div className="clouds"></div>
      <div className="auth-form">
        <div ref={avatarRef} className="avatar-icon" style={{ fontSize: '3rem', marginBottom: '0.5rem', position: 'relative' }}>
          {avatarEmoji}
          {showSparkle && (
            <span className="avatar-sparkle">✨</span>
          )}
        </div>
        <h2>{isLogin ? "🌈 Welcome Back!" : "✨ Create an Account"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username 🧑"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password 🔒"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-btn">
  {isLogin ? "🚀 Login" : "🎉 Register"}
</button>


        </form>
        <p className="switch-auth">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="switch-btn"
          >
            {isLogin ? "Register here" : "Login here"}
          </button>
        </p>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default AuthForm;
