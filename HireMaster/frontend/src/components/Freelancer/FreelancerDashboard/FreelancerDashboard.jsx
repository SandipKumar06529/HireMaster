import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./FreelancerDashboard.css";
import { assets } from "../../../assets/assets";

export default function FreelancerDashboard() {
  const [dashboardStats, setDashboardStats] = useState(null);
  const freelancerId = localStorage.getItem("freelancerId");

  const [showNotifications, setShowNotifications] = useState(false);
  const [readNotifications, setReadNotifications] = useState([]);
  const notificationRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const notifications = [
    { text: "Your bid on 'Stock Market Tracking App' has been accepted! 🎉", type: "accepted" },
    { text: "You have a new project invitation: 'Mobile Fitness App'. 📩", type: "invitation" },
    { text: "Reminder: Update your profile to attract more clients.", type: "general" }
  ];

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      setTimeout(() => setShowNotifications(false), 5000);
    }
  };

  const toggleMenu = () => setShowMenu(!showMenu);
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const markAsRead = (index) => {
    if (!readNotifications.includes(index)) {
      setReadNotifications([...readNotifications, index]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Fetch freelancer dashboard stats
  useEffect(() => {
    if (!freelancerId) return;

    const query = `
      query {
        getFreelancerDashboardStats(freelancerId: "${freelancerId}") {
          freelancerName
          totalBidsAccepted
          totalClientsWorkedWith
          totalActiveProjects
          totalPaymentsReceived
          projects {
            title
            clientName
            bidAmount
            status
          }
        }
      }
    `;

    const fetchStats = async () => {
      const res = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const json = await res.json();
      setDashboardStats(json?.data?.getFreelancerDashboardStats || null);
    };

    fetchStats();
  }, [freelancerId]);


  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">HM</div>
        <nav className="sidebar-menu">
          <Link to="/freelancer-dashboard" className="menu-item active">Dashboard</Link>
          <Link to="/freelancer-projects" className="menu-item">Projects</Link>
          <Link to="/freelancer-payments" className="menu-item">Payments</Link>
          <Link to="/freelancer-bids" className="menu-item">Manage Bids</Link>
          <Link to="/freelancer-profile" className="menu-item">Profile</Link>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h2>Dashboard</h2>
          <div className="header-actions">
            {/* Notification */}
            <div className="notification-wrapper" ref={notificationRef}>
              <span className="notification" onClick={toggleNotifications}>
                🔔<sup>{notifications.length - readNotifications.length}</sup>
              </span>
              {showNotifications && (
                <div className="notifications-popup">
                  {notifications.map((note, idx) => (
                    <div
                      key={idx}
                      className={`notification-item ${readNotifications.includes(idx) ? 'read' : ''}`}
                      onClick={() => markAsRead(idx)}
                    >
                      {note.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
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

        {/* <section className="welcome-section">
          <h1>Welcome To Hire Master</h1>
          <h2>Amy Wong</h2>
        </section> */}
        <section className="welcome-section">
          <img src={assets.Background_dashboard} alt="background" className="background-img" />

          <div className="welcome-content">
            <div className="text-content">
              <h1>Welcome To HireMaster</h1>
              <h2>{dashboardStats?.freelancerName || "Freelancer"}</h2>
            </div>
            <img src={assets.dashboard_image} alt="illustration" className="foreground-img" />
          </div>
        </section>

        <section className="stats-section">
          <div className="stat-card">
            <h3>Total Bids Accepted</h3>
            <p className="stat-number">{dashboardStats?.totalBidsAccepted ?? 0}</p>
          </div>
          <div className="stat-card">
            <h3>No of Clients</h3>
            <p className="stat-number">{dashboardStats?.totalClientsWorkedWith ?? 0}</p>
          </div>
          <div className="stat-card">
            <h3>No of Active projects</h3>
            <p className="stat-number">{dashboardStats?.totalActiveProjects ?? 0}</p>
          </div>
          <div className="stat-card">
            <h3>No of Payment</h3>
            <p className="stat-number">{dashboardStats?.totalPaymentsReceived ?? 0}</p>
          </div>
        </section>


        <section className="projects-section">
          <div className="projects-header">
            <h3>My Projects</h3>
            {/* <div className="filters">
              <button>Monthly</button>
              <button>Weekly</button>
              <button className="active">Today</button>
            </div> */}
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
              {dashboardStats?.projects?.length > 0 ? (
                dashboardStats.projects.map((project, index) => (
                  <tr key={index}>
                    <td>{project.title}</td>
                    <td>{project.clientName}</td>
                    <td>{project.bidAmount}</td>
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
        <footer className="footer-text">
          <span>HM</span> © 2025 All Rights Reserved to HireMaster | Version 0.1
        </footer>
      </main>
    </div>
  );
}
