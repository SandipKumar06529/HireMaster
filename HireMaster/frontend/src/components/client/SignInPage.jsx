import React from "react";
import { useNavigate } from "react-router-dom";
import "./SignInPage.css";

export default function SignInPage() {
  const navigate = useNavigate();


  return (
    <div className="signin-container">
      <div className="signin-left">
        {/* <div className="signin-header">
          <h1>Sign In</h1>
          <p>Enter your email and password to Sign in!</p>
        </div> */}

        <div className="signup-header">
          <div className="logo">HM</div>
          <div className="login-link">
            <span>Already a User?</span>
            <button className="btn-outline" onClick={() => navigate("/")}>Log In</button>
          </div>
        </div>

        <div className="form-wrapper">
          <h1>Sign In</h1>
          <p>Enter your email and password to Sign in!</p> 

          <form className="signin-form">
            <div className="form-group">
              <label>Email*</label>
              <input type="email" placeholder="mail@simmmpale.com" />
            </div>

            <div className="form-group">
              <label>Password*</label>
              <input type="password" placeholder="Min. 8 characters" />
            </div>

            <div className="form-options">
              <label className="checkbox">
                <input type="checkbox" /> Keep me logged in
              </label>
              <a href="#">Forget password?</a>
            </div>

            <button type="submit" className="btn-primary">Login</button>

            <div className="signup-text">
              Not registered yet? Sign up here!
            </div>

            <div className="signup-buttons">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate("/signup/client")}
              >Client</button>

              <button type="button" className="btn-secondary" onClick={() => navigate("/freelancer-signup")}>Freelancer</button>
            </div>
          </form>
          </div>
        </div>

        <div className="signin-right">
          <h2>Start your freelancing journey with HireMaster.</h2>
          <p>
            Unlock opportunities and connect with clients seamlessly. Whether you’re a freelancer
            looking for exciting projects or a client searching for top talent, HireMaster provides
            the platform to make it happen.
          </p>
          <p>
            Sign in to manage your projects, bids, and payments effortlessly.
          </p>
        </div>
      </div>
      );
}
