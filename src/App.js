import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MeetingProvider } from './context/MeetingContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Home/Dashboard';
import MeetingRoom from './components/Meeting/MeetingRoom';
import PrivateRoute from './components/UI/PrivateRoute';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <MeetingProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/meeting/:meetingId"
              element={
                <PrivateRoute>
                  <MeetingRoom />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </MeetingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;