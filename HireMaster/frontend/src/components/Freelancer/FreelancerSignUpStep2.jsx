import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FreelancerSignUpStep2.css";

export default function FreelancerSignupStep2() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    university: "",
    degree: "",
    majorUG: "",
    majorGrad: "",
    skills: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    console.log("Freelancer Step 2 Data:", formData);
    navigate("/freelancer-signup-step3");
  };

  const handleBack = () => {
    navigate("/freelancer-signup");
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <div className="top-nav">
          <span>Already a Freelancer?</span>
          <button className="btn-login" onClick={()=> navigate("/")}>Log In</button>
        </div>

        <h1>Sign Up As a Freelancer</h1>
        <p>Enter your details to sign up!</p>

        <form className="signup-form" onSubmit={handleNext}>
          <label>University Name:</label>
          <input
            type="text"
            name="university"
            value={formData.university}
            onChange={handleChange}
            required
          />

          <label>Degree:</label>
          <input
            type="text"
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            required
          />

          <label>Major(Undergrad):</label>
          <input
            type="text"
            name="majorUG"
            value={formData.majorUG}
            onChange={handleChange}
          />

          <label>Major(Grad):</label>
          <input
            type="text"
            name="majorGrad"
            value={formData.majorGrad}
            onChange={handleChange}
          />

          <label>Skills:</label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
          />

          <div className="button-row">
            <button type="submit" className="btn-primary">Next</button>
            <button type="button" className="btn-secondary" onClick={handleBack}>Back</button>
          </div>

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
          <li className="checked">STEP 1<br/><span>Lorem ipsum dolor sit amet, consectetur.</span></li>
          <li className="active">STEP 2<br/><span>Lorem ipsum dolor sit amet, consectetur.</span></li>
          <li>FINAL STEP<br/><span>Lorem ipsum dolor sit amet, consectetur.</span></li>
        </ul>
      </div>
    </div>
  );
}
