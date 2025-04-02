import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./FreelancerProjects.css";

export default function FreelancerProjects() {
  const projects = [
    {
      title: "Stock Market Tracking App",
      budget: "$11,000",
      date: "3/5/2025",
      description:
        "We are looking for a highly skilled Mobile App Developer to build a Stock Market Tracking App that provides real-time stock data, interactive charts, and investment insights. The ideal candidate should have experience in financial applications, API integration, and a strong understanding of UI/UX best practices for trading and financial apps."
    },
    {
      title: "Social Media Dashboard",
      budget: "$18,000",
      date: "3/11/2025",
      description:
        "We are seeking a talented Full Stack Developer to build a Social Media Dashboard that allows users to manage multiple social media accounts, schedule posts, track engagement metrics, and analyze performance from a single platform. The ideal candidate should have experience in API integrations, real-time data updates, and data visualization to create an intuitive and efficient dashboard."
    },
    {
      title: "Real Estate Listing Website",
      budget: "$8,000",
      date: "3/15/2025",
      description:
        "We are looking for a skilled Full Stack Developer and UI/UX Designer to develop a modern and feature-rich Real Estate Listing Website where users can search, list, and explore properties effortlessly. The ideal candidate should have experience in building responsive web applications, integrating property APIs, optimizing search functionality, and ensuring a seamless user experience."
    }
  ];
 

  // top navbar
    // log out logic
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
          <Link to="/freelancer-dashboard" className="menu-item">Dashboard</Link>
          <Link to="/freelancer-projects" className="menu-item active">Projects</Link>
          <Link to="/freelancer-payments" className="menu-item">Payments</Link>
          <Link to="/freelancer-profile" className="menu-item">Profile</Link>
        </nav>
      </aside>

      <main className="dashboard-main">
        {/* <header className="projects-header">
          <h2>Projects</h2>
        </header> */}
        <header className="top-navbar">
          <h2>Projects</h2>
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


        <h3 className="title">View, Bid and manage your Projects here!</h3>

        <div className="project-list">
          {projects.map((project, index) => (
            <div className="project-card" key={index}>
              <h2 className="project-title">{project.title}</h2>
              <p className="project-meta">
                <span>💼 Budget : {project.budget}</span>
                <span>📅 Posted : {project.date}</span>
              </p>
              <p className="project-description">{project.description}</p>
              <button className="btn-read-more" onClick={()=> navigate("/freelancer-projects-details")}>Read more</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
