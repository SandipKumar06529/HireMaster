import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./ProjectDetails.css";
import { assets } from "../../../assets/assets";

export default function ProjectDetails() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      const query = `
        query {
          getProjectById(id: "${projectId}") {
            title
            description
            responsibilities
            requiredSkills
            preferredSkills
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
      if (json?.data?.getProjectById) {
        setProject(json.data.getProjectById);
      } else {
        alert("Failed to fetch project details");
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  if (!project) return <div>Loading...</div>;


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
          <h2>Projects Details</h2>
        </header>

        <section className="project-details-section">
          {/* <h3>View, Bid and manage your Projects here!</h3> */}

          <div className="project-full-card">
            <h4>{project.title}</h4>
            <div className="project-meta">
              <span>💰 Budget: ${project.budget}</span>
              <span>📅 Posted:  {new Date(project.createdAt).toLocaleDateString()}</span>
              <span>🕒 Deadline: {project.deadline ? new Date(project.deadline).toLocaleDateString() : "N/A"}</span>

            </div>
            <h5>Description:</h5>
            <p>
              {project.description}
            </p>

            <h5>Key Responsibilities:</h5>
            <ul>
              {project.responsibilities}
            </ul>

            <h5>Required Skills & Qualifications:</h5>
            <ul>
              {project.requiredSkills}
            </ul>

            <h5>Preferred Qualifications:</h5>
            <ul>
              {project.preferredSkills}
            </ul>

            {/* <h5>Why Join Us?</h5>
            <ul>
              <li id="list">Work on an exciting FinTech project.</li>
              <li id="list">Competitive salary and benefits.</li>
              <li id="list">Opportunity to work with cutting-edge technologies.</li>
              <li id="list">Flexible remote work options.</li>
            </ul> */}

            <div className="details-buttons">
              <button className="btn-bid" onClick={() => navigate(`/projects/${projectId}/bids`)} >Bids</button>
              <button className="btn-cancel" onClick={() => navigate("/projects")}>Cancel</button>
            </div>
          </div>
        </section>
        <footer className="footer-text">
          <span><img src={assets.Logo_3} alt="Logo" width='15px' /></span> © 2025 All Rights Reserved to HireMaster | Version 0.1
        </footer>
      </main>
    </div>
  );
}
