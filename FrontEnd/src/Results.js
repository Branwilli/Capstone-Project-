import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ScoreCard from './ScoreCard';
import NutrientChart from './NutrientChart';
import ResultsSection from './ResultsSection';
import FeedbackSection from './FeedbackSection';

function Results() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const data = location.state || {};

  useEffect(() => {
    const processProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/recommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            image: data.image,
            productInfo: data.productName
          })
        });

        if (!response.ok) {
          throw new Error('Product processing failed');
        }

        const results = await response.json();
        } catch (err) {
        setError(err.message);
        console.error('Processing error:', err);
      } finally {
        setLoading(false);
      } 
    };

    if (data.image) {
      processProduct();
    }
  }, [data]);

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