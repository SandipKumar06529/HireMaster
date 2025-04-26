import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./FreelancerProfile.css";

export default function EditFreelancerProfile() {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const userId = localStorage.getItem("userId");

  const [showMenu, setShowMenu] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    university_name: "",
    degree: "",
    major_of_undergrad: "",
    major_of_grad: "",
    phone_number: "",
    skills: "",
    linkedin: "",
    github: "",
    experience_level: "",
    email: "",
    password: "",
    profile_picture: ""
  });

  const toggleMenu = () => setShowMenu(!showMenu);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
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
    const query = `
      query {
        getFreelancerByUserId(userId: "${userId}") {
          first_name
          last_name
          university_name
          degree
          major_of_undergrad
          major_of_grad
          phone_number
          skills
          linkedin
          github
          experience_level
          email
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
      console.log("GraphQL response:", json);
      
      if (json?.data?.getFreelancerByUserId) {
        setForm(prev => ({
          ...prev,
          ...json.data.getFreelancerByUserId,
          skills: (json.data.getFreelancerByUserId.skills || []).join(", ") // store skills as comma separated string
        }));
      }
    } catch (err) {
      console.error("Error fetching freelancer data:", err);
    }
  };

  useEffect(() => {
    fetchFreelancerData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default"); // your Cloudinary preset

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dm7nnnaf6/image/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
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
        updateFreelancerProfile(input: {
          user_id: "${userId}",
          first_name: "${form.first_name}",
          last_name: "${form.last_name}",
          password: "${form.password}",
          university_name: "${form.university_name}",
          degree: "${form.degree}",
          major_of_undergrad: "${form.major_of_undergrad}",
          major_of_grad: "${form.major_of_grad}",
          phone_number: "${form.phone_number}",
          skills: [${form.skills.split(",").map(skill => `"${skill.trim()}"`)}],
          linkedin: "${form.linkedin}",
          github: "${form.github}",
          experience_level: "${form.experience_level}",
          profile_picture: "${form.profile_picture}"
        }) {
          id
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
      if (json?.data?.updateFreelancerProfile) {
        alert("Profile updated successfully!");
        navigate("/freelancer-profile");
      } else {
        alert("Failed to update profile.");
      }
    } catch (err) {
      console.error("Error updating freelancer profile:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">HM</div>
        <nav className="sidebar-menu">
          <Link to="/freelancer-dashboard" className="menu-item">Dashboard</Link>
          <Link to="/freelancer-projects" className="menu-item">Projects</Link>
          <Link to="/freelancer-payments" className="menu-item">Payments</Link>
          <Link to="/freelancer-profile" className="menu-item active">Profile</Link>
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
                  <button onClick={() => navigate("/freelancer-profile")}>My Profile</button>
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
              <p>{form.email}</p>
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
              <label>University Name</label>
              <input type="text" name="university_name" value={form.university_name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Degree</label>
              <input type="text" name="degree" value={form.degree} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Major (Undergrad)</label>
              <input type="text" name="major_of_undergrad" value={form.major_of_undergrad} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Major (Grad)</label>
              <input type="text" name="major_of_grad" value={form.major_of_grad} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" name="phone_number" value={form.phone_number} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Skills (comma separated)</label>
              <input type="text" name="skills" value={form.skills} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>LinkedIn</label>
              <input type="text" name="linkedin" value={form.linkedin} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>GitHub</label>
              <input type="text" name="github" value={form.github} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Experience Level</label>
              <input type="text" name="experience_level" value={form.experience_level} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={form.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} />
            </div>
          </div>

          <div className="profile-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate("/freelancer-profile")}>Cancel</button>
            <button type="submit" className="save-btn">Save</button>
          </div>
        </form>
      </main>
    </div>
  );
}
