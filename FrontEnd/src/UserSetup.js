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

export default UserSetup;