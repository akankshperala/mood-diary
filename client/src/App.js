import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import Dashboard from "./components/Dashboard";
import WelcomeKitten from "./components/WelcomeKitten";

import "./App.css";

// ProtectedRoute component to guard routes
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Check if user is logged in
  if (!token) return <Navigate to="/" replace />; // Redirect to login if not
  return children; // Render the protected component if token exists
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Login page */}
          <Route path="/" element={<AuthForm />} />

          {/* Protected routes */}
          <Route path="/welcome" element={
            <ProtectedRoute>
              <WelcomeKitten />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/Mood_Diary" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* Redirect unknown routes to login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
