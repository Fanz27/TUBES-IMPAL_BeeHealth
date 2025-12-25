import React, { useState, useEffect } from 'react';
import { ChefHat, Flame, PlusCircle, Loader2, AlertCircle, Dumbbell, Activity, Target } from 'lucide-react'; 
import api from '../../../api'; 

const Recommendations = () => {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState("SARAPAN"); 
  const [foods, setFoods] = useState([]); 
  const [exercises, setExercises] = useState([]); 
  
  // State Data Utama
  const [summary, setSummary] = useState(null); 
  const [macros, setMacros] = useState(null); 

  // State UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingId, setAddingId] = useState(null); 

  // --- FETCH DATA SAAT COMPONENT MOUNT ---
  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response = await api.get('/rekomendasi/');
        const data = response.data;
        
        setSummary(data.summary);
        setMacros(data.macros); 
        setFoods(data.recommendations.food || []);
        setExercises(data.recommendations.exercise || []);
        setError(null);
      } catch (err) {
        console.error(err);
        const msg = err.response?.data?.message || "Gagal memuat rekomendasi.";
        setError(msg);
      } finally {
        setLoading(false);
      }
  };

  // --- FUNGSI CATAT KE NOTEBOOK ---
  const handleAddLog = async (item, type) => {
    setAddingId(item.id || item.nama || item.namaKegiatan); 

    try {
        // 1. Tentukan Tanggal Hari Ini (Format YYYY-MM-DD)
        const today = new Date().toISOString().split('T')[0];

        if (type === 'food') {
            // 2. Mapping Tab Frontend -> Enum Backend
            // Tab "SIANG" di UI -> "MAKAN_SIANG" di Database
            let mealTypeEnum = 'KUDAPAN';
            if (activeTab === 'SARAPAN') mealTypeEnum = 'SARAPAN';
            if (activeTab === 'SIANG') mealTypeEnum = 'MAKAN_SIANG';
            if (activeTab === 'MALAM') mealTypeEnum = 'MAKAN_MALAM';
            if (activeTab === 'SNACK') mealTypeEnum = 'KUDAPAN';

            // 3. Kirim ke API yang sudah ada
            await api.post('/log/food', {
                foodNama: item.nama,
                mealType: mealTypeEnum, 
                porsi: 1, 
                tanggal: today
            });
            alert(`Berhasil menambahkan ${item.nama} ke ${activeTab}`);
        } else {
            // Logic Olahraga
            await api.post('/log/exercise', {
                namaKegiatan: item.namaKegiatan, 
                durationInMinute: 30,
                tanggal: today
            });
            alert(`Berhasil menambahkan olahraga: ${item.namaKegiatan}`);
        }

        fetchRecommendations();

    } catch (error) {
        console.error("Gagal mencatat:", error);
        const msg = error.response?.data?.message || "Gagal mencatat aktivitas.";
        alert(msg);
    } finally {
        setAddingId(null);
    }
  };

  // --- SUB-COMPONENT: MACRO CARD (PROGRESS BAR) ---
  const MacroCard = ({ label, current, target, colorClass, unit = 'g' }) => {
     // Hitung persentase bar (max 100%)
     const percentage = Math.min(100, Math.max(0, (current / target) * 100)) || 0;
     
     return (
        <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm flex-1 min-w-[140px]">
            <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-bold text-gray-500 uppercase">{label}</span>
                <span className="text-sm font-bold text-gray-800">
                    {current} / {target} {unit}
                </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div 
                    className={`h-2.5 rounded-full transition-all duration-500 ${colorClass}`} 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
     );
  };

  // --- RENDER UTAMA ---
  return (
    <div className="min-h-screen text-gray-900 p-4 md:p-8 pt-24 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Activity className="text-green-600" /> Pusat Rekomendasi
          </h1>
          <p className="text-gray-500 mt-1">Analisis cerdas dan rekomendasi menu harianmu.</p>
        </div>

        {/* LOADING & ERROR STATES */}
        {loading && (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-green-600" size={40} /></div>
        )}

        {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2 mb-6 border border-red-100">
                <AlertCircle size={20} /> {error}
            </div>
        )}

        {/* KONTEN UTAMA (Hanya tampil jika loading selesai & sukses) */}
        {!loading && !error && summary && (
          <>
            {/* JIKA USER BELUM CALCULATE */}
            {summary.status === 'CALCULATE_REQUIRED' ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-700 mb-2">Target Kalori Belum Ditetapkan</h2>
                    <p className="text-gray-500 mb-6">Silakan hitung kebutuhan kalorimu terlebih dahulu.</p>
                    <a href="/calculate" className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition">
                        Hitung Kalori Sekarang
                    </a>
                </div>
            ) : (
                <div className="space-y-8">
                    
                    {/* 1. DASHBOARD RINGKASAN KALORI */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                         <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className={`p-4 rounded-full flex-shrink-0 ${summary.remaining >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                <Target size={32} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Sisa Kalori Target</p>
                                <h2 className={`text-4xl font-bold ${summary.remaining >= 0 ? 'text-gray-800' : 'text-red-600'}`}>
                                    {summary.remaining} <span className="text-lg font-normal text-gray-400">kkal</span>
                                </h2>
                                <p className="text-xs text-gray-400 mt-1 flex gap-2">
                                    <span>🎯 {summary.target}</span> | 
                                    <span>🍔 {summary.consumed}</span> | 
                                    <span>🔥 {summary.burned}</span>
                                </p>
                            </div>
                         </div>

                         {/* Status Badge */}
                         <div className={`px-4 py-2 rounded-lg font-bold text-sm text-center w-full md:w-auto ${
                             summary.status === 'NEEDS_EXERCISE' ? 'bg-blue-100 text-blue-700' : 
                             summary.status === 'NEEDS_FOOD' ? 'bg-orange-100 text-orange-700' : 
                             'bg-green-100 text-green-700'
                         }`}>
                             {summary.status === 'MAINTAINED' ? 'SEIMBANG' : summary.status.replace('_', ' ')}
                         </div>
                    </div>

                    {/* 2. PROGRESS BAR MACRO */}
                    {macros && (
                        <div className="flex flex-col md:flex-row gap-4">
                            <MacroCard label="Protein" current={macros.protein.consumed} target={macros.protein.target} colorClass="bg-blue-500" />
                            <MacroCard label="Karbohidrat" current={macros.carbs.consumed} target={macros.carbs.target} colorClass="bg-yellow-500" />
                            <MacroCard label="Lemak" current={macros.fat.consumed} target={macros.fat.target} colorClass="bg-red-500" />
                        </div>
                    )}

                    {/* 3. REKOMENDASI OLAHRAGA (Hanya jika status NEEDS_EXERCISE) */}
                    {summary.status === 'NEEDS_EXERCISE' && (
                        <div>
                             <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-700">
                                <Dumbbell /> Rekomendasi Bakar Lemak
                             </h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {exercises.map((ex, idx) => (
                                    <div key={ex.id || idx} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-gray-800">{ex.namaKegiatan}</h4>
                                            <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded font-bold">30 mnt</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-4">
                                            Bakar ± <span className="font-bold text-gray-800">{Math.round(ex.caloriesBurnPerMinute * 30)} kkal</span>
                                        </p>
                                        <button 
                                            onClick={() => handleAddLog(ex, 'exercise')}
                                            disabled={addingId === (ex.id || ex.namaKegiatan)}
                                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-2 rounded-xl text-sm font-bold transition-colors flex justify-center items-center gap-2"
                                        >
                                            {addingId === (ex.id || ex.namaKegiatan) ? <Loader2 className="animate-spin" size={16}/> : <PlusCircle size={16}/>}
                                            Mulai Latihan
                                        </button>
                                    </div>
                                ))}
                             </div>
                        </div>
                    )}

                    {/* 4. REKOMENDASI MAKANAN (Jika NEEDS_FOOD atau MAINTAINED) */}
                    {(summary.status === 'NEEDS_FOOD' || summary.status === 'MAINTAINED') && (
                        <div className="mt-8">
                            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                            <h3 className="text-xl font-bold flex items-center gap-2 text-green-700">
                                <ChefHat /> Rekomendasi Menu
                            </h3>
                            
                            {/* TAB KATEGORI */}
                            <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                                {["SARAPAN", "SIANG", "MALAM", "SNACK"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                    activeTab === tab ? "bg-green-100 text-green-700" : "text-gray-500 hover:text-gray-700"
                                    }`}
                                >
                                    {tab}
                                </button>
                                ))}
                            </div>
                            </div>

                            {/* GRID KARTU MAKANAN */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {foods.length > 0 ? (
                                foods.map((food, idx) => (
                                <div key={food.id || idx} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden group">
                                    
                                    {/* Gambar Placeholder */}
                                    <div className="h-40 bg-gray-100 relative overflow-hidden">
                                    <img 
                                        src={`https://source.unsplash.com/400x300/?food,${food.nama}`} 
                                        alt={food.nama}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/400x300?text=Makanan+Sehat'}
                                    />
                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-orange-500 flex items-center gap-1 shadow-sm">
                                        <Flame size={12} fill="currentColor" /> {food.kalori} kkal
                                    </div>
                                    </div>

                                    <div className="p-4">
                                    <h3 className="font-bold text-gray-800 text-lg mb-1 capitalize line-clamp-1">{food.nama}</h3>
                                    <p className="text-xs text-gray-400 mb-4">Per 1 Porsi Standar</p>
                                    
                                    {/* Info Nutrisi */}
                                    <div className="grid grid-cols-3 gap-2 text-center mb-4">
                                        <div className="bg-blue-50 p-2 rounded-lg">
                                            <p className="text-[10px] text-gray-500 uppercase font-bold">Protein</p>
                                            <p className="text-sm font-bold text-blue-600">{food.protein}g</p>
                                        </div>
                                        <div className="bg-yellow-50 p-2 rounded-lg">
                                            <p className="text-[10px] text-gray-500 uppercase font-bold">Carbs</p>
                                            <p className="text-sm font-bold text-yellow-600">{food.carbs}g</p>
                                        </div>
                                        <div className="bg-red-50 p-2 rounded-lg">
                                            <p className="text-[10px] text-gray-500 uppercase font-bold">Fat</p>
                                            <p className="text-sm font-bold text-red-600">{food.fat}g</p>
                                        </div>
                                    </div>

                                    {/* TOMBOL CATAT */}
                                    <button 
                                        onClick={() => handleAddLog(food, 'food')}
                                        disabled={addingId === (food.id || food.nama)}
                                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-green-200 hover:shadow-md"
                                    >
                                        {addingId === (food.id || food.nama) ? (
                                            <> <Loader2 className="animate-spin" size={18} /> Menyimpan... </>
                                        ) : (
                                            <> <PlusCircle size={18} /> Tambahkan ke {activeTab} </>
                                        )}
                                    </button>
                                    </div>
                                </div>
                                ))
                            ) : (
                                <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                                <p className="text-gray-400">Tidak ada rekomendasi makanan saat ini.</p>
                                </div>
                            )}
                            </div>
                        </div>
                    )}
                </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Recommendations;