import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./ProjectBids.css";

export default function ProjectBids() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasAccepted, setHasAccepted] = useState(false);

  const fetchBids = async () => {
    const query = `
      query {
        getBidsByProjectId(projectId: "${projectId}") {
          id
          bid_amount
          proposal
          bid_status
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

      const json = await res.json();
      const fetchedBids = json?.data?.getBidsByProjectId || [];
      setBids(fetchedBids);

      // Determine if any bid is already accepted
      const accepted = fetchedBids.some(bid => bid.bid_status === "Accepted");
      setHasAccepted(accepted);
    } catch (err) {
      console.error("Error fetching bids:", err);
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
        alert("Bid accepted!");
        fetchBids();
      } else {
        alert("Failed to accept bid.");
      }
    } catch (err) {
      console.error("Error accepting bid:", err);
    }
  };

  const handleReject = async (bidId) => {
    const mutation = `
      mutation {
        cancelBid(bidId: "${bidId}")
      }
    `;

    try {
      const res = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: mutation }),
      });

      const json = await res.json();
      if (json?.data?.cancelBid) {
        alert("Bid rejected!");
        fetchBids();
      } else {
        alert("Failed to reject bid.");
      }
    } catch (err) {
      console.error("Error rejecting bid:", err);
    }
  };

  useEffect(() => {
    fetchBids();
  }, [projectId]);

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

        <section className="bids-section">
          {loading ? (
            <p>Loading bids...</p>
          ) : bids.length === 0 ? (
            <p>No bids yet for this project.</p>
          ) : (
            bids.map((bid) => {
              const firstName = bid.freelancer_id?.user_id?.first_name || "Unnamed";
              const lastName = bid.freelancer_id?.user_id?.last_name || "";

              return (
                <div className="bid-card" key={bid.id}>
                  <h4>{firstName} {lastName}</h4>
                  <div className="bid-meta">
                    <span className="amount">Bid: ${bid.bid_amount}</span>
                    <span className={`status ${bid.bid_status.toLowerCase()}`}>
                      {bid.bid_status}
                    </span>
                  </div>
                  <p className="proposal">{bid.proposal}</p>
                  {bid.bid_status === "Pending" && !hasAccepted && (
                    <div className="bid-actions">
                      <button
                        className="btn-accept"
                        onClick={() => handleAccept(bid.id)}
                      >
                        Accept
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() => handleReject(bid.id)}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}

          <button className="btn-back" onClick={() => navigate(`/projects/${projectId}`)}>Back to Project</button>
        </section>
      </main>
    </div>
  );
}
