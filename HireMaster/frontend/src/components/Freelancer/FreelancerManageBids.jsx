import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./FreelancerManageBids.css";

export default function FreelancerManageBids() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [readNotifications, setReadNotifications] = useState([]);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const notificationRef = useRef(null);

  const bids = [
    {
      projectTitle: "Stock Market Tracking App",
      budget: "$11,000",
      date: "3/5/2025",
      proposal: "I can build the stock tracking app with real-time APIs and strong UI/UX.",
      bidAmount: "$10,000"
    },
    {
      projectTitle: "Social Media Dashboard",
      budget: "$18,000",
      date: "3/11/2025",
      proposal: "I have experience building dashboards and can deliver a responsive social media dashboard.",
      bidAmount: "$17,000"
    }
  ];

  const notifications = [
    { text: "Your bid on 'Stock Market Tracking App' has been accepted! 🎉", type: "accepted" },
    { text: "You have a new project invitation: 'Mobile Fitness App'. 📩", type: "invitation" },
    { text: "Reminder: Update your profile to attract more clients.", type: "general" }
  ];

  const toggleExpand = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  const toggleMenu = () => setShowMenu(!showMenu);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      setTimeout(() => {
        setShowNotifications(false);
      }, 5000); // Auto-hide after 5 sec
    }
  };

  const handleLogout = () => {
    alert("Logging out...");
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleCancelBid = (title) => {
    const confirmCancel = window.confirm(`Are you sure you want to cancel your bid for "${title}"?`);
    if (confirmCancel) {
      alert(`Bid for "${title}" cancelled.`);
    }
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

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">HM</div>
        <nav className="sidebar-menu">
          <Link to="/freelancer-dashboard" className="menu-item">Dashboard</Link>
          <Link to="/freelancer-projects" className="menu-item">Projects</Link>
          <Link to="/freelancer-payments" className="menu-item">Payments</Link>
          <Link to="/freelancer-bids" className="menu-item active">Manage Bids</Link>
          <Link to="/freelancer-profile" className="menu-item">Profile</Link>
        </nav>
      </aside>

      {/* Main Section */}
      <main className="dashboard-main">
        {/* Top Navbar */}
        <header className="top-navbar">
          <h2 className="fade-in">Manage Bids</h2>

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

            {/* Profile */}
            <div className="profile-wrapper" ref={menuRef}>
              <span className="avatar" onClick={toggleMenu}>🧑‍💼</span>
              {showMenu && (
                <div className="dropdown-menu">
                  <button onClick={() => navigate("/freelancer-profile")}>My Profile</button>
                  <button onClick={handleLogout}>Log Out</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Bids Content */}
        <div className="bids-list">
          {bids.map((bid, index) => (
            <div className="bid-card" key={index}>
              <div className="bid-summary">
                <h3>{bid.projectTitle}</h3>
                <p>💰 <strong>Budget:</strong> {bid.budget}</p>
                <p>📅 <strong>Posted:</strong> {bid.date}</p>
                <button className="btn-read-more" onClick={() => toggleExpand(index)}>
                  {expandedIndex === index ? "Hide Details" : "Read More"}
                </button>
              </div>

              {expandedIndex === index && (
                <div className="bid-details">
                  <p><strong>My Proposal:</strong> {bid.proposal}</p>
                  <p><strong>Bid Amount:</strong> {bid.bidAmount}</p>
                  <button className="btn-cancel" onClick={() => handleCancelBid(bid.projectTitle)}>Cancel Bid</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
