import React, { useState } from "react";
import "./RateFreelancerModal.css";

export default function RateFreelancerModal({ onClose, onSubmit, freelancerName }) {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");

    const handleStarClick = (value) => setRating(value);

    const handleSubmit = () => {
        if (rating === 0) return alert("Please select a rating.");
        onSubmit({ rating, review });
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-close">
                    <button className="icon-close" onClick={onClose}>✖</button> {/* New close button */}

                </div>

                <h3> Rate & Review </h3>
                <p> How would you rate the {freelancerName} ? </p>
                <div className="stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={star <= rating ? "star filled" : "star"}
                            onClick={() => handleStarClick(star)}
                        >
                            ★
                        </span>
                    ))}
                </div>
                <textarea
                    placeholder="Write your review (optional)..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                />
                <div className="modal-actions">
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="submit-btn" onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </div>
    );
}
