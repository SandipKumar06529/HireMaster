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

  const handleFinish = async (e) => {
    e.preventDefault();
    console.log("Final Step 3 Data:", formData);

    try {
      // Get Step 1 and Step 2 data from localStorage
      const step1 = JSON.parse(localStorage.getItem("freelancerSignupStep1"));
      const step2 = JSON.parse(localStorage.getItem("freelancerSignupStep2"));

      if (!step1 || !step2) {
        alert("Incomplete signup data. Please start again.");
        navigate("/freelancer-signup-step-1");
        return;
      }

      // Combine all data
      const combinedData = {
        userInput: {
          first_name: step1.firstName,
          last_name: step1.lastName,
          gender: step1.gender,
          email: step1.email,
          password: step1.password,
          account_type: "Freelancer"
        },
        freelancerInput: {
          university_name: step2.university,
          degree: step2.degree,
          major_of_undergrad: step2.majorUG,
          major_of_grad: step2.majorGrad,
          skills: step2.skills.split(",").map(skill => skill.trim()), // Convert to array
          resume: formData.resume,
          email: step1.email,
          phone_number: formData.phone,
          linkedin: formData.linkedin,
          github: formData.github,
          experience_level: formData.experience,
        }
      };

      console.log("Submitting to backend:", combinedData);

      // Perform GraphQL mutation
      const response = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation RegisterFreelancer($userInput: UserInput!, $freelancerInput: FreelancerInput!) {
              registerFreelancer(userInput: $userInput, freelancerInput: $freelancerInput) {
                userId
                token
                tokenExpiration
              }
            }
          `,
          variables: combinedData
        })
      });

      const result = await response.json();
      console.log("Server response:", result);

      if (result.errors) {
        alert(result.errors[0].message || "Signup failed. Please try again.");
      } else {
        alert("Signup successful!");

        // Clean up localStorage
        localStorage.removeItem("freelancerSignupStep1");
        localStorage.removeItem("freelancerSignupStep2");

        // Navigate to dashboard
        navigate("/");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleBack = () => {
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
          <li className="checked">STEP 1<br /><span>Lorem ipsum dolor sit amet, consectetur.</span></li>
          <li className="checked">STEP 2<br /><span>Lorem ipsum dolor sit amet, consectetur.</span></li>
          <li className="active">FINAL STEP<br /><span>Lorem ipsum dolor sit amet, consectetur.</span></li>
        </ul>
      </div>
    </div>
  );
}
