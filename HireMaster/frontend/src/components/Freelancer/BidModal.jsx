import React, { useState } from "react";
import "./BidModal.css";

export default function BidModal({ onClose }) {
  const [proposal, setProposal] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Proposal:", { proposal, amount });
    onClose(); // Close modal
  };

  

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <div className="modal-header">
          <h2>Stock Market Tracking App</h2>
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
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}
