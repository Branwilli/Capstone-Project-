import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup({ setIsLoggedIn, setIsSetupComplete }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: username, email: username, password })
      });
      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setIsSetupComplete(false);
        localStorage.setItem('isSetupComplete', 'false');
        localStorage.setItem('user_id', data.user_id);
        navigate('/user-setup');
      } else {
        const data = await response.json();
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Error connecting to server');
    }
  };

  return (
    <div className="login pt-16 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-secondary mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="form-label" htmlFor="username">Email</label>
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
        {error && <div className="text-danger mb-3">{error}</div>}
        <button type="submit" className="btn btn-custom">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
