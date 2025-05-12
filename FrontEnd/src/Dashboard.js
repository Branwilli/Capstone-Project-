import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// TODO: Replace placeholder values and hardcoded stats with data fetched from the backend.
// - Fetch user profile (e.g., userName, health conditions, preferences, goals) from backend API
// - Fetch scan statistics, recent scans, and nutritional insights from backend API
// - Use useEffect to load data on component mount

function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('User');
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ scans: 0, healthy: 0, warnings: 0 });
  const [recentScans, setRecentScans] = useState([]);

  useEffect(() => {
    // Fetch user profile
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        if (!userId) return;
        const res = await fetch(`/api/users/profile?user_id=${userId}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setUserName(data.name || 'User');
        }
      } catch {}
    };
    // Fetch scan stats
    const fetchStats = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        if (!userId) return;
        const res = await fetch(`/api/scans/user/${userId}`);
        if (res.ok) {
          const scans = await res.json();
          setStats({
            scans: scans.length,
            healthy: scans.filter(s => s.health_score > 70).length,
            warnings: scans.filter(s => s.health_score < 40).length
          });
          setRecentScans(scans.slice(-3).reverse());
        }
      } catch {}
    };
    fetchProfile();
    fetchStats();
  }, []);

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
                <div className="text-3xl font-bold text-primary">{stats.scans}</div> 
                <div className="text-sm text-gray-600">Scans this month</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="bg-primary-100 rounded-lg p-4 text-center hover-shadow-md transition-all">
                <div className="text-3xl font-bold text-success">{stats.healthy}</div>
                <div className="text-sm text-gray-600">Healthy choices</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="bg-primary-100 rounded-lg p-4 text-center hover-shadow-md transition-all">
                <div className="text-3xl font-bold text-warning">{stats.warnings}</div>
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
                    {profile?.health_conditions?.map((condition, index) => (
                      <span key={index} className={`badge bg-${condition.color} text-white`}>{condition.name}</span>
                    ))}
                  </div>
                </div>
                <div className="col-md-4">
                  <h4 className="font-medium text-gray-700 mb-2">Dietary Preferences</h4>
                  <div className="d-flex flex-wrap gap-2">
                    {profile?.dietary_preferences?.map((preference, index) => (
                      <span key={index} className={`badge bg-${preference.color} text-white`}>{preference.name}</span>
                    ))}
                  </div>
                </div>
                <div className="col-md-4">
                  <h4 className="font-medium text-gray-700 mb-2">Nutritional Goals</h4>
                  <div className="space-y-2">
                    {profile?.nutritional_goals?.map((goal, index) => (
                      <div key={index} className="d-flex justify-content-between align-items-center">
                        <span className="text-sm">{goal.name}</span>
                        <div className="progress w-32">
                          <div className="progress-bar bg-primary" style={{ width: `${goal.progress}%` }}></div>
                        </div>
                      </div>
                    ))}
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
                {recentScans.map((scan, index) => (
                  <div key={index} className="d-flex align-items-center p-3 rounded-lg hover-bg-gray-50 transition-all">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg d-flex align-items-center justify-content-center mr-3">
                      <span className="material-symbols-outlined text-primary">{scan.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{scan.name}</h4>
                      <p className="text-sm text-gray-600">{scan.date}</p>
                    </div>
                    <span className={`badge bg-${scan.health_score > 70 ? 'success' : scan.health_score < 40 ? 'danger' : 'warning'} text-white`}>
                      {scan.health_score > 70 ? 'Healthy' : scan.health_score < 40 ? 'Warning' : 'Moderate'}
                    </span>
                  </div>
                ))}
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

export default Dashboard;