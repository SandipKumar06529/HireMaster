import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ClientDashboard.css";
import { assets } from "../../../assets/assets";

export default function ClientDashboard() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);
  const notificationRef = useRef(null);
  const [clientStats, setClientStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      setTimeout(() => setShowNotifications(false), 5000);
    }
  };

  const markAsRead = async (id) => {
    if (!readNotifications.includes(id)) {
      setReadNotifications((prev) => [...prev, id]);

      try {
        await fetch("http://localhost:4000/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              mutation MarkNotification($notificationId: ID!) {
                markNotificationAsRead(notificationId: $notificationId)
              }
            `,
            variables: { notificationId: id }
          })
        });
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    }
  };

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

    fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { clientId } })
    })
      .then(res => res.json())
      .then(data => {
        setClientStats(data.data.getClientDashboardStats);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching dashboard stats:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const query = `
      query GetNotifications($userId: ID!) {
        getNotifications(userId: $userId) {
          id
          notification_message
          notification_type
          is_action_required
          notification_date
        }
      }
    `;

    fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { userId } })
    })
      .then(res => res.json())
      .then(data => {
        setNotifications(data.data.getNotifications);
      })
      .catch(error => {
        console.error("Failed to fetch notifications:", error);
      });
  }, []);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="SignIn-logo">
          <img src={assets.Logo_3} alt="Logo" />
        </div>
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
            <div className="notification-wrapper" ref={notificationRef}>
              <span className="notification" onClick={toggleNotifications}>
                🔔<sup>{notifications.length - readNotifications.length}</sup>
              </span>
              {showNotifications && (
                <div className="notifications-popup">
                  {notifications.map((note) => (
                    <div
                      key={note.id}
                      className={`notification-item ${note.notification_type} ${readNotifications.includes(note.id) ? 'read' : 'unread'}`}
                      onClick={() => markAsRead(note.id)}
                    >
                      {note.notification_message}
                      <div className="notification-date">
                        {new Date(parseInt(note.notification_date)).toLocaleString()}
                      </div>
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
        <footer className="footer-text">
          <span><img src={assets.Logo_3} alt="Logo" width='15px' /></span> © 2025 All Rights Reserved to HireMaster | Version 0.1
        </footer>
      </main>
    </div>
  );
}
