import React from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api';
import { LogOut, Activity, Download, ArrowLeft } from 'lucide-react';

const Result = () => {
  const navigate = useNavigate();
  
  const prediction = localStorage.getItem("prediction") || "Unknown";
  const confidence = localStorage.getItem("confidence") || "0";
  const heatmapUrl = localStorage.getItem("heatmap_url") || "";
  const reportUrl = localStorage.getItem("report_url") || "";
  const patientName = localStorage.getItem("patient_name") || "Patient";

  const isTumor = prediction.toLowerCase().includes("tumor") && !prediction.toLowerCase().includes("no tumor");

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleDownload = async () => {
    if (!reportUrl) return;
    
    let cleanReportUrl = reportUrl;
    if (cleanReportUrl.startsWith('/')) {
      cleanReportUrl = cleanReportUrl.substring(1);
    }

    const fullUrl = reportUrl.startsWith('http') ? reportUrl : `http://localhost:8000/${cleanReportUrl}`;
    const fileName = `NeuroScan_Report_${patientName.replace(/\\s+/g, '_')}.pdf`;

    try {
      const response = await fetch(fullUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert("Failed to download report.");
    }
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

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 mt-8">
        <div className="card">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Analysis Complete</h2>
            <p className="text-slate-500">Grad-CAM visualization and prediction confidence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="flex flex-col items-center">
              <h3 className="font-semibold text-lg mb-4 text-slate-700">MRI / Heatmap</h3>
              {heatmapUrl ? (
                <img 
                  src={heatmapUrl.startsWith('http') ? heatmapUrl : `http://localhost:8000${heatmapUrl.startsWith('/') ? '' : '/'}${heatmapUrl}`} 
                  alt="Grad-CAM Heatmap" 
                  className="rounded-lg shadow-md max-w-full h-auto border border-slate-200"
                />
              ) : (
                <div className="bg-slate-100 w-full h-64 rounded-lg flex items-center justify-center text-slate-400 border border-slate-200">
                  No Image
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <div className={`p-6 rounded-xl border ${isTumor ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'} mb-6`}>
                <p className="text-sm uppercase tracking-wider font-semibold text-slate-500 mb-1">AI Prediction</p>
                <h3 className={`text-4xl font-bold ${isTumor ? 'text-red-700' : 'text-green-700'}`}>
                  {prediction}
                </h3>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6">
                <p className="text-sm uppercase tracking-wider font-semibold text-slate-500 mb-1">Confidence Score</p>
                <h3 className="text-4xl font-bold text-slate-800">{confidence}%</h3>
              </div>

              <button onClick={handleDownload} className="btn-primary flex items-center justify-center gap-2 py-3">
                <Download className="w-5 h-5" /> Download PDF Report
              </button>
            </div>
          </div>

          <div className="flex gap-4 justify-center pt-6 border-t border-slate-100">
            <button onClick={() => navigate('/')} className="btn-secondary flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> New Analysis
            </button>
            <button onClick={() => navigate('/history')} className="btn-secondary">
              View History
            </button>
          </div>
        </div>
      </main>

      <footer className="text-center py-6 text-slate-500 text-sm">
        <p>&copy; 2026 NeuroScan AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Result;
