import React, { useState, useEffect } from 'react';
import api  from "../../../api"; // Sesuaikan path ini jika perlu
import { 
  ChevronLeft, 
  ChevronRight, 
  Utensils, 
  Dumbbell, 
  Plus, 
  X,
  Calendar,
  BookOpen,
  Loader2,
  Trash2 // <--- IMPORT ICON SAMPAH (TRASH)
} from 'lucide-react';

const Notebook = () => {
  // --- STATE ---
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [foodSugestion, setFoodSugestion] = useState([]);
  const [showSuggestion, setShowSugesstion] = useState(false);
  const [exerciseSugesstion, setExerciseSugesstion] = useState([]);
  
  // State Data Log
  const [logs, setLogs] = useState({
    foodLogs: [],
    exerciseLogs: [],
    summary: { totalCaloriesIn: 0, totalCaloriesOut: 0 }
  });

  // State UI
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false); 
  const [error, setError] = useState(null);

  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logType, setLogType] = useState('food'); 

  // State Form Input
  const [formData, setFormData] = useState({
    foodNama: '', 
    mealType: 'MAKAN_SIANG',
    porsi: 1,
    exerciseId: '', 
    exerciseNama: '',
    durationInMinute: 0
  });

  const formatDateForAPI = (date) => date.toISOString().split('T')[0];
  
  const formatDateDisplay = (date) => new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);

  const fetchDailyLogs = async () => {
    setLoading(true);
    try {
      const dateString = formatDateForAPI(selectedDate);
      const response = await api.get('/log/daily', { params: { date: dateString } });
      console.log("response data daily logs:", response.data);

      const safeSummary = response.data.summary || { totalCaloriesIn: 0, totalCaloriesOut: 0 };
      
      setLogs({
        foodLogs: response.data.foodLogs || [],
        exerciseLogs: response.data.exerciseLogs || [],
        summary: safeSummary
      });
      setError(null);
    } catch (err) {
      console.error("DEBUG Fetch Error:", err);
      const msg = err.response?.data?.message || "Gagal memuat data notebook. Pastikan server berjalan.";
      setError(msg);

      if (err.response?.status === 401) {
          alert("Sesi kamu habis. Silakan login ulang.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- FUNGSI SEARCH & SELECT ---
  const handleFoodSearch = async (text) => {
    setFormData(prev => ({ ...prev, foodNama: text}));

    if (!text || text.length < 0) {
      setFoodSugestion([]);
      setShowSugesstion(false);
      return;
    }

    try {
      const response = await api.get(`/food/search?query=${text}`);
      setFoodSugestion(response.data.data);
      setShowSugesstion(true);
    } catch (err) {
      console.log("Gagal mencari saran makanan", err);
    }
  };

  const selectSugesstionFood = (food) => {
    setFormData(prev => ({
      ...prev,
      foodNama: food.nama,
    }));
    setFoodSugestion([]);
    setShowSugesstion(false);
  };
  
  const handleExerciseSearch = async (text) => {
    setFormData(prev => ({ ...prev, namaKegiatan: text}));
    
    if (!text || text.length < 1) {
      setExerciseSugesstion([]);
      setShowSugesstion(false);
      return;
    }
    
    try {
      const response = await api.get(`/exercise`);
      setExerciseSugesstion(response.data.data);
      setShowSugesstion(true);
    } catch (err) {
      console.log("Gagal mencari saran olahraga", err);
    }
  }
  
  const selectSugesstionExercise = (exercise) => {
    setFormData(prev => ({
      ...prev,
      namaKegiatan: exercise.namaKegiatan,
      exerciseId: exercise.exerciseId || exercise.id,
    }));
    setExerciseSugesstion([]);
    setShowSugesstion(false);
  };

  // --- FUNGSI DELETE (BARU) ---
  const handleDeleteLog = async (id, type) => {
    if (!confirm(`Yakin ingin menghapus catatan ${type === 'food' ? 'makanan' : 'olahraga'} ini?`)) return;

    try {
        const endpoint = type === 'food' ? `/log/food/${id}` : `/log/exercise/${id}`;
        
        await api.delete(endpoint);
        
        // Refresh data setelah berhasil dihapus
        fetchDailyLogs(); 
        // alert("Berhasil menghapus data."); // Opsional: Tampilkan alert

    } catch (err) {
        console.error("Gagal hapus:", err);
        const msg = err.response?.data?.message || "Gagal menghapus data.";
        alert(msg);
    }
  };

  // --- SUBMIT FORM ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (logType === 'food' && !formData.foodNama) {
        alert("Mohon isi Nama Makanan!");
        return;
    }
    if (logType === 'exercise' && !formData.namaKegiatan) {
        alert("Mohon isi nama Olahraga!");
        return;
    }

    setSubmitLoading(true);

    try {
      if (logType === 'food') {
        await api.post('/log/food', {
          foodNama: formData.foodNama,
          mealType: formData.mealType,
          porsi: parseFloat(formData.porsi),
          tanggal: formatDateForAPI(selectedDate)
        });
      } else {
        await api.post('/log/exercise', {
          userId: localStorage.getItem("userId"),
          exerciseId: formData.exerciseId,
          namaKegiatan: formData.namaKegiatan,
          durationInMinute: parseInt(formData.durationInMinute),
          tanggal: formatDateForAPI(selectedDate)
        });
      }

      setIsModalOpen(false);
      fetchDailyLogs(); 
      
      setFormData({
        foodNama: '', 
        mealType: 'MAKAN_SIANG',
        porsi: 1,
        exerciseId: '',
        exerciseNama: 'Basket', 
        durationInMinute: 30
      });
      
      alert('Berhasil menyimpan catatan!');

    } catch (err) {
      console.error("DEBUG Submit Error:", err);
      const serverMsg = err.response?.data?.message || err.response?.data?.error;
      const status = err.response?.status;

      if (serverMsg) {
        alert(`Gagal: ${serverMsg}`);
      } else if (status === 400) {
        alert("Gagal: Data tidak valid. Cek apakah Nama Makanan/Olahraga benar ada di database.");
      } else if (status === 500) {
        alert("Gagal: Terjadi kesalahan pada Server (Internal Server Error).");
      } else {
        alert("Gagal menyimpan. Periksa koneksi internet atau server.");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value
    }));
  };

  useEffect(() => {
    setLogs({
      foodLogs: [],
      exerciseLogs: [],
      summary: { totalCaloriesIn: 0, totalCaloriesOut:0 }
    })
    fetchDailyLogs(selectedDate);
  }, [selectedDate]);

  const calculatedSummary = () => {
    const totalIn = logs.foodLogs.reduce((total, log) => {
      const kalori = log.food?.kalori || 0;
      const porsi = log.porsi || 0;
      return total + (kalori * porsi);
    }, 0);

    const totalOut = logs.exerciseLogs.reduce((total, log) => {
      const kaloriPerMenit = log.exercise?.caloriesBurnPerMinute || 0;
      const durasi = log.durationInMinutes || 0;
      return total + (kaloriPerMenit * durasi);
    }, 0);

    return { totalIn, totalOut };
  };

  const { totalIn, totalOut } = calculatedSummary();

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-4 md:p-8 pt-32 font-sans text-gray-800">
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
              {totalIn}
            </p>
          </div>
          
          <div className="space-y-1 border-x border-gray-100">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">Netto</p>
            <p className="text-3xl font-extrabold text-gray-800">
              {totalIn - totalOut}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">Terbakar</p>
            <p className="text-2xl font-bold text-orange-500">
              {totalOut}
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
                    <div key={log.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex justify-between items-center group">
                      <div>
                        <p className="font-bold text-gray-800">{log.food?.nama || 'Unknown Food'}</p>
                        <div className="flex gap-2 mt-1">
                            <span className="text-[10px] uppercase font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                                {log.mealType}
                            </span>
                            <span className="text-xs text-gray-500">{log.porsi} porsi</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                         <div className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-lg text-sm">
                           +{log.food ? (log.food.kalori * log.porsi) : 0}
                         </div>
                         
                         {/* TOMBOL DELETE MAKANAN */}
                         <button 
                            onClick={() => handleDeleteLog(log.id, 'food')}
                            className="text-gray-300 hover:text-red-500 transition-colors p-1"
                            title="Hapus Makanan"
                         >
                            <Trash2 size={18} />
                         </button>
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
                    <div key={log.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex justify-between items-center group">
                      <div>
                        <p className="font-bold text-gray-800">
                          {log.exercise?.namaKegiatan ||  'Unknown Exercise'}
                        </p>
                        
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          ⏱ {log.durationInMinutes} menit
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                         <div className="text-orange-500 font-bold bg-orange-50 px-3 py-1 rounded-lg text-sm">
                           - {Math.round(
                               (log.exercise?.kaloriTerbakarPerMenit || log.exercise?.caloriesBurnPerMinute || 0) * log.durationInMinutes
                             )} kkal
                         </div>

                         {/* TOMBOL DELETE OLAHRAGA */}
                         <button 
                            onClick={() => handleDeleteLog(log.id, 'exercise')}
                            className="text-gray-300 hover:text-red-500 transition-colors p-1"
                            title="Hapus Olahraga"
                         >
                            <Trash2 size={18} />
                         </button>
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
                  <div className='relative'>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Makanan</label>
                    <input 
                      type="text" 
                      name="foodNama"
                      value={formData.foodNama}
                      onChange={(e) => handleFoodSearch(e.target.value)}
                      onBlur={() => setTimeout(() => setShowSugesstion(false), 200)}
                      placeholder="Cth: Bakso"
                      className="w-full border border-gray-200 bg-gray-50 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all"
                      required
                      autoComplete='off'
                    />
                    {showSuggestion && foodSugestion.length > 0 && (
                      <div className="absolute z-10 w-full bg-white border-border-gray-200 rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto">
                        {foodSugestion.map((food) => (
                          <div 
                            key={food.id}
                            onClick={() => selectSugesstionFood(food)}
                            className="p-3 hover:bg-green-500 cursor-pointer border-b border-gray-50 last:border-0"
                          >
                            <p className="font-bold text-sm text-gray-500">{food.nama}</p>
                            <p className="text-xs text-gray-400">{food.kalori} kkal / porsi</p>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-[10px] text-gray-400 mt-1">Ketik untuk mencari saran nama makanan</p>
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
                    <div className="relative">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Olahraga</label>
                      <input 
                        type="text" 
                        name="exerciseNama"
                        value={formData.namaKegiatan || ""}
                        onChange={(e) => handleExerciseSearch(e.target.value)}
                        onBlur={() => setTimeout(() => setShowSugesstion(false), 200)} 
                        placeholder="Cth: Basket"
                        className="w-full border border-gray-200 bg-gray-50 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all"
                        required
                        autoComplete='off'
                      />
                      {showSuggestion && exerciseSugesstion.length > 0 && (
                        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto">
                            {exerciseSugesstion.map((exercise) => ( 
                                <div 
                                    key={exercise.id}
                                    onClick={() => selectSugesstionExercise(exercise)}
                                    className="p-3 hover:bg-green-50 cursor-pointer border-b border-gray-50 last:border-0"
                                >
                                    <p className="font-bold text-sm text-gray-700">{exercise.namaKegiatan}</p>
                                    <p className="text-xs text-gray-400">
                                        {exercise.caloriesBurnPerMinute} kkal / menit
                                    </p>
                                </div>
                            ))}
                        </div>
                      )}
                      <p className="text-[10px] text-gray-400 mt-1">Ketuk untuk mencari saran nama olahraga</p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Durasi (Menit)</label>
                      <input 
                        type="number" 
                        name="durationInMinute"
                        min="1"
                        value={formData.durationInMinute || ""}
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