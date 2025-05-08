import React from 'react';
import { useLocation } from 'react-router-dom';
import ScoreCard from './ScoreCard';
import NutrientChart from './NutrientChart';
import ResultsSection from './ResultsSection';
import FeedbackSection from './FeedbackSection';

function Results() {
  const location = useLocation();
  const data = location.state || {};

  return (
    <div className="results pt-16 container mx-auto px-4">
      <h2 className="text-2xl font-bold text-secondary mb-4">Results for {data.productName || 'Unknown Product'}</h2>
      <div className="row">
        <div className="col-md-6">
          <ScoreCard nutriscores={data.nutriscores} chemicalRisk={data.chemicalRisk} />
          <NutrientChart data={data} />
        </div>
        <div className="col-md-6">
          <ResultsSection data={data} />
          <FeedbackSection feedback={data.feedback} />
        </div>
      </div>
    </div>
  );
}

export default Results;