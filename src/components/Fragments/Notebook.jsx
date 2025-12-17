import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Utensils, 
  Dumbbell, 
  Plus, 
  X,
  Calendar,
  BookOpen,
  Loader2 // Icon loading tambahan
} from 'lucide-react';

import api from '../../api'; // Pastikan path ini sesuai dengan struktur foldermu

const Notebook = () => {
  // --- STATE ---
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // State Data Log
  const [logs, setLogs] = useState({
    foodLogs: [],
    exerciseLogs: [],
    summary: { totalCaloriesIn: 0, totalCaloriesOut: 0 }
  });

  // State UI
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false); // Loading khusus tombol simpan
  const [error, setError] = useState(null);

  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logType, setLogType] = useState('food'); // 'food' atau 'exercise'

  // State Form Input
  const [formData, setFormData] = useState({
    foodNama: '', 
    mealType: 'MAKAN_SIANG', // Default value disesuaikan (biasanya LUNCH/BREAKFAST/DINNER)
    porsi: 1,
    exerciseId: '', 
    durationInMinute: 30
  });

  // --- HELPER FUNCTIONS ---
  const formatDateForAPI = (date) => date.toISOString().split('T')[0];
  
  const formatDateDisplay = (date) => new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);

  // --- API CALLS ---
  
  // 1. GET DATA (Fetch Logs)
  const fetchDailyLogs = async () => {
    setLoading(true);
    try {
      const dateString = formatDateForAPI(selectedDate);
      const response = await api.get('/log/daily', { params: { date: dateString } });

      const safeSummary = response.data.summary || { totalCaloriesIn: 0, totalCaloriesOut: 0 };
      
      setLogs({
        foodLogs: response.data.foodLogs || [],
        exerciseLogs: response.data.exerciseLogs || [],
        summary: safeSummary
      });
      setError(null);
    } catch (err) {
      console.error("DEBUG Fetch Error:", err);
      // Menampilkan pesan error yang lebih ramah
      const msg = err.response?.data?.message || "Gagal memuat data notebook. Pastikan server berjalan.";
      setError(msg);

      if (err.response?.status === 401) {
          alert("Sesi kamu habis. Silakan login ulang.");
          // window.location.href = '/login'; 
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. POST DATA (Submit Form)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi sederhana sebelum kirim ke server
    if (logType === 'food' && !formData.foodNama) {
        alert("Mohon isi Nama Makanan!");
        return;
    }
    if (logType === 'exercise' && !formData.exerciseId) {
        alert("Mohon isi ID Olahraga!");
        return;
    }

    setSubmitLoading(true); // Aktifkan loading di tombol

    try {
      if (logType === 'food') {
        // Kirim data Makanan
        await api.post('/log/food', {
          foodNama: formData.foodNama,
          mealType: formData.mealType,
          porsi: parseFloat(formData.porsi)
        });
      } else {
        // Kirim data Olahraga
        await api.post('/log/exercise', {
          exerciseId: formData.exerciseId,
          durationInMinute: parseInt(formData.durationInMinute)
        });
      }

      // Jika Berhasil:
      setIsModalOpen(false);
      fetchDailyLogs(); // Refresh data halaman
      
      // Reset Form agar bersih kembali
      setFormData({
        foodNama: '', 
        mealType: 'MAKAN_SIANG',
        porsi: 1,
        exerciseId: '', 
        durationInMinute: 30
      });
      
      alert('Berhasil menyimpan catatan!');

    } catch (err) {
      console.error("DEBUG Submit Error:", err);
      
      // LOGIKA ERROR HANDLING YANG LEBIH BAIK
      const serverMsg = err.response?.data?.message || err.response?.data?.error;
      const status = err.response?.status;

      if (serverMsg) {
        alert(`Gagal: ${serverMsg}`); // Pesan langsung dari backend (misal: "Food ID not found")
      } else if (status === 400) {
        alert("Gagal: Data tidak valid. Cek apakah Nama Makanan/Olahraga benar ada di database.");
      } else if (status === 500) {
        alert("Gagal: Terjadi kesalahan pada Server (Internal Server Error).");
      } else {
        alert("Gagal menyimpan. Periksa koneksi internet atau server.");
      }
    } finally {
      setSubmitLoading(false); // Matikan loading tombol
    }
  };

  // --- HANDLERS ---
  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Effect: Load data saat tanggal berubah
  useEffect(() => {
    fetchDailyLogs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-[#F3F4F6] p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Notebook */}
        <div className="flex items-center gap-3 mb-2">
            <div className="bg-white p-2 rounded-xl shadow-sm">
                <BookOpen className="text-green-600" size={28} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Notebook Harian</h1>
        </div>

        {/* Navigasi Tanggal */}
        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <button onClick={() => changeDate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
            <ChevronLeft size={24} />
          </button>
          
          <div className="flex items-center gap-3 font-bold text-lg text-gray-700">
            <Calendar size={20} className="text-green-500" />
            <span>{formatDateDisplay(selectedDate)}</span>
          </div>

          <button onClick={() => changeDate(1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Ringkasan Kalori */}
        <div className="grid grid-cols-3 gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">Masuk</p>
            <p className="text-2xl font-bold text-green-600">
              {logs.summary?.totalCaloriesIn || 0}
            </p>
          </div>
          
          <div className="space-y-1 border-x border-gray-100">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">Netto</p>
            <p className="text-3xl font-extrabold text-gray-800">
              {(logs.summary?.totalCaloriesIn || 0) - (logs.summary?.totalCaloriesOut || 0)}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">Terbakar</p>
            <p className="text-2xl font-bold text-orange-500">
              {logs.summary?.totalCaloriesOut || 0}
            </p>
          </div>
        </div>

        {/* Content Logs */}
        {loading ? (
           <div className="flex flex-col items-center justify-center py-16 gap-3">
             <Loader2 className="animate-spin text-green-600" size={32} />
             <p className="text-gray-400 text-sm animate-pulse">Memuat catatan...</p>
           </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10 bg-red-50 rounded-xl border border-red-100 px-4">
            <p className="font-bold">Terjadi Kesalahan</p>
            <p className="text-sm mt-1">{error}</p>
            <button 
                onClick={fetchDailyLogs}
                className="mt-4 px-4 py-2 bg-white border border-red-200 text-red-500 rounded-lg text-sm hover:bg-red-50 transition"
            >
                Coba Lagi
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Kolom Makanan */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-700 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                <div className="p-1.5 bg-green-100 rounded-md">
                    <Utensils size={18} className="text-green-600" />
                </div>
                Catatan Makanan
              </h3>
              
              {logs.foodLogs.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-400 text-sm">Belum ada makanan dicatat.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {logs.foodLogs.map((log) => (
                    <div key={log.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex justify-between items-center">
                      <div>
                        <p className="font-bold text-gray-800">{log.food?.name || 'Unknown Food'}</p>
                        <div className="flex gap-2 mt-1">
                            <span className="text-[10px] uppercase font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                                {log.mealType}
                            </span>
                            <span className="text-xs text-gray-500">{log.porsi} porsi</span>
                        </div>
                      </div>
                      <div className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-lg text-sm">
                        +{log.food ? (log.food.kalori * log.porsi) : 0}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Kolom Olahraga */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-700 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                <div className="p-1.5 bg-orange-100 rounded-md">
                    <Dumbbell size={18} className="text-orange-600" />
                </div>
                Catatan Olahraga
              </h3>

              {logs.exerciseLogs.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-400 text-sm">Belum ada olahraga dicatat.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {logs.exerciseLogs.map((log) => (
                    <div key={log.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex justify-between items-center">
                      <div>
                        <p className="font-bold text-gray-800">{log.exercise?.name || 'Unknown Exercise'}</p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          ⏱ {log.durationInMinute} menit
                        </p>
                      </div>
                      <div className="text-orange-500 font-bold bg-orange-50 px-3 py-1 rounded-lg text-sm">
                        -{log.exercise ? (log.exercise.kaloriTerbakarPerMenit * log.durationInMinute) : 0}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-transform hover:scale-105 active:scale-95 z-40 flex items-center justify-center"
      >
        <Plus size={28} />
      </button>

      {/* Modal / Popup Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 relative shadow-2xl">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-xl font-bold mb-6 text-gray-800">Tambah Catatan Baru</h2>
            
            {/* Tab Switcher */}
            <div className="flex bg-gray-100 p-1.5 rounded-xl mb-6">
              <button 
                onClick={() => setLogType('food')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${logType === 'food' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Makanan
              </button>
              <button 
                onClick={() => setLogType('exercise')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${logType === 'exercise' ? 'bg-white shadow-sm text-orange-500' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Olahraga
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {logType === 'food' ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Makanan</label>
                    <input 
                      type="text" 
                      name="foodNama"
                      value={formData.foodNama}
                      onChange={handleInputChange}
                      placeholder="Cth: Bakso"
                      className="w-full border border-gray-200 bg-gray-50 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all"
                      required
                    />
                    <p className="text-[10px] text-gray-400 mt-1">*Nama harus sesuai tabel Database (Food)</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Waktu Makan</label>
                    <div className="relative">
                        <select 
                        name="mealType"
                        value={formData.mealType}
                        onChange={handleInputChange}
                        className="w-full border border-gray-200 bg-gray-50 rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none appearance-none"
                        >
                        <option value="SARAPAN">Sarapan</option>
                        <option value="MAKAN_SIANG">Makan Siang</option>
                        <option value="MAKAN_MALAM">Makan Malam</option>
                        <option value="KUDAPAN">Cemilan</option>
                        </select>
                        <div className="absolute right-3 top-3.5 pointer-events-none text-gray-500">▼</div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Jumlah Porsi</label>
                    <input 
                      type="number" 
                      name="porsi"
                      step="0.1"
                      min="0.1"
                      value={formData.porsi}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 bg-gray-50 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">ID Olahraga</label>
                    <input 
                      type="number" 
                      name="exerciseId"
                      value={formData.exerciseId}
                      onChange={handleInputChange}
                      placeholder="Cth: 1"
                      className="w-full border border-gray-200 bg-gray-50 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all"
                      required
                    />
                    <p className="text-[10px] text-gray-400 mt-1">*ID harus sesuai tabel Database (Exercise)</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Durasi (Menit)</label>
                    <input 
                      type="number" 
                      name="durationInMinute"
                      min="1"
                      value={formData.durationInMinute}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 bg-gray-50 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all"
                      required
                    />
                  </div>
                </>
              )}

              <button 
                type="submit" 
                disabled={submitLoading}
                className={`w-full font-bold py-3.5 rounded-xl transition-all shadow-md mt-6 text-white flex justify-center items-center gap-2
                    ${logType === 'food' 
                        ? 'bg-green-600 hover:bg-green-700 shadow-green-200' 
                        : 'bg-orange-500 hover:bg-orange-600 shadow-orange-200'
                    } ${submitLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {submitLoading ? (
                    <>
                        <Loader2 className="animate-spin" size={20} />
                        Menyimpan...
                    </>
                ) : (
                    "Simpan Catatan"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Notebook;