import React, { useState } from "react";
import "./ClientSignUp.css";
import { useNavigate } from "react-router-dom";
import { assets } from "../../../assets/assets";

export default function ClientSignUp() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleStepOneSubmit = async () => {
    const query = `
      mutation {
        createUser(userInput: {
          first_name: "${firstName}",
          last_name: "${lastName}",
          email: "${email}",
          password: "${password}",
          account_type: "Client"
        }) {
          userId
          token
          tokenExpiration
        }
      }
    `;

    try {
      const res = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const json = await res.json();
      console.log("Full response:", json); // ✅ Show exact response in dev console

      if (json?.data?.createUser?.userId) {
        localStorage.setItem("userId", json.data.createUser.userId);
        localStorage.setItem("email", email);
        navigate("/signup/client/step2");
      } else if (json?.errors?.length) {
        alert("Signup failed: " + json.errors[0].message);
      } else {
        alert("Signup failed. Please try again.");
      }

    } catch (err) {
      console.error("Signup error:", err);
      alert("An error occurred during signup: " + err.message);
    }
  };

  return (
    <div className="signup-container">
      {/* Left Section */}
      <div className="signup-left">
        <div className="signup-header">
          <div className="SignIn-logo">
            <img src={assets.Logo_3} alt="Logo" />
          </div>
          <div className="login-link">
            <span>Already a Client?</span>
            <button className="btn-outline" onClick={() => navigate("/")}>Log In</button>
          </div>
        </div>

        <div className="form-wrapper">
          <h1>Sign Up As a Client</h1>
          <p>Enter your details to sign up!</p>

          <form className="signup-form">
            <div className="form-row">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="password-field">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="eye-icon">👁️</span>
            </div>

            <div className="password-strength">
              <div className="strength-bar"></div>
              <p>Password Strength</p>
            </div>

            <button type="button" className="btn-primary" onClick={handleStepOneSubmit}>
              Next
            </button>

            <p className="policy-text">
              By Creating an Account, it means you agree to our{" "}
              <a href="#">Privacy Policy</a> and{" "}
              <a href="#">Terms of Service</a>
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
            <p>Basic account credentials.</p>
          </div>
        </div>
        <div className="step">
          <div className="circle">○</div>
          <div className="step-text">
            <strong>STEP 2</strong>
            <p>Company profile and info.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
