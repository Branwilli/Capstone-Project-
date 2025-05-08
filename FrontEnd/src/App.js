import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './styles.css';
import Home from './Home';
import UserSetup from './UserSetup';
import Login from './Login';
import Dashboard from './Dashboard';
import ProfilePage from './ProfilePage';
import ScanPage from './ScanPage';
import Results from './Results';
import ContactUs from './ContactUs';
import About from './About';
import Signup from './Signup';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


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
                <>
                  <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/signup">Sign Up</Link></li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setIsSetupComplete={setIsSetupComplete} />} />
        <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} setIsSetupComplete={setIsSetupComplete} />} />
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