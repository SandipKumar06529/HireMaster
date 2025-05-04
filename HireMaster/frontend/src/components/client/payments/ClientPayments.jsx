import React from "react";
import { Link } from "react-router-dom";
import "./ClientPayments.css";

export default function ClientPayments() {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">HM</div>
        <nav className="sidebar-menu">
          <Link to="/dashboard" className="menu-item ">Dashboard</Link>
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
                <th></th>
                <th>Invoice Number</th>
                <th>Freelancer</th>
                <th>Payment Date</th>
                <th>Status</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: "5146846548465", name: "Jane Cooper", date: "2/19/21", status: "Paid" },
                { id: "5467319467348", name: "Wade Warren", date: "5/7/16", status: "Paid" },
                { id: "1345705945446", name: "Esther Howard", date: "9/18/16", status: "Unpaid" },
                { id: "5440754979", name: "Cameron Williamson", date: "2/11/12", status: "Paid" },
                { id: "1243467984543", name: "Brooklyn Simmons", date: "9/18/16", status: "Unpaid" },
                { id: "8454134649707", name: "Leslie Alexander", date: "1/28/17", status: "Unpaid" },
                { id: "2130164040451", name: "Jenny Wilson", date: "5/27/15", status: "Paid" },
                { id: "0439104645404", name: "Guy Hawkins", date: "8/2/19", status: "Paid" },
              ].map((payment, index) => (
                <tr key={index}>
                  <td><input type="checkbox" /></td>
                  <td>{payment.id}</td>
                  <td>{payment.name}</td>
                  <td>{payment.date}</td>
                  <td>
                    <span className={`status ${payment.status.toLowerCase()}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td>$500.00</td>
                  <td>
                    <button
                      className={`btn-pay ${payment.status === "Paid" ? "disabled" : ""}`}
                      disabled={payment.status === "Paid"}
                    >
                      Pay
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
