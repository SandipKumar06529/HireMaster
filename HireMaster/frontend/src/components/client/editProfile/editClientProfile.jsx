import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./editClientProfile.css";

export default function EditClientProfile() {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const userId = localStorage.getItem("userId");

  const [showMenu, setShowMenu] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    company_name: "",
    company_domain: "",
    phone_number: "",
    linkedin: "",
    about_company: "",
    profile_picture: "",
    email: "",
    password: ""
  });

  const toggleMenu = () => setShowMenu(!showMenu);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const fetchClientData = async () => {
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
      if (json?.data?.getClientByUserId) {
        setForm(prev => ({
          ...prev,
          ...json.data.getClientByUserId
        }));
      }
    } catch (err) {
      console.error("Error fetching client data:", err);
    }
  };

  useEffect(() => {
    fetchClientData();

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dm7nnnaf6/image/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log("Upload success:", data);
      setForm(prev => ({ ...prev, profile_picture: data.secure_url }));
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Failed to upload image.");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const mutation = `
      mutation {
        updateClientProfile(input: {
          user_id: "${userId}",
          first_name: "${form.first_name}",
          last_name: "${form.last_name}",
          password: "${form.password}",
          company_name: "${form.company_name}",
          company_domain: "${form.company_domain}",
          phone_number: "${form.phone_number}",
          linkedin: "${form.linkedin}",
          about_company: """${form.about_company}""",
          profile_picture: "${form.profile_picture}"
        }) {
          id
          company_name
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

      if (json?.data?.updateClientProfile) {
        alert("Profile updated successfully!");
        navigate("/profile");
      } else {
        alert("Failed to update profile.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Something went wrong.");
    }
  };

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

        <form className="profile-form" onSubmit={handleSave}>
          <div className="profile-info">
            <img
              src={form.profile_picture || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
              alt="avatar"
              className="avatar"
            />
            <div>
              <h2>{form.first_name} {form.last_name}</h2>
            </div>
          </div>

          <div className="form-group full-width">
            <label>Upload New Profile Picture</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {form.profile_picture && (
              <img
                src={form.profile_picture}
                alt="Preview"
                style={{ width: "100px", marginTop: "10px", borderRadius: "50%" }}
              />
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input type="text" name="first_name" value={form.first_name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" name="last_name" value={form.last_name} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Company Name</label>
              <input type="text" name="company_name" value={form.company_name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Company Domain</label>
              <input type="text" name="company_domain" value={form.company_domain} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" name="phone_number" value={form.phone_number} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>LinkedIn</label>
              <input type="text" name="linkedin" value={form.linkedin} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label>About Company</label>
              <textarea rows="4" name="about_company" value={form.about_company} onChange={handleChange}></textarea>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={form.email} readOnly />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} />
            </div>
          </div>

          <div className="profile-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate("/profile")}>Cancel</button>
            <button type="submit" className="save-btn">Save</button>
          </div>
        </form>
      </main>
    </div>
  );
}
