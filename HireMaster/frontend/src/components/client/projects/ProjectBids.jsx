import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./ProjectBids.css";

export default function ProjectBids() {
  const navigate = useNavigate();
  const { projectId } = useParams(); // projectId from route
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBids = async () => {
    const query = `
      query {
        getBidsByProjectId(projectId: "${projectId}") {
          id
          proposal
          bid_amount
          bid_status
          freelancer_id {
            id
            first_name
            last_name
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

      const json = await res.json();
      if (json?.data?.getBidsByProjectId) {
        setBids(json.data.getBidsByProjectId);
      } else {
        console.error("Failed to fetch bids");
      }
    } catch (error) {
      console.error("Error fetching bids:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (bidId) => {
    const mutation = `
      mutation {
        acceptBid(bidId: "${bidId}", projectId: "${projectId}")
      }
    `;

    try {
      const res = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: mutation }),
      });

      const json = await res.json();
      if (json?.data?.acceptBid) {
        alert("Bid accepted successfully!");
        fetchBids(); // Refresh bids
      } else {
        alert("Failed to accept bid.");
      }
    } catch (err) {
      console.error("Error accepting bid:", err);
    }
  };

  const isAnyBidAccepted = bids.some(b => b.bid_status === "Accepted");

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">HM</div>
        <nav className="sidebar-menu">
          <Link to="/dashboard" className="menu-item">Dashboard</Link>
          <Link to="/projects" className="menu-item active">Projects</Link>
          <Link to="/payments" className="menu-item">Payments</Link>
          <Link to="/profile" className="menu-item">Profile</Link>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h2>Manage Bids</h2>
        </header>

        {loading ? (
          <p>Loading bids...</p>
        ) : (
          <section className="bids-section">
            {bids.length > 0 ? (
              bids.map((bid) => (
                <div className="bid-card" key={bid.id}>
                  <h4>{bid.freelancer_id.first_name} {bid.freelancer_id.last_name}</h4>
                  <div className="bid-meta">
                    <span className="amount">Bid: ${bid.bid_amount}</span>
                    <span className={`status ${bid.bid_status.toLowerCase()}`}>{bid.bid_status}</span>
                  </div>
                  <p className="proposal">{bid.proposal}</p>
                  <div className="bid-actions">
                    <button
                      className="btn-accept"
                      disabled={isAnyBidAccepted || bid.bid_status !== "Pending"}
                      onClick={() => handleAccept(bid.id)}
                    >
                      Accept
                    </button>
                    <button
                      className="btn-reject"
                      disabled={true} // Rejection handled automatically when another is accepted
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No bids found for this project.</p>
            )}

            <button className="btn-back" onClick={() => navigate("/projects/details")}>
              Back to Project
            </button>
          </section>
        )}
      </main>
    </div>
  );
}
