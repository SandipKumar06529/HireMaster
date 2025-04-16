import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignInPage.css";

export default function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const query = `
      mutation {
        loginUser(email: "${email}", password: "${password}") {
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
      console.log("Login response:", json);

      if (json?.data?.loginUser?.token) {
        const userId = json.data.loginUser.userId;
        localStorage.setItem("token", json.data.loginUser.token);
        localStorage.setItem("userId", json.data.loginUser.userId);
        const clientQuery = `
          query {
            getClientByUserId(userId: "${userId}") {
              id
            }
          }
        `;

        const clientRes = await fetch("http://localhost:4000/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: clientQuery }),
        });

        const clientJson = await clientRes.json();
        if (clientJson?.data?.getClientByUserId?.id) {
          localStorage.setItem("clientId", clientJson.data.getClientByUserId.id);
        } else {
          alert("Could not retrieve client profile.");
          return;
        }
        
        navigate("/dashboard"); // redirect after login
      } else {
        alert("Login failed: " + (json.errors?.[0]?.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("An error occurred during login.");
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-left">
        <div className="signup-header">
          <div className="logo">HM</div>
          {/* <div className="login-link">
            <span>Already a User?</span>
            <button className="btn-outline" onClick={() => navigate("/")}>Log In</button>
          </div> */}
        </div>

        <div className="form-wrapper">
          <h1>Sign In</h1>
          <p>Enter your email and password to Sign in!</p> 

          <form className="signin-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email*</label>
              <input
                type="email"
                placeholder="mail@simmmpale.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password*</label>
              <input
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
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
