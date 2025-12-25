import React, { useState, useEffect } from 'react';
import { ChefHat, Flame, PlusCircle, Filter, Loader2, AlertCircle, Dumbbell, Activity } from 'lucide-react'; 
import api from '../../../api'; // Pastikan path import ini benar sesuai struktur folder kamu

const Recommendations = () => {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState("SARAPAN");
  const [userGoal, setUserGoal] = useState("ALL");
  
  // State Data dari API
  const [foods, setFoods] = useState([]); 
  const [exercises, setExercises] = useState([]); 
  const [summary, setSummary] = useState(null); // Menyimpan status (NEEDS_FOOD / NEEDS_EXERCISE)
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- INTEGRASI BACKEND ---
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token'); 

        // Panggil API
        const response = await api.get('/rekomendasi/', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // 1. Ambil data sesuai struktur Controller Backend
        // Backend return: { summary: {...}, recommendations: { food: [], exercise: [] } }
        const data = response.data;

        setSummary(data.summary);
        setFoods(data.recommendations.food || []);
        setExercises(data.recommendations.exercise || []);
        
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        // Handle pesan error spesifik dari backend (misal: profil belum lengkap)
        const msg = err.response?.data?.message || "Gagal memuat rekomendasi.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  // --- LOGIC FILTER MAKANAN (Client Side) ---
  const filteredFood = foods.filter((food) => {
    const matchCategory = food.category === activeTab; 
    // Jika backend sudah memfilter berdasarkan goal/kalori, filter ini opsional, 
    // tapi bagus untuk UX tab kategori.
    return matchCategory;
  });

  // --- HANDLER ADD LOG ---
  const handleAddLog = async (item, type) => {
    try {
        // const endpoint = type === 'food' ? '/food-logs' : '/exercise-logs';
        // await api.post(endpoint, { itemId: item.id });
        alert(`Berhasil mencatat ${type === 'food' ? 'makan' : 'olahraga'}: ${item.name || item.exerciseName}`);
    } catch (error) {
        alert("Gagal mencatat aktivitas.");
    }
  };

  // --- RENDER HELPERS ---
  // Fungsi untuk menentukan warna status
  const getStatusColor = (status) => {
    if (status === 'NEEDS_FOOD') return 'text-orange-600 bg-orange-50 border-orange-200';
    if (status === 'NEEDS_EXERCISE') return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getStatusMessage = (status) => {
    if (status === 'NEEDS_FOOD') return "Asupan kalori masih kurang. Yuk makan!";
    if (status === 'NEEDS_EXERCISE') return "Kalori berlebih. Waktunya bakar lemak!";
    return "Kalori harianmu seimbang. Pertahankan!";
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Activity className="text-green-600" /> Pusat Rekomendasi
          </h1>
          <p className="text-gray-500 mt-1">Analisis cerdas berdasarkan target dan aktivitas harianmu.</p>
        </div>

        {/* LOADING & ERROR */}
        {loading && (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-green-600" size={40} /></div>
        )}

        {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2 mb-6 border border-red-100">
                <AlertCircle size={20} /> {error}
            </div>
        )}

        {!loading && !error && summary && (
          <>
            {/* --- DASHBOARD SUMMARY --- */}
            <div className={`p-6 rounded-2xl border mb-8 flex flex-col md:flex-row items-center justify-between gap-4 ${getStatusColor(summary.status)}`}>
              <div>
                <h2 className="text-xl font-bold mb-1">Status: {summary.status.replace('_', ' ')}</h2>
                <p className="text-sm opacity-90">{getStatusMessage(summary.status)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase font-bold tracking-wide opacity-70">Sisa Kalori Target</p>
                <p className="text-3xl font-bold">{summary.remaining} kkal</p>
              </div>
            </div>

            {/* --- CASE 1: REKOMENDASI OLAHRAGA (Jika kalori berlebih) --- */}
            {summary.status === 'NEEDS_EXERCISE' && (
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-700">
                  <Dumbbell /> Rekomendasi Latihan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {exercises.map((ex, idx) => (
                    <div key={ex.id || idx} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-all p-5">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-lg text-gray-800">{ex.exerciseName || "Latihan Fisik"}</h4>
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold">
                           {ex.duration || 30} mnt
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm mt-2 mb-4">
                        Membakar sekitar <span className="font-bold text-gray-900">{Math.round(ex.caloriesBurnPerMinute * (ex.duration || 30))} kkal</span>
                      </p>
                      <button 
                        onClick={() => handleAddLog(ex, 'exercise')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-sm font-medium transition-colors"
                      >
                        Mulai Latihan Ini
                      </button>
                    </div>
                  ))}
                  {exercises.length === 0 && <p className="text-gray-500 col-span-full text-center">Tidak ada data latihan tersedia.</p>}
                </div>
              </div>
            )}

            {/* --- CASE 2: REKOMENDASI MAKANAN (Jika kalori kurang) --- */}
            {(summary.status === 'NEEDS_FOOD' || summary.status === 'MAINTAINED') && (
              <div>
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-green-700">
                    <ChefHat /> Rekomendasi Menu
                  </h3>
                  
                  {/* Tab Kategori Hanya Muncul Jika Mode Makanan */}
                  <div className="flex bg-gray-100 p-1 rounded-xl overflow-x-auto">
                    {["SARAPAN", "SIANG", "MALAM", "SNACK"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                          activeTab === tab ? "bg-white text-green-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFood.length > 0 ? (
                    filteredFood.map((food) => (
                      <div key={food.id || food._id} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden group">
                        <div className="h-40 overflow-hidden relative">
                          <img 
                            src={food.image || "https://via.placeholder.com/400x300?text=No+Image"} 
                            alt={food.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-gray-800 line-clamp-1">{food.name}</h3>
                            <div className="flex items-center gap-1 text-orange-500 font-bold text-xs bg-orange-50 px-2 py-1 rounded-md">
                              <Flame size={12} /> {food.calories}
                            </div>
                          </div>
                          
                          <div className="flex justify-between text-xs text-gray-500 mb-4 bg-gray-50 p-2 rounded-lg">
                             <span>P: {food.protein}g</span>
                             <span>C: {food.carbs}g</span>
                             <span>F: {food.fat}g</span>
                          </div>

                          <button 
                            onClick={() => handleAddLog(food, 'food')}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                          >
                            <PlusCircle size={16} /> Catat
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      <p>Tidak ada menu {activeTab.toLowerCase()} yang cocok dengan sisa kalorimu saat ini.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Recommendations;