import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ClientPayments.css";
import { assets } from "../../../assets/assets";
import RateFreelancerModal from "../Rating/RateFreelancerModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ClientPayments() {
  const [payments, setPayments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [toast, setToast] = useState("");
  const [selectedPayments, setSelectedPayments] = useState([]);

  const clientId = localStorage.getItem("clientId");

  const fetchPayments = async () => {
    const query = `
      query {
        getClientPayments(clientId: "${clientId}") {
          _id
          invoice_number
          amount
          payment_status
          payment_date_completed
          project_id
          freelancer_id {
            id
            user_id {
              first_name
              last_name
            }
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

      const data = await res.json();
      setPayments(data?.data?.getClientPayments || []);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    }
  };

  useEffect(() => {
    if (clientId) fetchPayments();
  }, [clientId]);

  const handleMarkAsPaid = async (paymentId) => {
    const mutation = `
      mutation {
        markPaymentAsPaid(paymentId: "${paymentId}") {
          _id
          payment_status
          payment_date_completed
        }
      }
    `;

    try {
      const res = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: mutation }),
      });

      const result = await res.json();
      const updated = result?.data?.markPaymentAsPaid;
      if (!updated) return;

      setPayments((prev) =>
        prev.map((p) =>
          p._id === updated._id
            ? { ...p, payment_status: updated.payment_status, payment_date_completed: updated.payment_date_completed }
            : p
        )
      );
    } catch (error) {
      console.error("Payment update failed:", error);
    }
  };

  const openRatingModal = (payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const handleSubmitReview = async (data) => {
    if (!selectedPayment || !data.rating || !data.review) {
      console.error("Missing required rating data.");
      return;
    }
  
    const mutation = `
      mutation SubmitRating($input: RatingInput!) {
        submitRating(input: $input) {
          id
          rating
          feedback
        }
      }
    `;
  
    const variables = {
      input: {
        project_id: selectedPayment.project_id,
        client_id: clientId,
        freelancer_id: selectedPayment.freelancer_id.id,
        rating: data.rating,
        feedback: data.review,
        skill_endorsement: [] // You can update this with actual values if needed
      }
    };
  
    try {
      const response = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: mutation, variables }),
      });
  
      const result = await response.json();
  
      if (result.errors) {
        console.error("GraphQL errors:", result.errors);
      } else {
        setToast(
          `Thanks! You rated ${selectedPayment.freelancer_id.user_id.first_name} with ${data.rating} ★`
        );
        setTimeout(() => setToast(""), 4000);
      }
    } catch (error) {
      console.error("Rating submission failed:", error);
    }
  };
  
  const handleCheckboxChange = (id) => {
    setSelectedPayments((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Client Payment Report", 14, 15);

    const filtered = payments.filter((p) => selectedPayments.includes(p._id));
    const tableData = filtered.map((p) => [
      p.invoice_number,
      `${p.freelancer_id?.user_id?.first_name || ""} ${p.freelancer_id?.user_id?.last_name || ""}`,
      p.payment_status.toUpperCase(),
      p.amount,
      p.payment_date_completed
        ? new Date(Number(p.payment_date_completed)).toLocaleDateString("en-US")
        : "-"
    ]);

    autoTable(doc, {
      head: [["Invoice #", "Freelancer", "Status", "Amount", "Date"]],
      body: tableData,
      startY: 25
    });

    doc.save("client_payments.pdf");
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="SignIn-logo">
          <img src={assets.Logo_3} alt="Logo" />
        </div>
        <nav className="sidebar-menu">
          <Link to="/dashboard" className="menu-item">Dashboard</Link>
          <Link to="/projects" className="menu-item">Projects</Link>
          <Link to="/payments" className="menu-item active">Payments</Link>
          <Link to="/profile" className="menu-item">Profile</Link>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h2>Payments</h2>
          <button className="btn-download" onClick={handleDownloadPDF}>
            ⬇️ Download PDF Report
          </button>
        </header>

        <section className="payments-section">
          <table className="payments-table">
            <thead>
              <tr>
                <th>PDF</th>
                <th>Invoice Number</th>
                <th>Freelancer</th>
                <th>Payment Date</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Pay</th>
                <th>Rate</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr><td colSpan="8">No payments found.</td></tr>
              ) : (
                payments.map((payment, index) => {
                  const isPaid = payment.payment_status === "paid";
                  const paymentDate = payment.payment_date_completed
                    ? new Date(Number(payment.payment_date_completed)).toLocaleDateString()
                    : "-";
                  const freelancerName = `${payment.freelancer_id?.user_id?.first_name || ""} ${payment.freelancer_id?.user_id?.last_name || ""}`;

                  return (
                    <tr key={payment._id || index}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedPayments.includes(payment._id)}
                          onChange={() => handleCheckboxChange(payment._id)}
                        />
                      </td>
                      <td>{payment.invoice_number}</td>
                      <td>{freelancerName}</td>
                      <td>{paymentDate}</td>
                      <td>
                        <span className={`status ${payment.payment_status}`}>
                          {payment.payment_status.toUpperCase()}
                        </span>
                      </td>
                      <td>${payment.amount}</td>
                      <td>
                        <button
                          className={`btn-pay ${isPaid ? "disabled" : ""}`}
                          disabled={isPaid}
                          onClick={() => handleMarkAsPaid(payment._id)}
                        >
                          {isPaid ? "Paid" : "Pay"}
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn-rate"
                          onClick={() => openRatingModal(payment)}
                        >
                          Rate
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </section>

        <footer className="footer-text">
          <span><img src={assets.Logo_3} alt="Logo" width='15px' /></span> © 2025 All Rights Reserved to HireMaster | Version 0.1
        </footer>

        {showModal && (
          <RateFreelancerModal
            freelancerName={selectedPayment?.freelancer_id?.user_id?.first_name}
            onClose={() => setShowModal(false)}
            onSubmit={handleSubmitReview}
          />
        )}
        {toast && <div className="toast">{toast}</div>}
      </main>
    </div>
  );
}
