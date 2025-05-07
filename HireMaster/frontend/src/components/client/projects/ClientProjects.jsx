import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ClientProjects.css";
import { assets } from "../../../assets/assets";

export default function ClientProjects() {
  const navigate = useNavigate();
  const clientId = localStorage.getItem("clientId");

  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

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
    const fetchProjects = async () => {
      const query = `
        query {
          getProjectsByClientId(clientId: "${clientId}") {
            id
            title
            description
            responsibilities
            budget
            deadline
            createdAt
          }
        }
      `;

      const res = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const json = await res.json();
      if (json?.data?.getProjectsByClientId) {
        setProjects(json.data.getProjectsByClientId);
      }
    };

    if (clientId) fetchProjects();
  }, [clientId]);

  const handleDeleteClick = (projectId) => {
    setProjectToDelete(projectId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    const mutation = `
      mutation {
        deleteProject(projectId: "${projectToDelete}")
      }
    `;

    try {
      const res = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: mutation }),
      });

      const json = await res.json();
      if (json.data?.deleteProject) {
        setProjects(projects.filter((p) => p.id !== projectToDelete));
        alert("Project deleted successfully!");
      } else {
        alert("Failed to delete project.");
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Something went wrong.");
    }

    setShowModal(false);
    setProjectToDelete(null);
  };


  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="SignIn-logo">
          <img src={assets.Logo_3} alt="Logo" />
        </div>
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
          <div className="profile-wrapper" ref={menuRef}>
            <button className="btn-post" onClick={() => navigate("/projects/new")}>Post Project</button>
            <span className="avatar" onClick={toggleMenu}>🧑‍💼</span>
            {showMenu && (
              <div className="dropdown-menu">
                <button onClick={() => navigate("/profile")}>My Profile</button>
                <button onClick={handleLogout}>Log Out</button>
              </div>
            )}
          </div>

        </header>

        <section className="projects-lists">
          {/* <h3>View, post, and manage your Projects here!</h3> */}

          {projects.length === 0 ? (
            <p>No projects posted yet.</p>
          ) : (
            projects.map((project) => {
              console.log("createdAt:", project.createdAt);
              console.log("deadline:", project.deadline);

              return (
                <div className="project-card" key={project.id}>
                  <h4>{project.title}</h4>
                  <div className="project-meta">
                    <span>💰 Budget: ${project.budget}</span>
                    <span>
                      📅 Posted: {project.createdAt ? new Date(Number(project.createdAt)).toLocaleDateString("en-US") : "N/A"}
                    </span>
                    <span>
                      🕒 Deadline: {project.deadline ? new Date(Number(project.deadline)).toLocaleDateString("en-US") : "N/A"}
                    </span>
                  </div>
                  <p>{project.description}</p>
                  <div className="project-buttons">
                    <button className="btn-manage" onClick={() => navigate(`/projects/${project.id}`)}>Manage</button>
                    <button className="btn-delete-project" onClick={() => handleDeleteClick(project.id)}>Delete</button>
                  </div>
                </div>
              );
            })
          )}
        </section>

        <footer className="footer-text">
          <span><img src={assets.Logo_3} alt="Logo" width='15px' /></span> © 2025 All Rights Reserved to HireMaster | Version 0.1
        </footer>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3>Do you want to delete this project?</h3>
              <p><strong>{projects.find(p => p.id === projectToDelete)?.title || "Project"}</strong></p>
              <div className="modal-buttons">
                <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn-confirm" onClick={confirmDelete}>Confirm</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
