import React, { useState } from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

// TODO: Replace alert and local state with a backend API call to submit user feedback/rating.
// - In handleRating, send the rating to the backend (e.g., POST /api/feedback or /api/rating)

function FeedbackSection({ feedback }) {
  const [rating, setRating] = useState(null);

  const handleRating = (rate) => {
    setRating(rate);
    alert(`Rated: ${rate}`);
  };

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <h5 className="card-title">Your Feedback</h5>
        <p className="card-text">{feedback}</p>
        <div className="d-flex justify-content-around mt-3">
          <button className="btn btn-outline-success btn-feedback" onClick={() => handleRating('up')} disabled={rating}>
            <FaThumbsUp /> Up
          </button>
          <button className="btn btn-outline-danger btn-feedback" onClick={() => handleRating('down')} disabled={rating}>
            <FaThumbsDown /> Down
          </button>
        </div>
      </div>
    </div>
  );
}

export default FeedbackSection;