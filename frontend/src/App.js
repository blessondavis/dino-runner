import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import styled from 'styled-components';
import Game from './components/Game';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';

const NavBar = styled.nav`
  background-color: #3c3c3c;
  padding: 20px;
  margin-bottom: 20px;
`;

const App = () => {
  return (
    <Router>
      <div>
        <NavBar>
          <Link to="/game" className="retro-button">
            Game
          </Link>
          <Link to="/profile" className="retro-button">
            Profile
          </Link>
          <Link to="/login" className="retro-button">
            Login
          </Link>
        </NavBar>

        <Routes>
          <Route path="/game" element={
          <ProtectedRoute>
            <Game />
          </ProtectedRoute>
        } />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;