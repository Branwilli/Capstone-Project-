import React from 'react';
import { Link } from 'react-router-dom';

function Home({ isLoggedIn }) {
  return (
    <div className="container-fluid bg-white font-sans pt-16">
      <header className="bg-gradient-to-r from-primary to-primary-dark py-4 px-4 shadow-lg">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <svg
              className="w-10 h-10 text-white"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 6H3C2.44772 6 2 6.44772 2 7V17C2 17.5523 2.44772 18 3 18H21C21.5523 18 22 17.5523 22 17V7C22 6.44772 21.5523 6 21 6Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 10H15M9 14H15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 10H5.01M5 14H5.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h1 className="text-2xl font-bold text-white">NutriScan</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="position-relative py-5 px-4 overflow-hidden">
          <div className="row g-5 align-items-center">
            <div className="col-md-6">
              <h2 className="display-5 font-bold text-gray-800">
                Make Informed Food Choices <span className="text-primary">Instantly!</span>
              </h2>
              <p className="lead text-gray-600 mt-3">
                Scan food labels to get personalized insights on ingredients, nutritional values, and healthier alternatives. Take control of your diet with just a tap.
              </p>
              <div className="d-flex gap-3 mt-4">
                {isLoggedIn ? (
                  <Link to="/scan" className="btn btn-primary btn-lg shadow">Get Started Free</Link>
                ) : (
                  <Link to="/login" className="btn btn-primary btn-lg shadow">Get Started Free</Link>
                )}
                <Link to="/about" className="btn btn-outline-primary btn-lg">About</Link>
              </div>
              <div className="d-flex align-items-center gap-2 text-gray-600 mt-3">
                <span className="material-symbols-outlined">lock</span>
                <span className="text-sm">Your health data remains private and secure</span>
              </div>
            </div>
            <div className="col-md-6 position-relative">
              <div className="bg-primary-100 rounded-3 p-4 shadow-lg transform-rotate-2 hover-transform-rotate-0">
                <div className="bg-white rounded-2 p-4 shadow-sm">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="h5 font-semibold text-gray-800">Nutritional Analysis</h3>
                    <span className="badge bg-success text-white">Healthy Choice</span>
                  </div>
                  <div className="space-y-3">
                    <div className="border-bottom pb-2">
                      <div className="d-flex justify-content-between">
                        <span className="text-gray-700">Product Name:</span>
                        <span className="font-medium">Organic Fruit Granola</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-gray-700">Sugar Content:</span>
                        <div className="d-flex align-items-center">
                          <div className="progress w-28 h-2 mr-2">
                            <div className="progress-bar bg-warning" style={{ width: '25%' }}></div>
                          </div>
                          <span className="text-sm font-medium">Low</span>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-gray-700">Sodium:</span>
                        <div className="d-flex align-items-center">
                          <div className="progress w-28 h-2 mr-2">
                            <div className="progress-bar bg-success" style={{ width: '20%' }}></div>
                          </div>
                          <span className="text-sm font-medium">Very Low</span>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-gray-700">Saturated Fat:</span>
                        <div className="d-flex align-items-center">
                          <div className="progress w-28 h-2 mr-2">
                            <div className="progress-bar bg-success" style={{ width: '16%' }}></div>
                          </div>
                          <span className="text-sm font-medium">Very Low</span>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-gray-700">Fiber:</span>
                        <div className="d-flex align-items-center">
                          <div className="progress w-28 h-2 mr-2">
                            <div className="progress-bar bg-success" style={{ width: '80%' }}></div>
                          </div>
                          <span className="text-sm font-medium">High</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-primary-50 p-3 rounded-lg border border-primary-100">
                      <h4 className="font-medium text-primary mb-1">AI Recommendation:</h4>
                      <p className="text-sm text-gray-700">
                        This product is a good source of fiber and contains minimal additives. Suitable for most dietary needs, but monitor portion size as it contains some natural sugars.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-5 px-4 bg-gradient-to-b from-white to-primary-50">
          <div className="text-center mb-5">
            <h2 className="h3 font-bold text-gray-800">How It Works</h2>
            <p className="lead text-gray-600 mx-auto" style={{ maxWidth: '32rem' }}>
              Take control of your food choices with our easy-to-use platform that provides instant nutritional insights
            </p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="bg-white rounded-3 p-4 shadow hover-shadow-xl transform-hover-up">
                <div className="w-16 h-16 bg-primary-100 rounded-circle d-flex align-items-center justify-content-center mb-3 mx-auto">
                  <span className="material-symbols-outlined text-3xl text-primary">photo_camera</span>
                </div>
                <h3 className="h5 font-semibold text-center mb-2">Scan Food Label</h3>
                <p className="text-gray-600 text-center">
                  Simply take a photo of any food label with your smartphone camera or upload an existing image.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="bg-white rounded-3 p-4 shadow hover-shadow-xl transform-hover-up">
                <div className="w-16 h-16 bg-primary-100 rounded-circle d-flex align-items-center justify-content-center mb-3 mx-auto">
                  <span className="material-symbols-outlined text-3xl text-primary">analytics</span>
                </div>
                <h3 className="h5 font-semibold text-center mb-2">Get Instant Analysis</h3>
                <p className="text-gray-600 text-center">
                  Our AI analyzes ingredients and nutritional values, providing a clear breakdown with health insights.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="bg-white rounded-3 p-4 shadow hover-shadow-xl transform-hover-up">
                <div className="w-16 h-16 bg-primary-100 rounded-circle d-flex align-items-center justify-content-center mb-3 mx-auto">
                  <span className="material-symbols-outlined text-3xl text-primary">lightbulb</span>
                </div>
                <h3 className="h5 font-semibold text-center mb-2">Receive Recommendations</h3>
                <p className="text-gray-600 text-center">
                  Get personalized recommendations based on your health profile and dietary preferences.
                </p>
              </div>
            </div>
          </div>
        </section>

  
        <section className="py-5 px-4">
          <div className="row g-5 align-items-center">
            <div className="col-md-6">
              <h2 className="h3 font-bold text-gray-800 mb-4">Personalized Health Profiles</h2>
              <p className="lead text-gray-600 mb-4">
                Create your personal health profile to receive tailored nutritional guidance based on your specific needs and conditions.
              </p>
              <ul className="space-y-3">
                <li className="d-flex align-items-start">
                  <span className="material-symbols-outlined text-primary mt-1 me-2">check_circle</span>
                  <div>
                    <h4 className="font-semibold text-gray-800">Health Condition Tracking</h4>
                    <p className="text-gray-600">
                      Add specific health conditions to receive alerts about ingredients you should avoid.
                    </p>
                  </div>
                </li>
                <li className="d-flex align-items-start">
                  <span className="material-symbols-outlined text-primary mt-1 me-2">check_circle</span>
                  <div>
                    <h4 className="font-semibold text-gray-800">Dietary Preferences</h4>
                    <p className="text-gray-600">
                      Add specific health conditions to receive alerts about ingredients you should avoid.
                    </p>
                  </div>
                </li>
                <li className="d-flex align-items-start">
                  <span className="material-symbols-outlined text-primary mt-1 me-2">check_circle</span>
                  <div>
                    <h4 className="font-semibold text-gray-800">Nutritional Goals</h4>
                    <p className="text-gray-600">
                      Set personal nutritional goals and track your progress through your food choices.
                    </p>
                  </div>
                </li>
              </ul>
              <Link 
                to={isLoggedIn ? "/profile" : "/login"} 
                className="btn btn-primary btn-lg mt-4 shadow"
              >
                {isLoggedIn ? "View Profile" : "Create Your Profile"}
              </Link>
            </div>
            <div className="col-md-6 position-relative">
              <div className="bg-gray-100 rounded-3 p-4 shadow-lg">
                <div className="bg-white rounded-2 p-4 shadow-sm">
                  <h3 className="h5 font-semibold text-gray-800 mb-3">Your Health Profile</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="d-block text-sm font-medium text-gray-700 mb-1">Age</label>
                      <div className="border rounded-lg p-2 bg-gray-50">35</div>
                    </div>
                    <div>
                      <label className="d-block text-sm font-medium text-gray-700 mb-1">Health Conditions</label>
                      <div className="d-flex flex-wrap gap-2">
                        <span className="badge bg-danger text-white">Lactose Intolerance</span>
                        <span className="badge bg-warning text-dark">High Blood Pressure</span>
                        <span className="badge bg-primary text-white">Gluten Sensitivity</span>
                        <span className="badge bg-light text-dark d-flex align-items-center">
                          <span className="material-symbols-outlined text-sm me-1">add</span> Add More
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="d-block text-sm font-medium text-gray-700 mb-1">Dietary Preferences</label>
                      <div className="d-flex flex-wrap gap-2">
                        <span className="badge bg-success text-white">Low Sodium</span>
                        <span className="badge bg-info text-white">High Protein</span>
                      </div>
                    </div>
                    <div>
                      <label className="d-block text-sm font-medium text-gray-700 mb-1">Nutritional Goals</label>
                      <div className="space-y-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-sm">Reduce Sugar Intake</span>
                          <div className="progress w-32 h-2">
                            <div className="progress-bar bg-primary" style={{ width: '66%' }}></div>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-sm">Increase Fiber</span>
                          <div className="progress w-32 h-2">
                            <div className="progress-bar bg-primary" style={{ width: '33%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Link to="/profile" className="btn btn-primary w-100 mt-4">Update Profile</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;