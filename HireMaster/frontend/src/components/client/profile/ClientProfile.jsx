import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ClientProfile.css";

export default function ClientProfile() {
  const navigate = useNavigate();
  const [clientData, setClientData] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setShowMenu(!showMenu);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const fetchClientData = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("No user session found.");
      navigate("/");
      return;
    }

    const query = `
      query {
        getClientByUserId(userId: "${userId}") {
          first_name
          last_name
          company_name
          company_domain
          linkedin
          about_company
          email
          phone_number
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
      console.log("Client data:", json);
      if (json?.data?.getClientByUserId) {
        setClientData(json.data.getClientByUserId);
      } else {
        alert("Unable to fetch profile data");
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
      alert("Error loading profile");
    }
  };

  useEffect(() => {
    fetchClientData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!clientData) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">HM</div>
        <nav className="sidebar-menu">
          <Link to="/dashboard" className="menu-item">Dashboard</Link>
          <Link to="/projects" className="menu-item">Projects</Link>
          <Link to="/payments" className="menu-item">Payments</Link>
          <Link to="/profile" className="menu-item active">Profile</Link>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="top-navbar">
          <h2>Profile</h2>
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

        <form className="profile-form">
          <div className="profile-info">
            <img
              src={clientData.profile_picture || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
              alt="avatar"
              className="avatar"
            />
            <div>
              <h2>{clientData?.first_name || "Client"} {clientData?.last_name || "Client"}</h2>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input type="text" value={clientData?.first_name || ""} readOnly />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" value={clientData?.last_name || ""} readOnly />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Company Name</label>
              <input type="text" value={clientData.company_name} readOnly />
            </div>
            <div className="form-group">
              <label>Company Domain</label>
              <input type="text" value={clientData.company_domain} readOnly />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" value={clientData.phone_number || ""} readOnly />
            </div>
            <div className="form-group">
              <label>LinkedIn</label>
              <input type="text" value={clientData.linkedin || ""} readOnly />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label>About Company</label>
              <textarea rows="4" value={clientData.about_company || ""} readOnly></textarea>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={clientData.email} readOnly />
            </div>
          </div>

          <div className="profile-actions">
            <button className="save-btn" onClick={() => navigate("/editProfile")}>Edit</button>
          </div>
        </form>
      </main>
    </div>
  );
}
