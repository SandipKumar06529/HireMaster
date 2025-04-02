import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ClientProfile.css";

export default function ClientProfile() {
    const navigate = useNavigate();
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
                        <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="avatar" className="avatar" />
                        <div>
                            <h2>Alexa Rawles</h2>
                            <p>xyz@gmail.com</p>
                        </div>
                        <button className="edit-btn">Edit</button>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>First Name</label>
                            <input type="text" />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Company Name</label>
                            <input type="text" />
                        </div>
                        <div className="form-group">
                            <label>Company Domain</label>
                            <input type="text" />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="text" />
                        </div>
                        <div className="form-group">
                            <label>LinkedIn</label>
                            <input type="text" />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group full-width">
                            <label>About Company</label>
                            <textarea rows="4"></textarea>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" value="xyz@gmail.com" readOnly />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" />
                        </div>
                    </div>

                    <div className="profile-actions">
                        <button className="cancel-btn">Cancel</button>
                        <button className="save-btn">Save</button>
                    </div>
                </form>
            </main>
        </div>
    );
}
