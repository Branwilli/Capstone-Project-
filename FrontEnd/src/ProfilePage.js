import React, { useState, useEffect } from 'react';

// TODO: Replace localStorage usage with backend API calls for fetching and updating the user profile.
//  In useEffect, fetch the profile from the backend (e.g., GET /api/users/profile)
// In handleSubmit, update the profile in the backend (e.g., PUT /api/users/profile)

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const userId = localStorage.getItem('user_id') || 1;
        const response = await fetch(`/api/users/profile?user_id=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setProfile({
            ...data,
            // Parse JSON fields if needed
            dailyRoutine: Array.isArray(data.dailyRoutine) ? data.dailyRoutine : (data.dailyRoutine ? JSON.parse(data.dailyRoutine) : []),
            goals: Array.isArray(data.goals) ? data.goals : (data.goals ? JSON.parse(data.goals) : []),
            likes: Array.isArray(data.likes) ? data.likes : (data.likes ? JSON.parse(data.likes) : []),
            dislikes: Array.isArray(data.dislikes) ? data.dislikes : (data.dislikes ? JSON.parse(data.dislikes) : []),
            healthConditions: data.health_conditions || data.healthConditions || '',
            gender: data.gender || '',
            occupation: data.occupation || '',
            age: data.age || '',
            name: data.name || '',
            quote: data.quote || ''
          });
        } else {
          setProfile({});
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfile({});
      }
    }
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('user_id') || 1;
      const payload = {
        ...profile,
        user_id: userId,
        dailyRoutine: profile.dailyRoutine || [],
        goals: profile.goals || [],
        likes: profile.likes || [],
        dislikes: profile.dislikes || [],
      };
      const response = await fetch('/api/users/profile', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setIsEditing(false);
        setAlert('Profile updated successfully!');
        setTimeout(() => setAlert(null), 3000);
      } else {
        setAlert('Error updating profile.');
      }
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

export default ProfilePage;