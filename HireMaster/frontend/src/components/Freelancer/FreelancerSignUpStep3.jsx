import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FreelancerSignUpStep3.css";

export default function FreelancerSignupStep3() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    experience: "",
    resume: "",
    phone: "",
    linkedin: "",
    github: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFinish = (e) => {
    e.preventDefault();
    console.log("Final Signup Data:", formData);
    alert("Signup Complete!");
    navigate("/freelancer-dashboard");
  };

  const handleBack = () => {
    navigate("/freelancer-signup-step-2");
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

        <form className="signup-form" onSubmit={handleFinish}>
          <label>Experience Level:</label>
          <input
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            required
          />

          <label>Resume Link:</label>
          <input
            type="text"
            name="resume"
            value={formData.resume}
            onChange={handleChange}
          />

          <label>Phone Number:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <label>LinkedIn:</label>
          <input
            type="text"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
          />

          <label>GitHub:</label>
          <input
            type="text"
            name="github"
            value={formData.github}
            onChange={handleChange}
          />

          <div className="button-row">
            <button type="submit" className="btn-primary">Finish</button>
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
          <li className="checked">STEP 2<br/><span>Lorem ipsum dolor sit amet, consectetur.</span></li>
          <li className="active">FINAL STEP<br/><span>Lorem ipsum dolor sit amet, consectetur.</span></li>
        </ul>
      </div>
    </div>
  );
}
