import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// TODO: Replace localStorage usage and simulated login with a backend API call for authentication.
// - In handleSubmit, send username and password to the backend (e.g., POST /api/users/login)
// - Use the backend response to determine login success and setup completion

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
      <h2 className="text-2xl font-bold text-secondary mb-4">Login</h2>
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

export default Login;