import React, { useState } from "react";
import "./BidModal.css";

export default function BidModal({ onClose, projectTitle, projectId }) {
  const [proposal, setProposal] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const freelancerId = localStorage.getItem("freelancerId"); // 👈 (make sure you store freelancerId after login)

    if (!freelancerId) {
      alert("Session expired. Please login again.");
      return;
    }

    const mutation = `
      mutation {
        submitBid(bidInput: {
          project_id: "${projectId}",
          freelancer_id: "${freelancerId}",
          proposal: """${proposal}""",
          bid_amount: ${amount}
        }) {
          id
          proposal
          bid_amount
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
      console.log("Submitted Bid:", json);

      if (json.data?.submitBid) {
        alert("Bid placed successfully!");
        onClose(); // Close modal after success
      } else {
        alert("Failed to submit bid.");
      }
    } catch (error) {
      console.error("Bid submission error:", error);
      alert("An error occurred.");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <div className="modal-header">
          <h2>{projectTitle}</h2> {/* Dynamic project title here */}
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label>Proposal</label>
          <textarea
            value={proposal}
            onChange={(e) => setProposal(e.target.value)}
            required
          />

          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <div className="modal-actions">
            <button type="cancel" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}
