import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ProjectBids.css";

export default function ProjectBids() {
  const navigate = useNavigate();

  const bids = [
    {
      id: 1,
      name: "Alice Johnson",
      bidAmount: "$3,500",
      proposal: "I have 5+ years of experience in stock trading apps. I can start immediately and deliver fast.",
      status: "Pending",
    },
    {
      id: 2,
      name: "Brian Lee",
      bidAmount: "$4,000",
      proposal: "Expert in API integration and finance dashboards. Let's build this together!",
      status: "Reviewed",
    },
    {
      id: 3,
      name: "Catherine Singh",
      bidAmount: "$3,800",
      proposal: "I developed similar apps with real-time charts. Excited to collaborate.",
      status: "Accepted",
    },
  ];

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
          <h2>Bids for Stock Market Tracking App</h2>
        </header>

        <section className="bids-section">
          {bids.map((bid) => (
            <div className="bid-card" key={bid.id}>
              <h4>{bid.name}</h4>
              <div className="bid-meta">
                <span className="amount">Bid: {bid.bidAmount}</span>
                <span className={`status ${bid.status.toLowerCase()}`}>{bid.status}</span>
              </div>
              <p className="proposal">{bid.proposal}</p>
              <div className="bid-actions">
                <button className="btn-accept">Accept</button>
                <button className="btn-reject">Reject</button>
              </div>
            </div>
          ))}

          <button className="btn-back" onClick={() => navigate("/projects/details")}>Back to Project</button>
        </section>
      </main>
    </div>
  );
}
