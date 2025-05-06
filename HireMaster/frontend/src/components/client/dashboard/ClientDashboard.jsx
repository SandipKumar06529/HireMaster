import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ClientDashboard.css";
import { assets } from "../../../assets/assets";

export default function ClientDashboard() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const [clientStats, setClientStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggleMenu = () => setShowMenu(!showMenu);

  const handleLogout = () => {
    alert("Logging out...");
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      const clientId = localStorage.getItem("clientId");
      if (!clientId) return;

      const query = `
        query GetClientStats($clientId: ID!) {
          getClientDashboardStats(clientId: $clientId) {
            clientName
            totalProjectsPosted
            totalBidsReceived
            totalActiveProjects
            totalPaymentsMade
            projects {
              title
              freelancerName
              bidAmount
              status
            }
          }
        }
      `;

      try {
        const response = await fetch("http://localhost:4000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query,
            variables: { clientId },
          }),
        });

        const result = await response.json();
        setClientStats(result.data.getClientDashboardStats);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">HM</div>
        <nav className="sidebar-menu">
          <Link to="/dashboard" className="menu-item active">Dashboard</Link>
          <Link to="/projects" className="menu-item">Projects</Link>
          <Link to="/payments" className="menu-item">Payments</Link>
          <Link to="/profile" className="menu-item">Profile</Link>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h2>Dashboard</h2>
          <div className="header-actions">
            <span className="notification">🔔<sup>2</sup></span>
            <div className="profile-wrapper" ref={menuRef}>
              <span className="avatar" onClick={toggleMenu}>🧑‍💼</span>
              {showMenu && (
                <div className="dropdown-menu">
                  <button onClick={() => navigate("/profile")}>My Profile</button>
                  <button onClick={handleLogout}>Log Out</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <section className="welcome-section">
          <img src={assets.Background_dashboard} alt="background" className="background-img" />
          <div className="welcome-content">
            <div className="text-content">
              <h1>Welcome To HireMaster</h1>
              <h2>{clientStats?.clientName || "Client"}</h2>
            </div>
            <img src={assets.dashboard_image} alt="illustration" className="foreground-img" />
          </div>
        </section>

        <section className="stats-section">
          <div className="stat-card">
            <h3>Project Posts</h3>
            <p className="stat-number">{clientStats?.totalProjectsPosted ?? "--"}</p>
          </div>
          <div className="stat-card">
            <h3>Total Bids Received</h3>
            <p className="stat-number">{clientStats?.totalBidsReceived ?? "--"}</p>
          </div>
          <div className="stat-card">
            <h3>No of Active Projects</h3>
            <p className="stat-number">{clientStats?.totalActiveProjects ?? "--"}</p>
          </div>
          <div className="stat-card">
            <h3>No of Payments</h3>
            <p className="stat-number">{clientStats?.totalPaymentsMade ?? "--"}</p>
          </div>
        </section>

        <section className="posts-section">
          <div className="posts-header">
            <h3>Recent Posts</h3>
          </div>

          <table className="posts-table">
            <thead>
              <tr>
                <th>Project Title</th>
                <th>Freelancer</th>
                <th>Bid Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4">Loading projects...</td></tr>
              ) : clientStats?.projects?.length > 0 ? (
                clientStats.projects.map((project, index) => (
                  <tr key={index}>
                    <td>{project.title}</td>
                    <td>{project.freelancerName}</td>
                    <td>${project.bidAmount}</td>
                    <td>
                      <span className={`status ${project.status.toLowerCase()}`}>
                        {project.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4">No projects found.</td></tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
