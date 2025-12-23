import React, { useState } from 'react';
import { ChefHat, Flame, PlusCircle, Filter } from 'lucide-react';

// --- DATA DATABASE MAKANAN (Mockup) ---
// Nanti ini bisa diambil dari API Backend
const foodDatabase = [
  // SARAPAN
  { id: 1, name: "Oatmeal Pisang & Madu", calories: 350, protein: 12, carbs: 60, fat: 6, category: "SARAPAN", goal: "CUTTING", image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=500&q=60" },
  { id: 2, name: "Roti Gandum Telur Orak-arik", calories: 420, protein: 20, carbs: 35, fat: 15, category: "SARAPAN", goal: "BULKING", image: "https://images.unsplash.com/photo-1525351484163-7529414395d8?auto=format&fit=crop&w=500&q=60" },
  
  // MAKAN SIANG
  { id: 3, name: "Dada Ayam Bakar & Sayur", calories: 450, protein: 40, carbs: 10, fat: 12, category: "SIANG", goal: "CUTTING", image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=500&q=60" },
  { id: 4, name: "Nasi Merah & Sapi Lada Hitam", calories: 600, protein: 35, carbs: 70, fat: 18, category: "SIANG", goal: "BULKING", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=500&q=60" },

  // MAKAN MALAM
  { id: 5, name: "Salad Tuna", calories: 300, protein: 25, carbs: 8, fat: 10, category: "MALAM", goal: "CUTTING", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=60" },
  { id: 6, name: "Pasta Aglio Olio Udang", calories: 550, protein: 30, carbs: 65, fat: 20, category: "MALAM", goal: "BULKING", image: "https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&w=500&q=60" },

  // SNACK
  { id: 7, name: "Greek Yogurt & Berries", calories: 150, protein: 15, carbs: 20, fat: 0, category: "SNACK", goal: "CUTTING", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=500&q=60" },
];

const Recommendations = () => {
  const [activeTab, setActiveTab] = useState("SARAPAN");
  const [userGoal, setUserGoal] = useState("ALL"); // Bisa "CUTTING", "BULKING", atau "ALL"

  // Logic Filter Makanan
  const filteredFood = foodDatabase.filter((food) => {
    const matchCategory = food.category === activeTab;
    const matchGoal = userGoal === "ALL" ? true : food.goal === userGoal;
    return matchCategory && matchGoal;
  });

  const handleAddFood = (foodName) => {
    alert(`Berhasil menambahkan ${foodName} ke log harian!`);
    // Disini nanti panggil API ke backend untuk save log
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-bold flex items-center justify-center md:justify-start gap-3 text-green-700">
            <ChefHat size={32} /> Rekomendasi Makanan
          </h1>
          <p className="text-gray-500 mt-2">
            Pilihan menu sehat yang disesuaikan untuk kebutuhan nutrisimu.
          </p>
        </div>

        {/* --- FILTER & CONTROLS --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          
          {/* Tab Kategori Makan */}
          <div className="flex bg-gray-100 p-1 rounded-xl overflow-x-auto w-full md:w-auto">
            {["SARAPAN", "SIANG", "MALAM", "SNACK"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-white text-green-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Dropdown Goal (Opsional) */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select 
              value={userGoal} 
              onChange={(e) => setUserGoal(e.target.value)}
              className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2.5 outline-none"
            >
              <option value="ALL">Semua Tujuan</option>
              <option value="CUTTING">Diet / Cutting</option>
              <option value="BULKING">Otot / Bulking</option>
            </select>
          </div>
        </div>

        {/* --- GRID KARTU MAKANAN --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFood.length > 0 ? (
            filteredFood.map((food) => (
              <div key={food.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden group">
                
                {/* Gambar Makanan */}
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={food.image} 
                    alt={food.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Badge Goal */}
                  <div className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full text-white ${
                    food.goal === 'CUTTING' ? 'bg-orange-500' : 'bg-blue-600'
                  }`}>
                    {food.goal}
                  </div>
                </div>

                {/* Info Makanan */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{food.name}</h3>
                    <div className="flex items-center gap-1 text-orange-500 font-bold text-sm bg-orange-50 px-2 py-1 rounded-md">
                      <Flame size={14} /> {food.calories}
                    </div>
                  </div>

                  {/* Detail Nutrisi */}
                  <div className="grid grid-cols-3 gap-2 mt-4 mb-6 text-center">
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Protein</p>
                      <p className="font-bold text-gray-800">{food.protein}g</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Carbs</p>
                      <p className="font-bold text-gray-800">{food.carbs}g</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Fat</p>
                      <p className="font-bold text-gray-800">{food.fat}g</p>
                    </div>
                  </div>

                  {/* Tombol Add */}
                  <button 
                    onClick={() => handleAddFood(food.name)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <PlusCircle size={18} />
                    Catat Makanan Ini
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-gray-400">
              <p>Tidak ada rekomendasi makanan untuk filter ini.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Recommendations;