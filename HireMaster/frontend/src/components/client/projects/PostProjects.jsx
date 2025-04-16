import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./PostProjects.css";

export default function PostProject() {
  const navigate = useNavigate();
  const clientId = localStorage.getItem("clientId");

  const [form, setForm] = useState({
    title: "",
    description: "",
    responsibilities: "",
    requiredSkills: "",
    preferredSkills: "",
    budget: "",
    deadline: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!clientId) {
      alert("Client not identified. Please log in again.");
      return;
    }

    const mutation = `
      mutation {
        createProject(projectInput: {
          client_id: "${clientId}",
          title: "${form.title}",
          description: """${form.description}""",
          responsibilities: """${form.responsibilities}""",
          requiredSkills: """${form.requiredSkills}""",
          preferredSkills: """${form.preferredSkills}""",
          budget: ${parseFloat(form.budget)},
          deadline: "${form.deadline}",
        }) {
          id
          title
        }
      }
    `;

    try {
      const res = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: mutation }),
      });

      const json = await res.json();
      console.log("GraphQL response:", json);

      if (json.data?.createProject) {
        alert("Project posted successfully!");
        navigate("/projects");
      } else {
        alert("Failed to post project.");
      }
    } catch (err) {
      console.error("Error submitting project:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">HM</div>
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
        </header>

        <section className="form-section">
          <h3>Post a Project</h3>
          <form onSubmit={handleSubmit} className="project-form">
            <label>
              Project Title:
              <input type="text" name="title" value={form.title} onChange={handleChange} required />
            </label>

            <label>
              Project Description:
              <textarea name="description" rows="3" value={form.description} onChange={handleChange} required />
            </label>

            <label>
              Key Responsibilities:
              <textarea name="responsibilities" rows="3" value={form.responsibilities} onChange={handleChange} required />
            </label>

            <label>
              Budget:
              <input type="number" name="budget" value={form.budget} onChange={handleChange} required />
            </label>

            <label>
              Required Skills:
              <textarea name="requiredSkills" rows="2" value={form.requiredSkills} onChange={handleChange} required />
            </label>

            <label>
              Preferred Skills:
              <textarea name="preferredSkills" rows="2" value={form.preferredSkills} onChange={handleChange} required />
            </label>

            <label>
              Bidding Deadline:
              <input type="date" name="deadline" value={form.deadline} onChange={handleChange} required />
            </label>

            <div className="form-buttons">
              <button type="submit" className="btn-submit">Submit</button>
              <button type="button" className="btn-cancel" onClick={() => navigate("/projects")}>Cancel</button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
