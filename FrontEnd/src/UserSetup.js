import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const [error, setError] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const profile = { name, age, occupation, healthConditions, gender, dailyRoutine, goals, likes, dislikes, quote };
    try {
      const response = await fetch('/api/users/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      if (response.ok) {
        setIsSetupComplete(true);
        localStorage.setItem('isSetupComplete', 'true');
        navigate('/dashboard');
      } else {
        setError('Failed to save profile.');
      }
    } catch (err) {
      setError('Error connecting to server.');
    }
  };

  return (
    <div className="user-setup pt-16 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-secondary mb-4">Complete Your Profile</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="form-label" htmlFor="name">Name</label>
          <input className="form-control" id="name" type="text" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="form-label" htmlFor="age">Age</label>
          <input className="form-control" id="age" type="number" value={age} onChange={e => setAge(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="form-label" htmlFor="occupation">Occupation</label>
          <input className="form-control" id="occupation" type="text" value={occupation} onChange={e => setOccupation(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="form-label" htmlFor="healthConditions">Health Conditions</label>
          <input className="form-control" id="healthConditions" type="text" value={healthConditions} onChange={e => setHealthConditions(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="form-label" htmlFor="gender">Gender</label>
          <select className="form-control" id="gender" value={gender} onChange={e => setGender(e.target.value)} required>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="form-label">Daily Routine</label>
          <div className="d-flex flex-wrap gap-2">
            {routineOptions.map(option => (
              <button type="button" key={option} className={`btn btn-sm ${dailyRoutine.includes(option) ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => handleRoutineChange(option)}>{option}</button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="form-label">Goals</label>
          <div className="d-flex flex-wrap gap-2">
            {goalOptions.map(option => (
              <button type="button" key={option} className={`btn btn-sm ${goals.includes(option) ? 'btn-success' : 'btn-outline-success'}`} onClick={() => handleGoalsChange(option)}>{option}</button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="form-label">Likes</label>
          <div className="d-flex flex-wrap gap-2">
            {likeDislikeOptions.map(option => (
              <button type="button" key={option} className={`btn btn-sm ${likes.includes(option) ? 'btn-info' : 'btn-outline-info'}`} onClick={() => handleLikesChange(option)}>{option}</button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="form-label">Dislikes</label>
          <div className="d-flex flex-wrap gap-2">
            {likeDislikeOptions.map(option => (
              <button type="button" key={option} className={`btn btn-sm ${dislikes.includes(option) ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => handleDislikesChange(option)}>{option}</button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="form-label" htmlFor="quote">Favorite Quote</label>
          <input className="form-control" id="quote" type="text" value={quote} onChange={e => setQuote(e.target.value)} />
        </div>
        {error && <div className="text-danger mb-3">{error}</div>}
        <button type="submit" className="btn btn-custom">Save Profile</button>
      </form>
    </div>
  );
}

export default UserSetup;