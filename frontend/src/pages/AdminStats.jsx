import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api';
import { LogOut, Activity, ArrowLeft } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminStats = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, detailsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/stats`),
          fetch(`${API_BASE_URL}/stats-details`)
        ]);
        const statsData = await statsRes.json();
        const detailsData = await detailsRes.json();
        setStats(statsData);
        setDetails(detailsData);
      } catch (err) {
        console.error("Failed to fetch stats");
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const pieData = {
    labels: ['Tumor', 'No Tumor'],
    datasets: [{
      data: stats ? [stats.tumor_cases, stats.no_tumor_cases] : [0, 0],
      backgroundColor: ['#ef4444', '#22c55e'],
      borderWidth: 1,
    }]
  };

  const lineData = {
    labels: details ? details.daily_predictions.map(d => d[0]) : [],
    datasets: [{
      label: 'Daily Predictions',
      data: details ? details.daily_predictions.map(d => d[1]) : [],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.3,
      fill: true
    }]
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Activity className="text-primary w-6 h-6" />
          <h1 className="text-xl font-bold text-slate-800">NeuroScan Admin</h1>
        </div>
        <button onClick={handleLogout} className="text-slate-500 hover:text-red-500 flex items-center gap-1 font-medium transition-colors">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">System Statistics</h2>
          <button onClick={() => navigate('/admin')} className="btn-secondary flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        </div>

        {!stats ? (
          <div className="text-center py-12 text-slate-500">Loading statistics...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="card text-center py-8">
                <p className="text-slate-500 font-medium mb-2">Total Scans</p>
                <h3 className="text-4xl font-bold text-slate-800">{stats.total_predictions}</h3>
              </div>
              <div className="card text-center py-8">
                <p className="text-slate-500 font-medium mb-2">Tumor Detected</p>
                <h3 className="text-4xl font-bold text-red-600">{stats.tumor_cases}</h3>
              </div>
              <div className="card text-center py-8">
                <p className="text-slate-500 font-medium mb-2">No Tumor</p>
                <h3 className="text-4xl font-bold text-green-600">{stats.no_tumor_cases}</h3>
              </div>
              <div className="card text-center py-8">
                <p className="text-slate-500 font-medium mb-2">Total Patients</p>
                <h3 className="text-4xl font-bold text-blue-600">{stats.total_patients}</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="card lg:col-span-1">
                <h3 className="text-lg font-semibold text-slate-700 mb-4 text-center">Prediction Distribution</h3>
                <div className="w-full flex justify-center">
                  <div className="w-64 h-64">
                    <Pie data={pieData} />
                  </div>
                </div>
              </div>

              <div className="card lg:col-span-2">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">Daily Analysis Activity</h3>
                <div className="w-full h-64">
                  <Line data={lineData} options={{ maintainAspectRatio: false }} />
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="text-center py-6 text-slate-500 text-sm">
        <p>&copy; 2026 NeuroScan AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AdminStats;
