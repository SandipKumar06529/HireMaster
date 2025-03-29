import React from "react";
import "./SignInPage.css";

export default function SignInPage() {
  return (
    <div className="signin-container">
      <div className="signin-left">
        <div className="signin-header">
          <h1>Sign In</h1>
          <p>Enter your email and password to Sign in!</p>
        </div>

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
            <button className="btn-secondary">Client</button>
            <button className="btn-secondary">Freelancer</button>
          </div>
        </form>
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
