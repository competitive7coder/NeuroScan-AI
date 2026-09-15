import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api';
import { LogOut, Activity, ArrowLeft } from 'lucide-react';

const History = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const userId = localStorage.getItem("user_id");
      try {
        const res = await fetch(`${API_BASE_URL}/history/${userId}`);
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error("Failed to fetch history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getImageUrl = (path) => {
    return path.startsWith('http') ? path : `http://localhost:8000${path.startsWith('/') ? '' : '/'}${path}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Activity className="text-primary w-6 h-6" />
          <h1 className="text-xl font-bold text-slate-800">NeuroScan AI</h1>
        </div>
        <button onClick={handleLogout} className="text-slate-500 hover:text-red-500 flex items-center gap-1 font-medium transition-colors">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 mt-8">
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Prediction History</h2>
            <button onClick={() => navigate('/')} className="btn-secondary flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Upload
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-500">Loading history...</div>
          ) : history.length === 0 ? (
            <div className="text-center py-12 text-slate-500">No predictions found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 font-semibold text-slate-600">Date</th>
                    <th className="px-4 py-3 font-semibold text-slate-600">Patient ID</th>
                    <th className="px-4 py-3 font-semibold text-slate-600">Patient Name</th>
                    <th className="px-4 py-3 font-semibold text-slate-600">Image</th>
                    <th className="px-4 py-3 font-semibold text-slate-600">Prediction</th>
                    <th className="px-4 py-3 font-semibold text-slate-600">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.map((record, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-slate-600">{new Date(record.date).toLocaleString()}</td>
                      <td className="px-4 py-3 font-medium">{record.patient_id}</td>
                      <td className="px-4 py-3">{record.patient_name}</td>
                      <td className="px-4 py-3">
                        <img 
                          src={getImageUrl(record.image_path)} 
                          alt="Scan" 
                          className="w-12 h-12 object-cover rounded shadow-sm border border-slate-200"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          record.prediction === 'Tumor' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {record.prediction}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{record.confidence_percent}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <footer className="text-center py-6 text-slate-500 text-sm">
        <p>&copy; 2026 NeuroScan AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default History;
