import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./FreelancerProfile.css";
import FreelancerRating from "../FreelancerRating/FreelancerRating"; // adjust path if needed
import { assets } from "../../../assets/assets"; // adjust path if needed

export default function FreelancerProfile() {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);
  const [freelancerData, setFreelancerData] = useState(null);

  const toggleMenu = () => setShowMenu(!showMenu);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
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

  const fetchFreelancerData = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("No user session found.");
      navigate("/");
      return;
    }

    const query = `
      query {
        getFreelancerByUserId(userId: "${userId}") {
          first_name
          last_name
          university_name
          degree
          major_of_undergrad
          major_of_grad
          skills
          resume
          email
          phone_number
          linkedin
          github
          experience_level
          profile_picture
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
      if (json?.data?.getFreelancerByUserId) {
        setFreelancerData(json.data.getFreelancerByUserId);
      } else {
        alert("Unable to fetch profile data");
      }
    } catch (error) {
      console.error("Freelancer profile fetch error:", error);
      alert("Error loading profile");
    }
  };

  useEffect(() => {
    fetchFreelancerData();
  }, []);

  if (!freelancerData) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">HM</div>
        <nav className="sidebar-menu">
          <Link to="/freelancer-dashboard" className="menu-item">Dashboard</Link>
          <Link to="/freelancer-projects" className="menu-item">Projects</Link>
          <Link to="/freelancer-payments" className="menu-item">Payments</Link>
          <Link to="/freelancer-bids" className="menu-item">Manage Bids</Link>
          <Link to="/freelancer-profile" className="menu-item active">Profile</Link>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="top-navbar">
          <h2>Profile</h2>
          <div className="header-actions">
            {/* <span className="notification">🔔<sup>2</sup></span> */}
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

        <header className="profile-header">
          <div className="profile-info">
            <img
              src={freelancerData.profile_picture || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
              alt="avatar"
              className="avatar"
            />
            <div>
              <h2>{freelancerData.first_name} {freelancerData.last_name}</h2>
              <p>{freelancerData.email}</p>
              {/* 👇 Freelancer Rating Component */}
              <FreelancerRating rating={4.7} reviews={28} />
            </div>
          </div>
          <button className="edit-btn" onClick={() => navigate("/freelancer-edit-Profile")}>Edit</button>
        </header>

        <form className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input type="text" value={freelancerData.first_name} readOnly />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" value={freelancerData.last_name} readOnly />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>University Name</label>
              <input type="text" value={freelancerData.university_name || ""} readOnly />
            </div>
            <div className="form-group">
              <label>Degree</label>
              <input type="text" value={freelancerData.degree || ""} readOnly />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Major (Grad)</label>
              <input type="text" value={freelancerData.major_of_grad || ""} readOnly />
            </div>
            <div className="form-group">
              <label>Major (Undergrad)</label>
              <input type="text" value={freelancerData.major_of_undergrad || ""} readOnly />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" value={freelancerData.phone_number || ""} readOnly />
            </div>
            <div className="form-group">
              <label>Skills</label>
              <input type="text" value={(freelancerData.skills || []).join(", ")} readOnly />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={freelancerData.email} readOnly />
            </div>
            <div className="form-group">
              <label>LinkedIn</label>
              <input type="text" value={freelancerData.linkedin || ""} readOnly />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Experience Level</label>
              <input type="text" value={freelancerData.experience_level || ""} readOnly />
            </div>
            <div className="form-group">
              <label>GitHub</label>
              <input type="text" value={freelancerData.github || ""} readOnly />
            </div>
          </div>
        </form>
        <footer className="footer-text">
          <span><img src={assets.Logo_3} alt="Logo" width='15px'/></span> © 2025 All Rights Reserved to HireMaster | Version 0.1
        </footer>
      </main>
    </div>
  );
}
