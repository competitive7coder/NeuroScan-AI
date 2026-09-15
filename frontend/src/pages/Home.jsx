import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api';
import { LogOut, Upload, FileText, Activity } from 'lucide-react';

const Home = () => {
  const [patientName, setPatientName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select an MRI image.");
      return;
    }

    setLoading(true);
    const userId = localStorage.getItem("user_id");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("patient_name", patientName);
    formData.append("patient_id", patientId);
    formData.append("user_id", userId);

    try {
      const res = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      
      if (res.ok) {
        // Save to local storage to pass to Result page
        localStorage.setItem("prediction", data.prediction);
        localStorage.setItem("confidence", data.confidence_percent);
        localStorage.setItem("heatmap_url", data.heatmap_url);
        localStorage.setItem("report_url", data.report_url);
        localStorage.setItem("patient_name", patientName);
        localStorage.setItem("patient_id", patientId);
        
        navigate('/result');
      } else {
        alert("Error: " + (data.error || "Failed to process image"));
      }
    } catch (err) {
      alert("Server error. Please try again later.");
    } finally {
      setLoading(false);
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">New MRI Analysis</h2>
            <button onClick={() => navigate('/history')} className="btn-secondary flex items-center gap-2">
              <FileText className="w-4 h-4" /> View History
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Patient Name</label>
                <input type="text" required className="input-field" placeholder="John Doe" 
                  value={patientName} onChange={e => setPatientName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Patient ID</label>
                <input type="text" required className="input-field" placeholder="PT-12345" 
                  value={patientId} onChange={e => setPatientId(e.target.value)} />
              </div>
            </div>

            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer bg-slate-50 relative">
              <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required />
              
              {!preview ? (
                <div className="flex flex-col items-center pointer-events-none">
                  <Upload className="w-12 h-12 text-slate-400 mb-3" />
                  <p className="text-slate-600 font-medium">Click or drag MRI scan here to upload</p>
                  <p className="text-slate-400 text-sm mt-1">Supports JPG, PNG, JPEG</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <img src={preview} alt="MRI Preview" className="max-h-64 rounded shadow-sm object-contain" />
                  <p className="text-primary font-medium mt-4 pointer-events-none">Click to change image</p>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} className={`btn-primary w-full py-3 text-lg flex justify-center items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {loading ? (
                <><Activity className="w-5 h-5 animate-pulse" /> Analyzing MRI...</>
              ) : (
                <><Activity className="w-5 h-5" /> Run AI Analysis</>
              )}
            </button>
          </form>
        </div>
      </main>

      <footer className="text-center py-6 text-slate-500 text-sm">
        <p>&copy; 2026 NeuroScan AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
