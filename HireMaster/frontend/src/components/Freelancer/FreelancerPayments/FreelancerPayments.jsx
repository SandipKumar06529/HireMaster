import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./FreelancerPayments.css";
import { assets } from "../../../assets/assets";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


export default function FreelancerPayments() {
  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const freelancerId = localStorage.getItem("freelancerId");

  const toggleMenu = () => setShowMenu(!showMenu);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedPayments, setSelectedPayments] = useState([]);

  const handleCheckboxChange = (paymentId) => {
    setSelectedPayments((prev) =>
      prev.includes(paymentId)
        ? prev.filter((id) => id !== paymentId)
        : [...prev, paymentId]
    );
  };


  const handleLogout = () => {
    localStorage.removeItem("token");
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

  useEffect(() => {
    const fetchPayments = async () => {
      const query = `
      query {
        getFreelancerPayments(freelancerId: "${freelancerId}") {
          _id
          invoice_number
          amount
          payment_status
          payment_date_completed
          client_id {
            user_id {
              first_name
              last_name
            }
          }
        }
      }
    `;


      const res = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const json = await res.json();
      setPayments(json?.data?.getFreelancerPayments || []);
      console.log("Fetched freelancer payments:", json?.data?.getFreelancerPayments);
    };

    if (freelancerId) fetchPayments();
  }, [freelancerId]);

  const handleMarkReceived = async (paymentId) => {
    const mutation = `
      mutation {
        markPaymentAsPaid(paymentId: "${paymentId}") {
          _id
          payment_status
          payment_date_completed
        }
      }
    `;

    const res = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: mutation }),
    });

    const result = await res.json();
    const updated = result?.data?.markPaymentAsPaid;

    if (updated) {
      setPayments((prev) =>
        prev.map((p) =>
          p._id === updated._id
            ? {
              ...p,
              payment_status: updated.payment_status,
              payment_date_completed: updated.payment_date_completed,
            }
            : p
        )
      );
    }
  };
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Freelancer Payment Report", 14, 15);

    const filtered = payments.filter((p) => selectedPayments.includes(p._id));

    const tableData = filtered.map((p) => [
      p.invoice_number,
      `${p.client_id?.user_id?.first_name || ""} ${p.client_id?.user_id?.last_name || ""}`,
      p.payment_status.toUpperCase(),
      p.amount,
      p.payment_date_completed
        ? new Date(Number(p.payment_date_completed)).toLocaleDateString("en-US")
        : "-"
    ]);

    doc.autoTable({
      head: [["Invoice #", "Client", "Status", "Amount", "Date"]],
      body: tableData,
      startY: 25
    });

    doc.save("freelancer_payments.pdf");
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="SignIn-logo">
          <img src={assets.Logo_3} alt="Logo" />
        </div>
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
          <header className="top-navbar">
            <h2>Payments</h2>
            <div className="header-actions">
              <button className="btn-download" onClick={handleDownloadPDF}>
                ⬇️ Download PDF Report
              </button>

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

          {/* <header className="payments-header">
            <h3 className="title">View and manage your payments here!</h3>
            <button className="btn-download">⬇ Download PDF Report</button>
          </header> */}

          <div className="table-payments">





            <table className="payments-table">
              <thead>
                <tr>
                  <th>PDF</th>
                  <th>INVOICE NUMBER</th>
                  <th>CLIENT</th>
                  <th>PAYMENT DATE</th>
                  <th>STATUS</th>
                  <th>AMOUNT</th>
                  <th>RECEIVED</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, index) => {
                  const isPaid = payment.payment_status === "paid";
                  const paymentDate = payment.payment_date_completed
                    ? new Date(Number(payment.payment_date_completed)).toLocaleDateString("en-US")
                    : "-";
                  const clientName = payment.client_id?.user_id
                    ? `${payment.client_id.user_id.first_name} ${payment.client_id.user_id.last_name}`
                    : "N/A";


                  return (
                    <tr key={payment._id || index}>
                      <td><input
                        type="checkbox"
                        checked={selectedPayments.includes(payment._id)}
                        onChange={() => handleCheckboxChange(payment._id)}
                      />
                      </td>
                      <td>{payment.invoice_number}</td>
                      <td>{clientName}</td>
                      <td>{paymentDate}</td>
                      <td>
                        <span className={`status ${payment.payment_status}`}>
                          {payment.payment_status.toUpperCase()}
                        </span>
                      </td>
                      <td>${payment.amount}</td>
                      <td>
                        <button
                          className={`btn-request ${isPaid ? "disabled" : ""}`}
                          disabled={isPaid}
                          onClick={() => handleMarkReceived(payment._id)}
                        >
                          Received
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <footer className="footer-text">
            <span><img src={assets.Logo_3} alt="Logo" width='15px' /></span> © 2025 All Rights Reserved to HireMaster | Version 0.1
          </footer>
        </div>
      </main>
    </div>
  );
}