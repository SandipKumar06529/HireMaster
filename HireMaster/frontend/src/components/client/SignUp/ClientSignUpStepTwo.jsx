import React, { useState } from "react";
import "./ClientSignUpStepTwo.css";
import { useNavigate } from "react-router-dom";
import { assets } from "../../../assets/assets";

export default function ClientSignUpStepTwo() {
  const navigate = useNavigate();

  // State for inputs
  const [companyName, setCompanyName] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [companyDomain, setCompanyDomain] = useState("");
  const [aboutCompany, setAboutCompany] = useState("");

  const handleFinish = async () => {
    const userId = localStorage.getItem("userId");
    const email = localStorage.getItem("email");

    if (!userId || !email) {
      alert("Missing user session. Please restart the signup process.");
      navigate("/signup/client");
      return;
    }

    const query = `
      mutation {
        createClient(clientInput: {
          user_id: "${userId}",
          company_name: "${companyName}",
          linkedin: "${linkedin}",
          company_domain: "${companyDomain}",
          about_company: "${aboutCompany}",
          email: "${email}"
        }) {
          id
          company_name
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
      console.log("Client creation response:", json);

      if (json?.data?.createClient?.id) {
        alert("Client profile created successfully!");
        navigate("/");
      } else if (json?.errors?.length) {
        alert("Failed: " + json.errors[0].message);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Client signup error:", err);
      alert("An error occurred: " + err.message);
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
            <input
              type="text"
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
            <input
              type="text"
              placeholder="LinkedIn Profile"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
            />
            <input
              type="text"
              placeholder="Company Domain"
              value={companyDomain}
              onChange={(e) => setCompanyDomain(e.target.value)}
            />
            <textarea
              placeholder="About Company"
              rows={4}
              value={aboutCompany}
              onChange={(e) => setAboutCompany(e.target.value)}
            ></textarea>

            <div className="form-row">
              <button type="button" className="btn-primary" onClick={handleFinish}>
                Finish
              </button>
              <button type="button" className="btn-primary" onClick={() => navigate("/signup/client")}>
                Back
              </button>
            </div>
          </form>

          <p className="policy-text">
            By Creating an Account, it means you agree to our <a href="#">Privacy Policy</a> and <a href="#">Terms of Service</a>
          </p>

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
          <div className="circle">○</div>
          <div className="step-text">
            <strong>STEP 1</strong>
            <p>Basic account credentials.</p>
          </div>
        </div>
        <div className="step">
          <div className="circle done">✔</div>
          <div className="step-text">
            <strong>STEP 2</strong>
            <p>Company profile and info.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
