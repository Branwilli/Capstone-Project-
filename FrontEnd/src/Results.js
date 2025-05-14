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
  const [resultData, setResultData] = useState(null);

  const data = location.state || {};

  useEffect(() => {
    const processProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/recommendations', {
          method: 'GET',
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
        setResultData(results);
      } catch (err) {
        setError(err.message);
        setResultData(null);
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
      {loading && <div>Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {resultData && (
        <div className="row">
          <div className="col-md-6">
            <ScoreCard nutriscores={resultData.score} chemicalRisk={resultData.chemicalRisk} />
            <NutrientChart data={resultData} /> 
            {resultData.image_url && (
              <img 
                src={resultData.image_url} 
                alt="Scanned product" 
                className="mt-4 rounded shadow-md max-w-full"
              />
            )}
          </div>
          <div className="col-md-6">
            <ResultsSection data={resultData} />
            <FeedbackSection feedback={resultData.feedback} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Results;