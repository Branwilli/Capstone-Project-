import React from 'react';
import { Bar } from 'react-chartjs-2';

function NutrientChart({ data }) {
  const chartData = {
    labels: ['Sodium', 'Sugar', 'Fats', 'Protein'],
    datasets: [{
      label: 'Nutritional Values',
      data: [data.sodium, data.sugar, data.fats, data.protein],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
    }],
  };
  const options = { scales: { y: { beginAtZero: true } } };
  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <h5 className="card-title">Nutrient Chart</h5>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}

export default NutrientChart;