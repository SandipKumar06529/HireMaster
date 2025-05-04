import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./FreelancerManageBids.css";

export default function FreelancerManageBids() {
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [bids, setBids] = useState([]);
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const notificationRef = useRef(null);

    const toggleExpand = (index) => {
        setExpandedIndex(index === expandedIndex ? null : index);
    };

    const toggleMenu = () => setShowMenu(!showMenu);

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
        if (!showNotifications) {
            setTimeout(() => {
                setShowNotifications(false);
            }, 5000);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleCancelBid = async (bidId) => {
        const confirmCancel = window.confirm("Are you sure you want to cancel this bid?");
        if (!confirmCancel) return;

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
            if (json.data?.cancelBid) {
                alert("Bid cancelled successfully!");
                fetchBids();
            } else {
                alert("Failed to cancel bid.");
            }
        } catch (err) {
            console.error("Cancel bid error:", err);
            alert("Error cancelling bid.");
        }
    };

    const fetchBids = async () => {
        const freelancerId = localStorage.getItem("freelancerId");
        if (!freelancerId) {
            alert("No freelancer session found.");
            navigate("/");
            return;
        }

        const query = `
  query GetBids($freelancerId: ID!) {
    getBidsByFreelancerId(freelancerId: $freelancerId) {
      id
      proposal
      bid_amount
      bid_status
      submission_date
      project_id {
        title
        budget
        createdAt
      }
    }
  }
`;
        const variables = { freelancerId };
        try {
            const res = await fetch("http://localhost:4000/graphql", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query, variables }),
            });

            const json = await res.json();
            if (json.data?.getBidsByFreelancerId) {
                setBids(json.data.getBidsByFreelancerId.filter(bid => bid.bid_status === "Pending"));
            } else {
                console.error("GraphQL returned errors:", json.errors);
            }
        } catch (err) {
            console.error("Error fetching bids:", err);
        }
    };

    useEffect(() => {
        fetchBids();

        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(e.target)) {
                setShowNotifications(false);
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
                    <Link to="/freelancer-payments" className="menu-item">Payments</Link>
                    <Link to="/freelancer-bids" className="menu-item active">Manage Bids</Link>
                    <Link to="/freelancer-profile" className="menu-item">Profile</Link>
                </nav>
            </aside>

            <main className="dashboard-main">
                <header className="top-navbar">
                    <h2 className="fade-in">Manage Bids</h2>

                    <div className="header-actions">
                        <div className="notification-wrapper" ref={notificationRef}>
                            <span className="notification" onClick={toggleNotifications}>🔔<sup>3</sup></span>
                        </div>

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

                {bids.length === 0 ? (
                    <p>No active bids yet.</p>
                ) : (
                    <div className="bids-list">
                        {bids.map((bid, index) => (
                            <div className="bid-card" key={bid.id}>
                                <div className="bid-summary">
                                    <h3>{bid.project_id?.title}</h3>
                                    <p>💰 <strong>Budget:</strong> ${bid.project_id?.budget}</p>
                                    <p>
                                        📅 <strong>Posted:</strong>{" "}
                                        {bid.project_id?.createdAt
                                            ? new Date(Number(bid.project_id.createdAt)).toLocaleDateString("en-US")
                                            : "N/A"}
                                    </p>
                                    <button className="btn-read-more" onClick={() => toggleExpand(index)}>
                                        {expandedIndex === index ? "Hide Details" : "Read More"}
                                    </button>
                                </div>

                                {expandedIndex === index && (
                                    <div className="bid-details">
                                        <p><strong>My Proposal:</strong> {bid.proposal}</p>
                                        <p><strong>Bid Amount:</strong> ${bid.bid_amount}</p>
                                        <button className="btn-cancel" onClick={() => handleCancelBid(bid.id)}>Cancel Bid</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
