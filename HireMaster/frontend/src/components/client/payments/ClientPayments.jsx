import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ClientPayments.css";

export default function ClientPayments() {
  const [payments, setPayments] = useState([]);

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
          freelancer_id {
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
      console.log("Fetched payments:", data?.data?.getClientPayments);
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

      console.log("Updated payment:", updated);
      console.log("Before state update:", payments);
      console.log("Received paymentId:", paymentId);


      if (!updated) return;

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
    } catch (error) {
      console.error("Payment update failed:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">HM</div>
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
          <button className="btn-download">⬇️ Download PDF Report</button>
        </header>

        <section className="payments-section">
          {/* <h3>View and manage your payments here!</h3> */}
          <table className="payments-table">
            <thead>
              <tr>
                <th>Invoice Number</th>
                <th>Freelancer</th>
                <th>Payment Date</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Pay</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr><td colSpan="6">No payments found.</td></tr>
              ) : (
                payments.map((payment, index) => {
                  if (!payment) return null;

                  const isPaid = payment.payment_status === "paid";
                  const paymentDate = payment.payment_date_completed
                    ? new Date(Number(payment.payment_date_completed)).toLocaleDateString()
                    : "-";


                  return (
                    <tr key={payment._id || index}>
                      <td>{payment.invoice_number}</td>
                      <td>
                        {payment.freelancer_id?.user_id?.first_name}{" "}
                        {payment.freelancer_id?.user_id?.last_name}
                      </td>
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
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
