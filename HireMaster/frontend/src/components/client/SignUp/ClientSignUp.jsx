import React from "react";
import "./ClientSignUp.css";
import { useNavigate } from "react-router-dom";

export default function ClientSignUp() {
  const navigate = useNavigate();
  return (
    <div className="signup-container">
      {/* Left Section */}
      <div className="signup-left">
        <div className="signup-header">
          <div className="logo">HM</div>
          <div className="login-link">
            <span>Already a Client?</span>
            <button className="btn-outline" onClick={()=> navigate("/")}>Log In</button>
          </div>
        </div>

        <div className="form-wrapper">
          <h1>Sign Up As a Client</h1>
          <p>Enter your details to sign up!</p>

          <form className="signup-form">
            <div className="form-row">
              <input type="text" placeholder="First Name" />
              <input type="text" placeholder="LastName" />
            </div>

            <input type="email" placeholder="Email Address" />
            <div className="password-field">
              <input type="password" placeholder="Password" />
              <span className="eye-icon">👁️</span>
            </div>

            <div className="password-strength">
              <div className="strength-bar"></div>
              <p>Password Strength</p>
            </div>

            <button type="button" className="btn-primary" onClick={() => navigate("/signup/client/step2") }>Next</button>

            <p className="policy-text">
              By Creating an Account, it means you agree to our <a href="#">Privacy Policy</a> and <a href="#">Terms of Service</a>
            </p>
          </form>

          <footer className="signup-footer">
            <span>HM</span>
            <p>© 2025 All Rights Reserved to HireMaster | Version 0.1</p>
          </footer>
        </div>
      </div>

      {/* Right Section */}
      <div className="signup-right">
        <h2>Steps to Register as Client</h2>
        <div className="step">
          <div className="circle done">✔</div>
          <div className="step-text">
            <strong>STEP 1</strong>
            <p>Lorem ipsum dolor sit amet, consectetur.</p>
          </div>
        </div>
        <div className="step">
          <div className="circle">○</div>
          <div className="step-text">
            <strong>STEP 2</strong>
            <p>Lorem ipsum dolor sit amet, consectetur.</p>
          </div>
        </div>
      </div>
    </div>
  );
}