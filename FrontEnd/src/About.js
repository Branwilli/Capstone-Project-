import React from 'react';

// About Us Component
function About() {
  const features = [
    {
      title: 'Instant Food Label Scanning',
      description: 'Scan food labels to access detailed nutritional insights and ingredient analysis in seconds.'
    },
    {
      title: 'Personalized Recommendations',
      description: 'Get suggestions tailored to your health profile, goals, and dietary preferences.'
    },
    {
      title: 'Empowering Your Health',
      description: 'Take control of your diet and well-being with actionable, science-backed information.'
    }
  ];

  return (
    <div className="about pt-16 container mx-auto px-4 max-w-3xl">
      <h2 className="text-3xl font-bold text-secondary mb-4 text-center">About NutriScan</h2>
      <p className="text-gray-700 lead mb-6 text-center">
        NutriScan is your personal nutrition assistant, designed to help you make informed food choices. By scanning food labels, you can instantly access detailed nutritional insights, ingredient analysis, and personalized recommendations tailored to your health profile.
      </p>
      <div className="row g-4 mb-5">
        {features.map((feature, idx) => (
          <div className="col-md-4" key={idx}>
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center">
                <h4 className="card-title text-primary mb-2">{feature.title}</h4>
                <p className="card-text text-gray-700">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-primary-50 rounded-lg p-4 shadow-sm text-center">
        <h3 className="text-xl font-bold text-primary mb-2">Our Mission</h3>
        <p className="text-gray-700 mb-0">
          Empower individuals to take control of their diet and health by providing accurate and actionable information. Whether you're managing a health condition, pursuing fitness goals, or simply curious about what's in your food, NutriScan is here to guide you every step of the way.
        </p>
      </div>
    </div>
  );
}

export default About;