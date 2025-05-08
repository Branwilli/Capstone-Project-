import React from 'react';

//About Us Component
function About() {
  return (
    <div className="about pt-16 container mx-auto px-4">
      <h2 className="text-3xl font-bold text-secondary mb-4">About NutriScan</h2>
      <p className="text-gray-700 lead mb-4">
        NutriScan is your personal nutrition assistant, designed to help you make informed food choices. 
        By scanning food labels, you can instantly access detailed nutritional insights, ingredient analysis, 
        and personalized recommendations tailored to your health profile.
      </p>
      <p className="text-gray-700">
        Our mission is to empower individuals to take control of their diet and health by providing accurate 
        and actionable information. Whether you're managing a health condition, pursuing fitness goals, or 
        simply curious about what's in your food, NutriScan is here to guide you every step of the way.
      </p>
    </div>
  );
}

export default About;