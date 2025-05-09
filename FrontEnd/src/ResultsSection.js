import React from 'react';

// TODO: The 'data' prop should be populated from the backend (e.g., after a scan or from a results API)
// Ensure the parent component fetches the nutritional and ingredient data from the backend and passes it here.

function ResultsSection({ data }) {
  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <h5 className="card-title">Nutritional Breakdown</h5>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nutrient</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Sodium</td><td>{data.sodium || 0} mg</td></tr>
            <tr><td>Sugar</td><td>{data.sugar || 0} g</td></tr>
            <tr><td>Fats</td><td>{data.fats || 0} g</td></tr>
            <tr><td>Protein</td><td>{data.protein || 0} g</td></tr>
            <tr><td>Vitamins</td><td>{data.vitamins ? data.vitamins.join(', ') : 'None'}</td></tr>
          </tbody>
        </table>
        <h5 className="card-title mt-3">Ingredients</h5>
        <ul className="list-group">
          {data.ingredients?.map((item, index) => (
            <li key={index} className="list-group-item">{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ResultsSection;