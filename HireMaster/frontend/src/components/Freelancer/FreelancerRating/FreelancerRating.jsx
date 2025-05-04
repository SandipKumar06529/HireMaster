import React from "react";
import "./FreelancerRating.css";

export default function FreelancerRating({ rating = 4.6, reviews = 28 }) {
  return (
    <div className="freelancer-rating">
      <div className="stars">
        {"★".repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? "☆" : "")}
      </div>
      <p>{rating} / 5.0 ({reviews} reviews)</p>
    </div>
  );
}
