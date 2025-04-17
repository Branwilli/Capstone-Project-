import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import './styles.css';
import { Spinner } from 'react-bootstrap'; // Requires: npm install react-bootstrap bootstrap
import { Bar } from 'react-chartjs-2'; // Requires: npm install chart.js react-chartjs-2
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa'; // Requires: npm install react-icons

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

//Home Component
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

// UserSetup Component 
function UserSetup({ setIsLoggedIn, setIsSetupComplete }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [occupation, setOccupation] = useState('');
  const [healthConditions, setHealthConditions] = useState('');
  const [gender, setGender] = useState('');
  const [dailyRoutine, setDailyRoutine] = useState([]);
  const [goals, setGoals] = useState([]);
  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);
  const [quote, setQuote] = useState('');

  const routineOptions = ['Cook', 'Work', 'Socialize', 'Walk', 'Volunteer', 'Exercise', 'Meditate', 'Read', 'Travel'];
  const goalOptions = ['Prevention of illness', 'Social networking', 'Exercising discipline', 'Weight loss', 'Mental well-being', 'Improved fitness'];
  const likeDislikeOptions = ['Social networking', 'Healthy eating', 'Fast food', 'Outdoor activities', 'Indoor games'];

  const handleRoutineChange = (option) => {
    setDailyRoutine((prev) => prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]);
  };
  const handleGoalsChange = (option) => {
    setGoals((prev) => prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]);
  };
  const handleLikesChange = (option) => {
    setLikes((prev) => prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]);
  };
  const handleDislikesChange = (option) => {
    setDislikes((prev) => prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const profile = { name, age, occupation, healthConditions, gender, dailyRoutine, goals, likes, dislikes, quote };
    localStorage.setItem('profile', JSON.stringify(profile));
    localStorage.setItem('isSetupComplete', 'true');
    setIsSetupComplete(true);
    setIsLoggedIn(true);
    navigate('/dashboard');
  };

  return (
    <div className="user-setup pt-16 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-secondary mb-4">Set Up Your Profile</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="form-label" htmlFor="name">Name</label>
          <input className="form-control" id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="form-label" htmlFor="age">Age</label>
          <input className="form-control" id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="form-label" htmlFor="occupation">Occupation</label>
          <input className="form-control" id="occupation" type="text" value={occupation} onChange={(e) => setOccupation(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="form-label" htmlFor="healthConditions">Health Conditions</label>
          <input className="form-control" id="healthConditions" type="text" value={healthConditions} onChange={(e) => setHealthConditions(e.target.value)} placeholder="e.g., Diabetes, Hypertension" />
        </div>
        <div className="mb-4">
          <label className="form-label" htmlFor="gender">Gender</label>
          <select className="form-control" id="gender" value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="form-label">Daily Routine</label>
          <div className="d-flex flex-wrap gap-2">
            {routineOptions.map((option) => (
              <div key={option} className="form-check">
                <input type="checkbox" className="form-check-input" id={`routine-${option}`} checked={dailyRoutine.includes(option)} onChange={() => handleRoutineChange(option)} />
                <label className="form-check-label" htmlFor={`routine-${option}`}>{option}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="form-label">Goals & Aspirations</label>
          <div className="d-flex flex-wrap gap-2">
            {goalOptions.map((option) => (
              <div key={option} className="form-check">
                <input type="checkbox" className="form-check-input" id={`goal-${option}`} checked={goals.includes(option)} onChange={() => handleGoalsChange(option)} />
                <label className="form-check-label" htmlFor={`goal-${option}`}>{option}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="form-label">Likes</label>
          <div className="d-flex flex-wrap gap-2">
            {likeDislikeOptions.map((option) => (
              <div key={option} className="form-check">
                <input type="checkbox" className="form-check-input" id={`like-${option}`} checked={likes.includes(option)} onChange={() => handleLikesChange(option)} />
                <label className="form-check-label" htmlFor={`like-${option}`}>{option}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="form-label">Dislikes</label>
          <div className="d-flex flex-wrap gap-2">
            {likeDislikeOptions.map((option) => (
              <div key={option} className="form-check">
                <input type="checkbox" className="form-check-input" id={`dislike-${option}`} checked={dislikes.includes(option)} onChange={() => handleDislikesChange(option)} />
                <label className="form-check-label" htmlFor={`dislike-${option}`}>{option}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="form-label" htmlFor="quote">Your Quote</label>
          <textarea className="form-control" id="quote" rows="3" value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="Share a quote that inspires you..." />
        </div>
        <button type="submit" className="btn btn-custom w-100">Complete Setup</button>
      </form>
    </div>
  );
}

// Login Component 
function Login({ setIsLoggedIn, setIsSetupComplete }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const isSetupComplete = localStorage.getItem('isSetupComplete') === 'true';
    setIsLoggedIn(true);
    navigate(isSetupComplete ? '/dashboard' : '/user-setup');
  };

  return (
    <div className="login pt-16 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-secondary mb-4">Login or Sign Up</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="form-label" htmlFor="username">Username</label>
          <input className="form-control" id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="mb-6">
          <label className="form-label" htmlFor="password">Password</label>
          <input className="form-control" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-custom">Login</button>
      </form>
    </div>
  );
}

// Dashboard Component 
function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('User'); // Placeholder; fetch from profile db

  const handleScan = (type) => {
    navigate('/scan', { state: { uploadType: type } });
  };

  return (
    <div className="container-fluid bg-primary-50 min-vh-100 pt-16">
      <div className="container">
        <div className="bg-white rounded-xl shadow-lg p-5 mb-5">
          {/* User Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center gap-3">
              <div className="w-16 h-16 bg-primary-100 rounded-full d-flex align-items-center justify-content-center">
                <span className="material-symbols-outlined text-3xl text-primary">person</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Welcome back, {userName}!</h2>
              </div>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-primary d-flex align-items-center">
                <span className="material-symbols-outlined">settings</span>
              </button>
            </div>
          </div>

          {/* Stats <placeholders get from db>*/}
          <div className="row g-3 mb-5">
            <div className="col-md-3">
              <div className="bg-primary-100 rounded-lg p-4 text-center hover-shadow-md transition-all">
                <div className="text-3xl font-bold text-primary">12</div> 
                <div className="text-sm text-gray-600">Scans this month</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="bg-primary-100 rounded-lg p-4 text-center hover-shadow-md transition-all">
                <div className="text-3xl font-bold text-success">8</div>
                <div className="text-sm text-gray-600">Healthy choices</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="bg-primary-100 rounded-lg p-4 text-center hover-shadow-md transition-all">
                <div className="text-3xl font-bold text-warning">3</div>
                <div className="text-sm text-gray-600">Warnings received</div>
              </div>
            </div>
          </div>

          {/* Health Profile( get from user profile set up) */}
          <div className="mb-5">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Your Health Profile</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="row g-4">
                <div className="col-md-4">
                  <h4 className="font-medium text-gray-700 mb-2">Health Conditions</h4>
                  <div className="d-flex flex-wrap gap-2">
                    <span className="badge bg-danger text-white">Lactose Intolerance</span>
                    <span className="badge bg-warning text-dark">High Blood Pressure</span>
                    <span className="badge bg-primary text-white">Gluten Sensitivity</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <h4 className="font-medium text-gray-700 mb-2">Dietary Preferences</h4>
                  <div className="d-flex flex-wrap gap-2">
                    <span className="badge bg-success text-white">Low Sodium</span>
                    <span className="badge bg-info text-white">High Protein</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <h4 className="font-medium text-gray-700 mb-2">Nutritional Goals</h4>
                  <div className="space-y-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-sm">Reduce Sugar Intake</span>
                      <div className="progress w-32">
                        <div className="progress-bar bg-primary" style={{ width: '66%' }}></div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-sm">Increase Fiber</span>
                      <div className="progress w-32">
                        <div className="progress-bar bg-primary" style={{ width: '33%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-3 text-end">
                <Link to="/profile" className="text-primary hover-text-primary-dark font-medium d-flex align-items-center justify-content-end gap-1">
                  <span>Edit Profile</span>
                  <span className="material-symbols-outlined text-sm">edit</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Scan CTA */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Start Scanning</h3>
            <div className="bg-gradient-to-r rounded-xl p-5 text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="text-2xl font-bold mb-2">Scan a food label now</h4>
                  <p className="mb-4">
                    Get instant nutritional insights and personalized recommendations based on your health profile.
                  </p>
                  <div className="d-flex gap-3">
                    <button
                      onClick={() => handleScan('photo')}
                      className="btn btn-light font-medium shadow-md hover-shadow-lg transition-all d-flex align-items-center gap-2"
                    >
                      <span className="material-symbols-outlined">photo_camera</span>
                      Take Photo
                    </button>
                    <button
                      onClick={() => handleScan('upload')}
                      className="btn btn-primary-dark font-medium shadow-md hover-shadow-lg transition-all d-flex align-items-center gap-2"
                    >
                      <span className="material-symbols-outlined">upload</span>
                      Upload Image
                    </button>
                  </div>
                </div>
                <div className="d-none d-md-block">
                  <div className="w-48 h-48 bg-primary-light bg-opacity-25 rounded-full d-flex align-items-center justify-content-center">
                    <svg
                      className="w-32 h-32 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2.67 18.95L7.6 15.64C8.39 15.11 9.53 15.17 10.24 15.78L10.57 16.07C11.35 16.74 12.61 16.74 13.39 16.07L17.55 12.5C18.33 11.83 19.59 11.83 20.37 12.5L22 13.9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Scans and Insights */}
        <div className="row g-4 mb-5">
          <div className="col-md-6">
            <div className="bg-white rounded-xl shadow-lg p-5">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Recent Scans</h3>
                <Link to="/results" className="text-primary hover-text-primary-dark font-medium">View All</Link>
              </div>
              <div className="space-y-3">
                <div className="d-flex align-items-center p-3 rounded-lg hover-bg-gray-50 transition-all">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg d-flex align-items-center justify-content-center mr-3">
                    <span className="material-symbols-outlined text-primary">breakfast_dining</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Organic Fruit Granola</h4>
                    <p className="text-sm text-gray-600">2 days ago</p>
                  </div>
                  <span className="badge bg-success text-white">Healthy</span>
                </div>
                <div className="d-flex align-items-center p-3 rounded-lg hover-bg-gray-50 transition-all">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg d-flex align-items-center justify-content-center mr-3">
                    <span className="material-symbols-outlined text-primary">local_drink</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Vitamin Water</h4>
                    <p className="text-sm text-gray-600">5 days ago</p>
                  </div>
                  <span className="badge bg-warning text-dark">Moderate</span>
                </div>
                <div className="d-flex align-items-center p-3 rounded-lg hover-bg-gray-50 transition-all">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg d-flex align-items-center justify-content-center mr-3">
                    <span className="material-symbols-outlined text-primary">lunch_dining</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Chicken Sandwich</h4>
                    <p className="text-sm text-gray-600">1 week ago</p>
                  </div>
                  <span className="badge bg-danger text-white">Warning</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="bg-white rounded-xl shadow-lg p-5">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Nutritional Insights</h3>
                <div className="d-flex gap-2">
                  <button className="btn btn-primary btn-sm">Week</button>
                  <button className="btn btn-outline-secondary btn-sm">Month</button>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-sm font-medium">Sugar Intake</span>
                    <span className="text-sm text-gray-600">15g average/day</span>
                  </div>
                  <div className="progress">
                    <div className="progress-bar bg-warning" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-sm font-medium">Protein</span>
                    <span className="text-sm text-gray-600">65g average/day</span>
                  </div>
                  <div className="progress">
                    <div className="progress-bar bg-success" style={{ width: '80%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-sm font-medium">Fiber</span>
                    <span className="text-sm text-gray-600">12g average/day</span>
                  </div>
                  <div className="progress">
                    <div className="progress-bar bg-primary" style={{ width: '40%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-sm font-medium">Sodium</span>
                    <span className="text-sm text-gray-600">1800mg average/day</span>
                  </div>
                  <div className="progress">
                    <div className="progress-bar bg-danger" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-top">
                <h4 className="font-medium text-gray-800 mb-2">Recommendation</h4>
                <p className="text-sm text-gray-600">
                  Try to reduce sodium intake by 20% and increase fiber consumption to meet your health goals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ProfilePage Component 
function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = JSON.parse(localStorage.getItem('profile')) || {};
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('profile', JSON.stringify(profile));
      setIsEditing(false);
      setAlert('Profile updated successfully!');
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setAlert('Error updating profile.');
    }
  };

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="profile pt-16 container mx-auto px-4">
      <h2 className="text-2xl font-bold text-secondary mb-4">Your Health Profile</h2>
      {alert && <div className="alert alert-success">{alert}</div>}
      {isEditing ? (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-3">
            <label className="form-label" htmlFor="name">Name</label>
            <input
              className="form-control"
              id="name"
              value={profile?.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="age">Age</label>
            <input
              className="form-control"
              id="age"
              type="number"
              value={profile?.age || ''}
              onChange={(e) => handleChange('age', e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="occupation">Occupation</label>
            <input
              className="form-control"
              id="occupation"
              value={profile?.occupation || ''}
              onChange={(e) => handleChange('occupation', e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="healthConditions">Health Conditions</label>
            <textarea
              className="form-control"
              id="healthConditions"
              value={profile?.healthConditions || ''}
              onChange={(e) => handleChange('healthConditions', e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="gender">Gender</label>
            <select
              className="form-control"
              id="gender"
              value={profile?.gender || ''}
              onChange={(e) => handleChange('gender', e.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Daily Routine</label>
            <div className="d-flex flex-wrap gap-2">
              {['Cook', 'Work', 'Socialize', 'Walk', 'Volunteer', 'Exercise', 'Meditate', 'Read', 'Travel'].map((option) => (
                <div key={option} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`routine-${option}`}
                    checked={profile?.dailyRoutine?.includes(option) || false}
                    onChange={() =>
                      handleChange(
                        'dailyRoutine',
                        profile?.dailyRoutine?.includes(option)
                          ? profile.dailyRoutine.filter((item) => item !== option)
                          : [...(profile?.dailyRoutine || []), option]
                      )
                    }
                  />
                  <label className="form-check-label" htmlFor={`routine-${option}`}>{option}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Goals & Aspirations</label>
            <div className="d-flex flex-wrap gap-2">
              {['Prevention of illness', 'Social networking', 'Exercising discipline', 'Weight loss', 'Mental well-being', 'Improved fitness'].map((option) => (
                <div key={option} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`goal-${option}`}
                    checked={profile?.goals?.includes(option) || false}
                    onChange={() =>
                      handleChange(
                        'goals',
                        profile?.goals?.includes(option)
                          ? profile.goals.filter((item) => item !== option)
                          : [...(profile?.goals || []), option]
                      )
                    }
                  />
                  <label className="form-check-label" htmlFor={`goal-${option}`}>{option}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Likes</label>
            <div className="d-flex flex-wrap gap-2">
              {['Social networking', 'Healthy eating', 'Fast food', 'Outdoor activities', 'Indoor games'].map((option) => (
                <div key={option} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`like-${option}`}
                    checked={profile?.likes?.includes(option) || false}
                    onChange={() =>
                      handleChange(
                        'likes',
                        profile?.likes?.includes(option)
                          ? profile.likes.filter((item) => item !== option)
                          : [...(profile?.likes || []), option]
                      )
                    }
                  />
                  <label className="form-check-label" htmlFor={`like-${option}`}>{option}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Dislikes</label>
            <div className="d-flex flex-wrap gap-2">
              {['Social networking', 'Healthy eating', 'Fast food', 'Outdoor activities', 'Indoor games'].map((option) => (
                <div key={option} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`dislike-${option}`}
                    checked={profile?.dislikes?.includes(option) || false}
                    onChange={() =>
                      handleChange(
                        'dislikes',
                        profile?.dislikes?.includes(option)
                          ? profile.dislikes.filter((item) => item !== option)
                          : [...(profile?.dislikes || []), option]
                      )
                    }
                  />
                  <label className="form-check-label" htmlFor={`dislike-${option}`}>{option}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="quote">Your Quote</label>
            <textarea
              className="form-control"
              id="quote"
              value={profile?.quote || ''}
              onChange={(e) => handleChange('quote', e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">Save Profile</button>
          <button type="button" className="btn btn-secondary ms-2" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title">{profile?.name}</h5>
            <p className="card-text">Age: {profile?.age}</p>
            <p className="card-text">Occupation: {profile?.occupation}</p>
            <p className="card-text">Health Conditions: {profile?.healthConditions}</p>
            <p className="card-text">Gender: {profile?.gender}</p>
            <p className="card-text">Daily Routine: {profile?.dailyRoutine?.join(', ') || 'None'}</p>
            <p className="card-text">Goals & Aspirations: {profile?.goals?.join(', ') || 'None'}</p>
            <p className="card-text">Likes: {profile?.likes?.join(', ') || 'None'}</p>
            <p className="card-text">Dislikes: {profile?.dislikes?.join(', ') || 'None'}</p>
            <p className="card-text">Your Quote: {profile?.quote || 'None'}</p>
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ScanPage Component 
function ScanPage() {
  const [image, setImage] = useState(null);
  const [productName, setProductName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleTakePhoto = () => {
    alert('Camera functionality is not implemented in this demo.');
  };

  const handleScan = async () => {
    if (!image) return alert('Please upload an image.');
    if (!productName.trim()) return alert('Please enter a product name.');
    setIsUploading(true);
    try {
      const data = {
        scan_id: '123',
        productName,
        sodium: 200,
        sugar: 10,
        fats: 5,
        protein: 15,
        vitamins: ['A', 'C'],
        ingredients: ['Sugar', 'Salt', 'Red Dye 40'],
        nutriscores: 'B',
        chemicalRisk: 2,
        feedback: 'Moderate sodium; avoid if sensitive to Red Dye 40.'
      };
      setTimeout(() => {
        setIsUploading(false);
        navigate('/results', { state: data });
      }, 2000);
    } catch (error) {
      console.error('Error scanning:', error);
      setIsUploading(false);
    }
  };

  return (
    <div className="scan pt-16 container mx-auto px-4 text-center">
      <h2 className="text-2xl font-bold text-secondary mb-4">Scan Your Food</h2>
      <div className="card shadow-sm mx-auto" style={{ maxWidth: '500px' }}>
        <div className="card-body">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="form-control mb-3"
          />
          <button
            onClick={handleTakePhoto}
            className="btn btn-outline-secondary mb-3"
          >
            Take a Photo
          </button>
          {image && (
            <img
              src={image}
              alt="Preview"
              className="img-fluid mb-3"
              style={{ maxHeight: '300px' }}
            />
          )}
          <input
            type="text"
            placeholder="Enter product name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="form-control mb-3"
          />
          <button
            onClick={handleScan}
            className="btn btn-primary"
            disabled={isUploading}
          >
            {isUploading ? <Spinner animation="border" size="sm" /> : 'Submit Scan'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ResultsSection Component 
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

// ScoreCard Component 
function ScoreCard({ nutriscores, chemicalRisk }) {
  const scoreColor = nutriscores === 'A' ? '#4CAF50' : nutriscores === 'E' ? '#F44336' : '#FFC107';
  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body text-center">
        <h5 className="card-title">Health Scores</h5>
        <div className="d-flex justify-content-around">
          <div>
            <h3 style={{ color: scoreColor, fontWeight: 'bold' }}>{nutriscores}</h3>
            <p>Nutri-Score</p>
          </div>
          <div>
            <h3>{chemicalRisk}</h3>
            <p>Chemical Risk (1-5)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// NutrientChart Component 
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

// FeedbackSection Component 
function FeedbackSection({ feedback }) {
  const [rating, setRating] = useState(null);

  const handleRating = (rate) => {
    setRating(rate);
    alert(`Rated: ${rate}`);
  };

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <h5 className="card-title">Your Feedback</h5>
        <p className="card-text">{feedback}</p>
        <div className="d-flex justify-content-around mt-3">
          <button className="btn btn-outline-success btn-feedback" onClick={() => handleRating('up')} disabled={rating}>
            <FaThumbsUp /> Up
          </button>
          <button className="btn btn-outline-danger btn-feedback" onClick={() => handleRating('down')} disabled={rating}>
            <FaThumbsDown /> Down
          </button>
        </div>
      </div>
    </div>
  );
}

// Results Component 
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

// ContactUs Component 
function ContactUs() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent! (Demo)');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="contact-us pt-16 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-secondary mb-4">Contact Us</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="form-label" htmlFor="name">Name</label>
          <input className="form-control" id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="form-label" htmlFor="email">Email</label>
          <input className="form-control" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="mb-6">
          <label className="form-label" htmlFor="message">Message</label>
          <textarea className="form-control" id="message" rows="5" value={message} onChange={(e) => setMessage(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-custom">Send Message</button>
      </form>
    </div>
  );
}

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

// App Component
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(localStorage.getItem('isSetupComplete') === 'true');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  return (
    <Router>
      <nav className="navbar navbar-expand-md bg-white shadow-sm fixed-top">
        <div className="container-fluid px-4">
          <Link className="navbar-brand" to="/">NutriScan</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
              {isLoggedIn && (
                <>
                  <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/scan">Scan</Link></li>
                </>
              )}
              <li className="nav-item"><Link className="nav-link" to="/contact-us">Contact Us</Link></li>
            </ul>
            <ul className="navbar-nav">
              {isLoggedIn ? (
                <li className="nav-item dropdown">
                  <button className="profile-bubble btn" onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
                    <img src="https://via.placeholder.com/40" alt="User" className="rounded-circle" style={{ width: '40px' }} />
                  </button>
                  {showProfileDropdown && (
                    <ul className="dropdown-menu show" style={{ right: 0 }}>
                      <li><Link className="dropdown-item" to="/profile" onClick={() => setShowProfileDropdown(false)}>Profile</Link></li>
                      <li><a className="dropdown-item" href="#" onClick={() => { setIsLoggedIn(false); setIsSetupComplete(false); localStorage.clear(); }}>Logout</a></li>
                    </ul>
                  )}
                </li>
              ) : (
                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setIsSetupComplete={setIsSetupComplete} />} />
        <Route path="/user-setup" element={<UserSetup setIsLoggedIn={setIsLoggedIn} setIsSetupComplete={setIsSetupComplete} />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isLoggedIn ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/scan" element={isLoggedIn ? <ScanPage /> : <Navigate to="/login" />} />
        <Route path="/results" element={<Results />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/about" element={<About />} /> 
      </Routes>
    </Router>
  );
}

export default App;