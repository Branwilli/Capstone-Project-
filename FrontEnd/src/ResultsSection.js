import React from 'react';

function ResultsSection({ data }) {
  const ignoreKeys = ["vitamins", "name", "brand", "product_id", "id"];
  const nutrientEntries = Object.entries(data).filter(
    ([key, value]) => !ignoreKeys.includes(key) && value !== undefined && value !== null && value !== ''
  );
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
            {nutrientEntries.map(([key, value]) => {
              let unit = '';
              if (key.toLowerCase().includes('sodium')) unit = 'mg';
              else if (["sugar", "fats", "protein", "cholesterol", "calcium", "iron", "potassium"].some(k => key.toLowerCase().includes(k))) unit = 'g';
              const label = key.charAt(0).toUpperCase() + key.slice(1);
              return (
                <tr key={key}>
                  <td>{label}</td>
                  <td>{value} {unit}</td>
                </tr>
              );
            })}
            {data.vitamins && typeof data.vitamins === 'object' && !Array.isArray(data.vitamins) && (
              Object.entries(data.vitamins).map(([vitamin, amount]) => (
                <tr key={"vitamin-" + vitamin}>
                  <td>{vitamin.charAt(0).toUpperCase() + vitamin.slice(1)}</td>
                  <td>{amount}</td>
                </tr>
              ))
            )}
            {data.vitamins && (Array.isArray(data.vitamins) || typeof data.vitamins === 'string') && (
              <tr>
                <td>Vitamins</td>
                <td>{Array.isArray(data.vitamins) ? data.vitamins.join(', ') : data.vitamins}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ResultsSection;