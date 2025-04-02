import React from "react";
import { Link } from "react-router-dom";
import "./FreelancerDashboard.css";

export default function FreelancerDashboard() {
  const projects = [
    { title: "AI Chatbot UI", client: "Yuhua Cao", bid: 6000, status: "Active" },
    { title: "Expense Tracking Web App", client: "Brian Imohe", bid: 15000, status: "Inactive" },
    { title: "Serverless API Deployment", client: "Yuhua Cao", bid: 18000, status: "Active" },
    { title: "Fitness App", client: "Jade Walters", bid: 12000, status: "Active" },
    { title: "Movie Recommendation App", client: "John Patrick", bid: 14000, status: "Inactive" }
  ];

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">HM</div>
        <nav className="sidebar-menu">
          <Link to="/freelancer-dashboard" className="menu-item active">Dashboard</Link>
          <Link to="/freelancer-projects" className="menu-item">Projects</Link>
          <Link to="/freelancer-payments" className="menu-item">Payment</Link>
          <Link to="/freelancer-profile" className="menu-item">Profile</Link>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h2>Dashboard</h2>
          <div className="header-actions">
            <span className="notification">🔔<sup>2</sup></span>
            <span className="avatar">🧑‍💻</span>
          </div>
        </header>

        <section className="welcome-section">
          <h1>Welcome To Hire Master</h1>
          <h2>Amy Wong</h2>
        </section>

        <section className="stats-section">
          <div className="stat-card">
            <h3>Total Bids Accepted</h3>
            <p className="stat-number">2,456</p>
            <p className="stat-positive">+2.5%</p>
          </div>
          <div className="stat-card">
            <h3>No of Clients</h3>
            <p className="stat-number">4,561</p>
            <p className="stat-negative">-4.4%</p>
          </div>
          <div className="stat-card">
            <h3>No of Active projects</h3>
            <p className="stat-number">125</p>
            <p className="stat-positive">+1.5%</p>
          </div>
          <div className="stat-card">
            <h3>No of Payment</h3>
            <p className="stat-number">2,456</p>
            <p className="stat-positive">+4.5%</p>
          </div>
        </section>

        <section className="projects-section">
          <div className="projects-header">
            <h3>My Projects</h3>
            <div className="filters">
              <button>Monthly</button>
              <button>Weekly</button>
              <button className="active">Today</button>
            </div>
          </div>

          <table className="projects-table">
            <thead>
              <tr>
                <th>Project Title</th>
                <th>Client</th>
                <th>Bid Amount ($)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr key={index}>
                  <td>{project.title}</td>
                  <td>{project.client}</td>
                  <td>{project.bid}</td>
                  <td>
                    <span className={`status ${project.status.toLowerCase()}`}>
                      {project.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
