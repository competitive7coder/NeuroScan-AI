import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api';
import { Activity } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    const endpoint = isLogin ? `${API_BASE_URL}/login` : `${API_BASE_URL}/register`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData
      });
      const data = await response.json();

      if (isLogin) {
        if (data.status === "success") {
          localStorage.setItem("user_id", data.user_id);
          localStorage.setItem("role", data.role);
          if (data.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        } else {
          setError("Invalid credentials!");
        }
      } else {
        if (data.status === "registered") {
          alert("Registration successful! Please login.");
          setIsLogin(true);
        } else {
          setError("Username already exists!");
        }
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4">
      <div className="text-center mb-8">
        <Activity className="w-12 h-12 text-primary mx-auto mb-2" />
        <h1 className="text-3xl font-bold text-slate-800">NeuroScan AI</h1>
        <p className="text-slate-500">Secure Medical Portal</p>
      </div>

      <div className="card w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input 
              type="text" 
              required
              className="input-field" 
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              className="input-field" 
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary w-full mt-4">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mt-6 text-slate-500">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary font-semibold hover:underline"
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>

      <footer className="mt-12 text-slate-500 text-sm text-center">
        <p>&copy; 2026 NeuroScan AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Login;
