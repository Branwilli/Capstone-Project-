import React from 'react';

// Make sure these values are fetched from the backend (e.g., after a scan or from a results API)
// and passed down to ScoreCard when rendering.

function ScoreCard({ nutriscores, chemicalRisk }) {
  // Use fallback values if props are missing
  const score = nutriscores || '-';
  const risk = chemicalRisk !== undefined && chemicalRisk !== null ? chemicalRisk : '-';
  const scoreColor = score === 'A' ? '#4CAF50' : score === 'E' ? '#F44336' : '#FFC107';
  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body text-center">
        <h5 className="card-title">Health Scores</h5>
        <div className="d-flex justify-content-around">
          <div>
            <h3 style={{ color: scoreColor, fontWeight: 'bold' }}>{score}</h3>
            <p>Nutri-Score</p>
          </div>
          <div>
            <h3>{risk}</h3>
            <p>Chemical Risk (1-5)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScoreCard;