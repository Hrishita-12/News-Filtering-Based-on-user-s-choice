import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-box">
        <h1 className="title">Welcome to Your News</h1>
        <p className="subtitle">Choose how you'd like to proceed:</p>
        <div className="button-group">
          <button className="btn login-btn" onClick={() => navigate("/login")}>
            Login
          </button>
          <button
            className="btn register-btn"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
          <button
  className="btn guest-btn"
  onClick={() => {
    localStorage.setItem("guest", "true"); // Mark guest session
    navigate("/home");
  }}
>
  Browse as Guest
</button>

        </div>
      </div>
    </div>
  );
};

export default LandingPage;
