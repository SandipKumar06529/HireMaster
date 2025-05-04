import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./FreelancerProjectDetails.css";
import BidModal from "../FreelancerMangeBids/BidModal";

export default function FreelancerProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [showBidModal, setShowBidModal] = useState(false);
  const [project, setProject] = useState(null);
  const [hasAlreadyBid, setHasAlreadyBid] = useState(false);

  const handleOpenBid = () => setShowBidModal(true);
  const handleCloseBid = () => setShowBidModal(false);

  const fetchProjectDetails = async () => {
    const query = `
      query {
        getProjectById(id: "${projectId}") {
          id
          title
          budget
          createdAt
          deadline
          description
          responsibilities
          requiredSkills
          preferredSkills
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
      if (json?.data?.getProjectById) {
        setProject(json.data.getProjectById);
      } else {
        alert("Failed to fetch project details");
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  const checkIfAlreadyBid = async () => {
    const freelancerId = localStorage.getItem("freelancerId");
    if (!freelancerId || !projectId) return;

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
      const bids = json?.data?.getBidsByFreelancerId || [];
      const alreadyBid = bids.some((bid) => bid.project_id.id === projectId);
      setHasAlreadyBid(alreadyBid);
    } catch (error) {
      console.error("Error checking bid status:", error);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
      checkIfAlreadyBid();
    }
  }, [projectId]);

  if (!project) return <div>Loading...</div>;

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
        <header className="projects-header">
          <h2>Projects</h2>
        </header>

        <h3 className="title">View, Bid and Manage Your Projects Here!</h3>

        <div className="project-detail-card">
          <h2 className="project-title">{project.title}</h2>
          <p className="project-meta">
            <span>💼 Budget : ${project.budget}</span>
            <span>📅 Posted : {project.createdAt ? new Date(Number(project.createdAt)).toLocaleDateString("en-US") : "N/A"}</span>
            <span>🕒 Deadline: {project.deadline ? new Date(Number(project.deadline)).toLocaleDateString("en-US") : "N/A"}</span>
          </p>
          <p className="project-description">{project.description}</p>

          {project.responsibilities && (
            <div className="project-section">
              <h4>Key Responsibilities:</h4>
              <p>{project.responsibilities}</p>
            </div>
          )}

          {project.requiredSkills && (
            <div className="project-section">
              <h4>Required Skills:</h4>
              <p>{project.requiredSkills}</p>
            </div>
          )}

          {project.preferredSkills && (
            <div className="project-section">
              <h4>Preferred Skills:</h4>
              <p>{project.preferredSkills}</p>
            </div>
          )}

          <div className="project-actions">
            {hasAlreadyBid ? (
              <button className="btn-disabled" disabled>You already bid</button>
            ) : (
              <button className="btn-bid" onClick={handleOpenBid}>Bid</button>
            )}
            <button className="btn-cancel" onClick={() => navigate("/freelancer-projects")}>Cancel</button>
          </div>
        </div>
      </main>

      {/* BidModal with budget & freelancerId passed */}
      {showBidModal && (
        <BidModal
          onClose={handleCloseBid}
          projectTitle={project.title}
          projectId={project.id}
          projectBudget={project.budget}
          freelancerId={localStorage.getItem("freelancerId")}
        />
      )}
    </div>
  );
}
