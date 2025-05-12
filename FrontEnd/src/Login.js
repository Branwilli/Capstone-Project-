import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// TODO: Replace localStorage usage and simulated login with a backend API call for authentication.
// - In handleSubmit, send username and password to the backend (e.g., POST /api/users/login)
// - Use the backend response to determine login success and setup completion

function Login({ setIsLoggedIn, setIsSetupComplete }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password })
      });
      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setIsSetupComplete(data.isSetupComplete);
        localStorage.setItem('isSetupComplete', data.isSetupComplete ? 'true' : 'false');
        localStorage.setItem('user_id', data.user_id);
        navigate(data.isSetupComplete ? '/dashboard' : '/user-setup');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Error connecting to server');
    }
  };

  return (
    <div className="login pt-16 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-secondary mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="form-label" htmlFor="username">Email</label>
          <input className="form-control" id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="mb-6">
          <label className="form-label" htmlFor="password">Password</label>
          <input className="form-control" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <div className="text-danger mb-3">{error}</div>}
        <button type="submit" className="btn btn-custom">Login</button>
      </form>
    </div>
  );
}

export default Login;