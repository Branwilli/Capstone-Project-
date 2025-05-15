import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Chart
} from 'chart.js';


Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function NutrientChart({ data }) {
  const ignoreKeys = ["vitamins", "name", "brand", "product_id", "id"];
  const nutrientEntries = Object.entries(data).filter(
    ([key, value]) => !ignoreKeys.includes(key) && typeof value === 'number' && !isNaN(value)
  );
  const chartData = {
    labels: nutrientEntries.map(([key]) => key.charAt(0).toUpperCase() + key.slice(1)),
    datasets: [{
      label: 'Nutritional Values',
      data: nutrientEntries.map(([, value]) => value),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#8BC34A', '#00BCD4', '#E91E63', '#607D8B'
      ].slice(0, nutrientEntries.length),
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