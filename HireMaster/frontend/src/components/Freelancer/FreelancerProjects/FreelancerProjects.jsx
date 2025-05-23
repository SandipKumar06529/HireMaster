import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./FreelancerProjects.css";
import { assets } from "../../../assets/assets";

export default function FreelancerProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [bidProjectIds, setBidProjectIds] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const toggleMenu = () => setShowMenu(!showMenu);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const handleOpenDialog = (projectName) => {
    setSelectedProject(projectName);
    setIsDialogOpen(true);
  };

  const handleConfirmDeletion = () => {
    console.log(`Deleting: ${selectedProject}`);
    setIsDialogOpen(false);
    setSelectedProject(null);
  };

  const fetchProjects = async () => {
    const query = `
      query {
        getAllProjects {
          id
          title
          budget
          createdAt
          deadline
          description
        }
      }
    `;

    try {
      const res = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const json = await res.json();
      if (json?.data?.getAllProjects) {
        setProjects(json.data.getAllProjects);
      } else {
        console.error("Failed to fetch projects");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchFreelancerBids = async () => {
    const freelancerId = localStorage.getItem("freelancerId");
    if (!freelancerId) return;

    const query = `
      query {
        getBidsByFreelancerId(freelancerId: "${freelancerId}") {
          project_id {
            id
          }
        }
      }
    `;

    try {
      const res = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const json = await res.json();
      if (json?.data?.getBidsByFreelancerId) {
        const ids = json.data.getBidsByFreelancerId.map(bid => bid.project_id.id);
        setBidProjectIds(ids);
      }
    } catch (err) {
      console.error("Error fetching bids:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchFreelancerBids();

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
        <div className="SignIn-logo">
          <img src={assets.Logo_3} alt="Logo" />
        </div>
        <nav className="sidebar-menu">
          <Link to="/freelancer-dashboard" className="menu-item">Dashboard</Link>
          <Link to="/freelancer-projects" className="menu-item active">Projects</Link>
          <Link to="/freelancer-payments" className="menu-item">Payments</Link>
          <Link to="/freelancer-bids" className="menu-item">Manage Bids</Link>
          <Link to="/freelancer-profile" className="menu-item">Profile</Link>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="top-navbar">
          <h2>Projects</h2>
          <div className="header-actions">

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



        <div className="project-list">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div className="project-card" key={project.id}>
                <div className="project-title-wrapper">
                  <h2 className="project-title">{project.title}</h2>
                  {bidProjectIds.includes(project.id) && (
                    <span className="already-bid-label">✅ Already Bidded</span>
                  )}
                </div>
                <p className="project-meta">
                  <span>💰 Budget: ${project.budget}</span>
                  <span>
                    📅 Posted:{" "}
                    {project.createdAt
                      ? new Date(Number(project.createdAt)).toLocaleDateString("en-US")
                      : "N/A"}
                  </span>
                  <span>
                    🕒 Deadline:{" "}
                    {project.deadline
                      ? new Date(Number(project.deadline)).toLocaleDateString("en-US")
                      : "N/A"}
                  </span>
                </p>
                <p className="project-description">{project.description}</p>
                <div className="Freelnacer-project-buttons">
                  <button className="btn-read-more" onClick={() => navigate(`/freelancer-projects-details/${project.id}`)}>
                    Read More
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No projects found.</p>
          )}
        </div>

        <footer className="footer-text">
          <span><img src={assets.Logo_3} alt="Logo" width='15px' /></span> © 2025 All Rights Reserved to HireMaster | Version 0.1
        </footer>

        {isDialogOpen && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3>Do you want to delete this project?</h3>
              <p><strong>{selectedProject}</strong></p>
              <div className="modal-buttons">
                <button className="btn-cancel" onClick={() => setIsDialogOpen(false)}>Cancel</button>
                <button className="btn-confirm" onClick={handleConfirmDeletion}>Confirm</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
