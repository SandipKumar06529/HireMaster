import React from "react";
import { Link } from "react-router-dom";
import "./FreelancerProjectDetails.css";
import BidModal from "./BidModal";

export default function FreelancerProjectDetails() {
    
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">HM</div>
        <nav className="sidebar-menu">
          <Link to="/freelancer-dashboard" className="menu-item">Dashboard</Link>
          <Link to="/freelancer-projects" className="menu-item active">Projects</Link>
          <Link to="/freelancer-payments" className="menu-item">Payment</Link>
          <Link to="/freelancer-profile" className="menu-item">Profile</Link>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="projects-header">
          <h2>Projects</h2>
        </header>

        <h3 className="title">View, Bid and manage your Projects here!</h3>

        <div className="project-detail-card">
          <h2 className="project-title">Stock Market Tracking App</h2>
          <p className="project-meta">
            <span>💼 Budget : $11,000</span>
            <span>📅 Posted : 3/5/2025</span>
          </p>
          <p className="project-description">
            We are looking for a highly skilled Mobile App Developer to build a Stock Market Tracking App that provides real-time stock data, interactive charts, and investment insights. The ideal candidate should have experience in financial applications, API integration, and a strong understanding of UI/UX best practices for trading and financial apps.
          </p>

          <div className="project-section">
            <h4>Key Responsibilities:</h4>
            <ul>
              <li>Develop a high-performance stock market tracking mobile app for Android and/or iOS.</li>
              <li>Implement real-time stock price tracking using financial APIs.</li>
              <li>Design and develop interactive charts with candlestick, line, and bar graph representations.</li>
              <li>Create a customizable watchlist feature for users to track their favorite stocks.</li>
              <li>Build a user-friendly dashboard displaying market trends, news, and portfolio insights.</li>
              <li>Implement secure login and authentication (OAuth, Firebase, or custom authentication).</li>
              <li>Optimize app performance for fast data updates and smooth UI interactions.</li>
            </ul>
          </div>

          <div className="project-section">
            <h4>Required Skills & Qualifications:</h4>
            <ul>
              <li>Proficient in mobile app development (Swift for iOS, Kotlin/Java for Android).</li>
              <li>Strong understanding of RESTful APIs and WebSockets.</li>
              <li>Experience with financial APIs like Alpha Vantage, Yahoo Finance, or IEX Cloud.</li>
              <li>Experience with Firebase or AWS for backend services.</li>
              <li>Strong debugging and performance optimization skills.</li>
            </ul>
          </div>

          <div className="project-actions">
            <button className="btn-bid">Bid</button>
            <button className="btn-save">Save</button>
          </div>
        </div>
      </main>
    </div>
  );
}
