import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./ClientProjects.css";

export default function ClientProjects() {
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
          <button className="btn-post" onClick={() => navigate("/projects/new")} >Post Project</button>
        </header>

        <section className="projects-section">
          <h3>View, Post and manage your Projects here!</h3>

          <div className="project-card">
            <h4>Stock Market Tracking App</h4>
            <div className="project-meta">
              <span>💰 Budget : $11,000</span>
              <span>📅 Posted : 3/5/2025</span>
            </div>
            <p>
              We are looking for a highly skilled Mobile App Developer to build a Stock Market Tracking App that provides real-time stock data, interactive charts, and investment insights. The ideal candidate should have experience in financial applications, API integration, and a strong understanding of UI/UX best practices for trading and financial apps.
            </p>
            <button className="btn-manage" onClick={() => navigate("/projects/details")}  >Manage</button>
          </div>

          <div className="project-card">
            <h4>Social Media Dashboard</h4>
            <div className="project-meta">
              <span>💰 Budget : $18,000</span>
              <span>📅 Posted : 3/11/2025</span>
            </div>
            <p>
              We are seeking a talented Full Stack Developer to build a Social Media Dashboard that allows users to manage multiple social media accounts, schedule posts, track engagement metrics, and analyze performance from a single platform. The ideal candidate should have experience in API integrations, real-time data updates, and data visualization to create an intuitive and efficient dashboard.
            </p>
            <button className="btn-read" onClick={() => navigate("/projects/details")}>Manage</button>
          </div>
        </section>

        <footer className="dashboard-footer">
          <span>HM</span>
          <p>© 2025 All Rights Reserved to HireMaster | Version 0.1</p>
        </footer>
      </main>
    </div>
  );
}
