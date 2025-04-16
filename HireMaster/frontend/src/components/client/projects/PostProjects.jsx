import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./PostProjects.css";

export default function PostProject() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    skills: "",
    deadline: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Project Submitted:", form);
    navigate("/projects");
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
              <textarea name="description" rows="5" value={form.description} onChange={handleChange}  required />
            </label>

            <label>
              Key responsibilities:
              <textarea name="description" rows="5" value={form.description} onChange={handleChange}  required />
            </label>

            <label>
              Budget:
              <input type="text" name="budget" value={form.budget} onChange={handleChange} required />
            </label>

            <label>
              Required Skills:
              <textarea type="text" name="skills" value={form.skills} onChange={handleChange} required />
            </label>

            <label>
              Prefered Skills:
              <textarea type="text" name="skills" value={form.skills} onChange={handleChange} required />
            </label>

            <label>
              Bidding Deadline:
              <input type="date" name="deadline" value={form.deadline} onChange={handleChange} required />
            </label>

            <div className="form-buttons">
              <button type="submit" className="btn-submit" onClick={() => navigate("/projects")}>Submit</button>
              <button type="button" className="btn-cancel" onClick={() => navigate("/projects")}>Cancel</button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
