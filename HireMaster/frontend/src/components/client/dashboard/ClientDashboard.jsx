import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ClientDashboard.css";
import { assets } from "../../../assets/assets";


export default function ClientDashboard() {

  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setShowMenu(!showMenu);
  const handleLogout = () => {
    alert("Logging out...");
    localStorage.removeItem('token');  // Clear token
    navigate('/');               // Redirect
    // logout logic
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
              <h1>Welcome To Hire Master</h1>
              <h2>John Doe</h2>
            </div>
            <img src={assets.dashboard_image} alt="illustration" className="foreground-img" />
          </div>
        </section>

        <section className="stats-section">
          <div className="stat-card">
            <h3>Project Posts</h3>
            <p className="stat-number">2,456</p>
            <p className="stat-positive">+2.5%</p>
          </div>
          <div className="stat-card">
            <h3>Total Bids Received</h3>
            <p className="stat-number">4,561</p>
            <p className="stat-negative">-4.4%</p>
          </div>
          <div className="stat-card">
            <h3>No of Active Projects</h3>
            <p className="stat-number">125</p>
            <p className="stat-positive">+1.5%</p>
          </div>
          <div className="stat-card">
            <h3>No of Payments</h3>
            <p className="stat-number">2,456</p>
            <p className="stat-positive">+4.5%</p>
          </div>
        </section>

        <section className="posts-section">
          <div className="posts-header">
            <h3>Recent Posts</h3>
            {/* <div className="filters">
              <button>Monthly</button>
              <button>Weekly</button>
              <button className="active">Today</button>
            </div> */}
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
              <tr>
                <td>UI UX Designer</td>
                <td>Alice Johnson</td>
                <td>$3,500</td>
                <td><span className="status active">Active</span></td>
              </tr>
              <tr>
                <td>Full Stack Dev</td>
                <td>Brian Lee</td>
                <td>$4,000</td>
                <td><span className="status inactive">Inactive</span></td>
              </tr>
              <tr>
                <td>DevOps</td>
                <td>Catherine Singh</td>
                <td>$3,800</td>
                <td><span className="status active">Active</span></td>
              </tr>
              <tr>
                <td>Android Dev</td>
                <td>Elias Carter</td>
                <td>$4,500</td>
                <td><span className="status active">Active</span></td>
              </tr>
              <tr>
                <td>IOS Developer</td>
                <td>Rowan Preston</td>
                <td>$4,000</td>
                <td><span className="status inactive">Inactive</span></td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
} 
