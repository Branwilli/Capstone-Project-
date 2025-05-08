import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup({ setIsLoggedIn, setIsSetupComplete }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    // Simulate registration logic
    localStorage.setItem('isSetupComplete', 'false');
    setIsLoggedIn(true);
    setIsSetupComplete(false);
    navigate('/user-setup');
  };

  return (
    <div className="login pt-16 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-secondary mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="form-label" htmlFor="username">Username</label>
          <input className="form-control" id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="form-label" htmlFor="password">Password</label>
          <input className="form-control" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="mb-6">
          <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
          <input className="form-control" id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        {error && <div className="text-red-800 mb-3">{error}</div>}
        <button type="submit" className="btn btn-custom">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
