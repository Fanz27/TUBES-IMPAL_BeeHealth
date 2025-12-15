import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Utensils, 
  Dumbbell, 
  Plus, 
  X,
  Calendar,
  BookOpen
} from 'lucide-react';

import api from '../../api'; // Pakai instance axios yang sudah dikonfigurasi di api.js

const Notebook = () => {
  // --- STATE ---
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [logs, setLogs] = useState({
    foodLogs: [],
    exerciseLogs: [],
    summary: { totalCaloriesIn: 0, totalCaloriesOut: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logType, setLogType] = useState('food'); // 'food' atau 'exercise'

  // State Form
  const [formData, setFormData] = useState({
    foodId: '', 
    mealType: 'BREAKFAST',
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
      console.error(err);
      setError('Gagal memuat halaman notebook.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (logType === 'food' && isNaN(parseInt(formData.foodId))) {
      alert("Masukkan harus berupa angka!!");
      return; 
    }

    if (logType === 'exercise' && isNaN(parseInt(formData.exerciseId))) {
      alert("Masukkan harus berupa angka!!");
      return; 
    }

    try {
      if (logType === 'food') {
        await api.post('/log/food', {
          foodId: parseInt(formData.foodId),
          mealType: formData.mealType,
          porsi: parseFloat(formData.porsi)
        });
      } else {
        await api.post('/log/exercise', {
          exerciseId: parseInt(formData.exerciseId),
          durationInMinute: parseInt(formData.durationInMinute)
        });
      }

      setIsModalOpen(false);
      fetchDailyLogs();
      alert('Catatan berhasil ditambahkan ke Notebook!');
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan catatan.');
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

  useEffect(() => {
    fetchDailyLogs();
  }, [selectedDate]);

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-[#F3F4F6] p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Notebook */}
        <div className="flex items-center gap-3 mb-2">
            <BookOpen className="text-green-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-800">Notebook Harian</h1>
        </div>

        {/* Navigasi Tanggal */}
        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <button onClick={() => changeDate(-1)} className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-500">
            <ChevronLeft size={24} />
          </button>
          
          <div className="flex items-center gap-2 font-bold text-lg text-gray-700">
            <Calendar size={20} className="text-green-500" />
            <span>{formatDateDisplay(selectedDate)}</span>
          </div>

          <button onClick={() => changeDate(1)} className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-500">
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Ringkasan Kalori */}
        <div className="grid grid-cols-3 gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Masuk</p>
            <p className="text-2xl font-bold text-green-600">
              {logs.summary?.totalCaloriesIn || 0}
            </p>
          </div>
          
          <div className="space-y-1 border-x border-gray-100">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Netto</p>
            <p className="text-3xl font-extrabold text-gray-800">
              {logs.summary.totalCaloriesIn - logs.summary.totalCaloriesOut}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Terbakar</p>
            <p className="text-2xl font-bold text-orange-500">
              {logs.summary.totalCaloriesOut}
            </p>
          </div>
        </div>

        {/* Content Logs */}
        {loading ? (
           <div className="flex justify-center py-12">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
           </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10 bg-red-50 rounded-xl border border-red-100">
            {error}
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
        className="fixed bottom-8 right-8 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-transform hover:scale-105 active:scale-95 z-40"
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
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">ID Makanan</label>
                    <input 
                      type="text" 
                      name="foodId"
                      value={formData.foodId}
                      onChange={handleInputChange}
                      placeholder="Cth: 1"
                      className="w-full border border-gray-200 bg-gray-50 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all"
                      required
                    />
                    <p className="text-[10px] text-gray-400 mt-1">*Pastikan ID ada di database (Tabel Food)</p>
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
                        <option value="BREAKFAST">Sarapan</option>
                        <option value="LUNCH">Makan Siang</option>
                        <option value="DINNER">Makan Malam</option>
                        <option value="SNACK">Cemilan</option>
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
                      type="text" 
                      name="exerciseId"
                      value={formData.exerciseId}
                      onChange={handleInputChange}
                      placeholder="Cth: 1"
                      className="w-full border border-gray-200 bg-gray-50 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all"
                      required
                    />
                    <p className="text-[10px] text-gray-400 mt-1">*Pastikan ID ada di database (Tabel Exercise)</p>
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
                className={`w-full font-bold py-3.5 rounded-xl transition-all shadow-md mt-6 text-white
                    ${logType === 'food' 
                        ? 'bg-green-600 hover:bg-green-700 shadow-green-200' 
                        : 'bg-orange-500 hover:bg-orange-600 shadow-orange-200'
                    }`}
              >
                Simpan Catatan
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Notebook;
