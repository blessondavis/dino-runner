import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background-color: #3c3c3c;
  border: 3px solid #fff;
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid #fff;
  margin: 20px auto;
  display: block;
`;

const Profile = () => {
  const [avatar, setAvatar] = useState(null);
  const [highScores, setHighScores] = useState([]);
  const userId = 1; // This should come from authentication context

  useEffect(() => {
    fetchHighScores();
  }, []);

  const fetchHighScores = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/high-scores/${userId}`);
      setHighScores(response.data);
    } catch (err) {
      console.error('Error fetching high scores:', err);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        `http://localhost:8000/upload-avatar/${userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setAvatar(response.data.filename);
    } catch (err) {
      console.error('Error uploading avatar:', err);
    }
  };

  return (
    <ProfileContainer>
      <h2>Profile</h2>
      <div>
        {avatar ? (
          <Avatar src={`http://localhost:8000/${avatar}`} alt="Profile avatar" />
        ) : (
          <Avatar src="/default-avatar.png" alt="Default avatar" />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          style={{ display: 'none' }}
          id="avatar-upload"
        />
        <label htmlFor="avatar-upload">
          <button className="retro-button" onClick={() => document.getElementById('avatar-upload').click()}>
            Upload Avatar
          </button>
        </label>
      </div>
      <div>
        <h3>High Scores</h3>
        <ul>
          {highScores.map((score, index) => (
            <li key={index}>
              Score: {score.score} - Date: {new Date(score.timestamp).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </div>
    </ProfileContainer>
  );
};

export default Profile;