import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ProjectDetails.css";

export default function ProjectDetails() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">HM</div>
        <nav className="sidebar-menu">
          <Link to="/dashboard" className="menu-item">Dashboard</Link>
          <Link to="/projects" className="menu-item active">Projects</Link>
          <Link to="/payments" className="menu-item">Payments</Link>
          <Link to="/profile" className="menu-item">Profile</Link>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h2>Projects</h2>
        </header>

        <section className="project-details-section">
          <h3>View, Bid and manage your Projects here!</h3>

          <div className="project-full-card">
            <h4>Stock Market Tracking App</h4>
            <div className="project-meta">
              <span>💰 Budget: $11,000</span>
              <span>📅 Posted: 3/5/2025</span>
            </div>
            <p>
              We are looking for a highly skilled Mobile App Developer to build a Stock Market Tracking App that provides real-time stock data, interactive charts, and investment insights.
            </p>

            <h5>Key Responsibilities:</h5>
            <ul>
              <li>Develop a high-performance stock market tracking mobile app for Android and/or iOS.</li>
              <li>Implement real-time stock price tracking using financial APIs (e.g., Yahoo Finance, Alpha Vantage, IEX Cloud).</li>
              <li>Design and develop interactive charts with candlestick, line, and bar graph representations.</li>
              <li>Create a customizable watchlist feature for users to track their favorite stocks.</li>
              <li>Build a user-friendly dashboard displaying market trends, news, and portfolio insights.</li>
              <li>Implement secure login and authentication (OAuth, Firebase, or custom authentication).</li>
              <li>Optimize app performance for fast data updates and smooth UI interactions.</li>
              <li>Work with UX/UI designers to ensure an intuitive and visually appealing experience.</li>
              <li>Ensure data security and compliance with industry standards.</li>
              <li>Regularly test, debug, and update the app based on user feedback.</li>
            </ul>

            <h5>Required Skills & Qualifications:</h5>
            <ul>
              <li>Proficient in mobile app development (Swift for iOS, Kotlin/Java for Android, or Flutter/React Native).</li>
              <li>Strong understanding of RESTful APIs and WebSockets.</li>
              <li>Experience with financial APIs like Alpha Vantage, Yahoo Finance, IEX Cloud.</li>
              <li>Knowledge of state management (Redux, Provider, etc.).</li>
              <li>Familiarity with data visualization libraries (MPAndroidChart, Swift Charts).</li>
              <li>Experience with Firebase or AWS for backend services.</li>
              <li>Strong debugging and performance optimization skills.</li>
            </ul>

            <h5>Preferred Qualifications:</h5>
            <ul>
              <li>Experience in FinTech app development.</li>
              <li>Knowledge of encryption and secure data storage for financial transactions.</li>
              <li>Familiarity with push notifications for stock alerts.</li>
              <li>Experience integrating news APIs.</li>
            </ul>

            <h5>Why Join Us?</h5>
            <ul>
              <li>Work on an exciting FinTech project.</li>
              <li>Competitive salary and benefits.</li>
              <li>Opportunity to work with cutting-edge technologies.</li>
              <li>Flexible remote work options.</li>
            </ul>

            <div className="details-buttons">
              <button className="btn-bid" onClick={()=> navigate("/projects/details/bids")} >Bids</button>
              <button className="btn-cancel" onClick={() => navigate("/projects")}>Cancel</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
