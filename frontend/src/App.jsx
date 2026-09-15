import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Result from './pages/Result';
import History from './pages/History';
import AdminDashboard from './pages/AdminDashboard';
import AdminStats from './pages/AdminStats';

// Simple PrivateRoute to guard routes based on role/auth
const PrivateRoute = ({ children, allowedRole }) => {
  const userId = localStorage.getItem("user_id");
  const role = localStorage.getItem("role");

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />
          
          <Route path="/result" element={
            <PrivateRoute>
              <Result />
            </PrivateRoute>
          } />
          
          <Route path="/history" element={
            <PrivateRoute>
              <History />
            </PrivateRoute>
          } />

          <Route path="/admin" element={
            <PrivateRoute allowedRole="admin">
              <AdminDashboard />
            </PrivateRoute>
          } />
          
          <Route path="/admin/stats" element={
            <PrivateRoute allowedRole="admin">
              <AdminStats />
            </PrivateRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
