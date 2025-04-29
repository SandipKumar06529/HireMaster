import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./FreelancerPayments.css";

export default function FreelancerPayments() {
  const payments = [
    { invoice: "5146846548465", client: "Jane Cooper", date: "2/19/21", status: "Paid", amount: 500 },
    { invoice: "5467319467348", client: "Wade Warren", date: "5/7/16", status: "Paid", amount: 500 },
    { invoice: "1345705945446", client: "Esther Howard", date: "9/18/16", status: "Unpaid", amount: 500 },
    { invoice: "5440754979", client: "Cameron Williamson", date: "2/11/12", status: "Paid", amount: 500 },
    { invoice: "1243467984543", client: "Brooklyn Simmons", date: "9/18/16", status: "Unpaid", amount: 500 },
    { invoice: "8454134649707", client: "Leslie Alexander", date: "1/28/17", status: "Unpaid", amount: 500 },
    { invoice: "2130164040451", client: "Jenny Wilson", date: "5/27/15", status: "Paid", amount: 500 },
    { invoice: "0439104645404", client: "Guy Hawkins", date: "8/2/19", status: "Paid", amount: 500 }
  ];

  // top navbar
  // log out logic
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
          <Link to="/freelancer-dashboard" className="menu-item">Dashboard</Link>
          <Link to="/freelancer-projects" className="menu-item">Projects</Link>
          <Link to="/freelancer-payments" className="menu-item active">Payments</Link>
          <Link to="/freelancer-bids" className="menu-item">Manage Bids</Link>
          <Link to="/freelancer-profile" className="menu-item">Profile</Link>
        </nav>
      </aside>

      <main className="dashboard-main">
        <div className="freelancer-payments-container">
          {/* <header className="payments-header">
            <h2>Payments</h2>
            <button className="btn-download">⬇️ Download PDF Report</button>
          </header> */}

          <header className="top-navbar">
            <h2>Payments</h2>
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

          <header className="payments-header">
            <h3 className="title" >View and manage your payments here!</h3>
            <button className="btn-download">⬇️ Download PDF Report</button>
          </header>

          <table className="payments-table">
            <thead>
              <tr>
                <th></th>
                <th>INVOICE NUMBER</th>
                <th>CLIENT</th>
                <th>PAYMENT DATE</th>
                <th>STATUS</th>
                <th>AMOUNT</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr key={index}>
                  <td><input type="checkbox" /></td>
                  <td>{payment.invoice}</td>
                  <td>{payment.client}</td>
                  <td>{payment.date}</td>
                  <td>
                    <span className={`status ${payment.status.toLowerCase()}`}>{payment.status}</span>
                  </td>
                  <td>${payment.amount.toFixed(2)}</td>
                  <td>
                    <button className={`btn-request ${payment.status === 'Paid' ? 'disabled' : ''}`} disabled={payment.status === 'Paid'}>
                      Request
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <footer className="footer-text">
            <span>HM</span> © 2025 All Rights Reserved to HireMaster | Version 0.1
          </footer>
        </div>
      </main>
    </div>
  );
}
