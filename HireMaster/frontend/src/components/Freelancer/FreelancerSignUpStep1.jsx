import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FreelancerSignUpStep1.css";

export default function FreelancerSignupStep1() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "Male",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Freelancer Step 1 Data:", formData);

    // Save Step 1 data temporarily in localStorage
    localStorage.setItem("freelancerSignupStep1", JSON.stringify(formData));

    // Navigate to Step 2
    navigate("/freelancer-signup-step2");
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <div className="top-nav">
          <span>Already a Freelancer?</span>
          <button className="btn-login" onClick={() => navigate("/")}>Log In</button>
        </div>

        <h1>Sign Up As a Freelancer</h1>
        <p>Enter your details to sign up!</p>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="gender-section">
            <label>Gender:</label>
            <label className="radio-option">
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={formData.gender === "Male"}
                onChange={handleChange}
              />
              Male
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={formData.gender === "Female"}
                onChange={handleChange}
              />
              Female
            </label>
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="password-strength-bar"></div>
          <p className="password-strength-label">Password Strength</p>

          <button type="submit" className="btn-primary">
            Next
          </button>

          <p className="terms-text">
            By Creating an Account, it means you agree to our <a href="#">Privacy Policy</a> and <a href="#">Terms of Service</a>
          </p>
        </form>

        <footer className="signup-footer">
          <span>HM</span>
          <p>© 2025 All Rights Reserved to HireMaster | Version 0.1</p>
        </footer>
      </div>

      <div className="signup-right">
        <h2>Steps to Register as Freelancer</h2>
        <ul className="steps">
          <li className="active">STEP 1<br/><span>Lorem ipsum dolor sit amet, consectetur.</span></li>
          <li>STEP 2<br/><span>Lorem ipsum dolor sit amet, consectetur.</span></li>
          <li>FINAL STEP<br/><span>Lorem ipsum dolor sit amet, consectetur.</span></li>
        </ul>
      </div>
    </div>
  );
}
