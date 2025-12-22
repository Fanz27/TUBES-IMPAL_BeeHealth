import React, { useEffect, useState } from "react";
import api  from "../../../api";
import { Utensils, Dumbbell, Activity, AlertCircle, CheckCircle, Sparkles, Bot } from "lucide-react";
// import ReactMarkdown from 'react-markdown'; // Opsional: Install 'npm install react-markdown' jika gemini kirim format list


const Rekomendasi = () => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   useEffect(() => {
//     // ... (fetchRekomendasi tetap sama) ...
//     const fetchRekomendasi = async () => {
//         try {
//           setLoading(true);
//           const res = await api.get("/rekomendasi/");
//           setData(res.data);
//         } catch (err) {
//            setError("Gagal memuat data");
//         } finally {
//            setLoading(false);
//         }
//     };
//     fetchRekomendasi();
//   }, []);

//   const formatStatus = (status) => {
//      // ... (tetap sama) ...
//      if(status === 'NEEDS_FOOD') return 'Butuh Asupan';
//      if(status === 'NEEDS_EXERCISE') return 'Perlu Olahraga';
//      return 'Seimbang';
//   };

//   if (loading) return <div className="text-center py-20">Loading...</div>;
//   if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
//   if (!data?.summary?.target) return <div>Data kosong</div>;

//   const { summary, recommendations } = data;

//   return (
//     <div className="max-w-4xl mx-auto mt-6 p-4 pt-24 font-sans">
//       <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
//         <Activity className="text-green-600" /> Analisis & Rekomendasi
//       </h1>
//       <NutritionistCommentSection summary={data.summary} />

//       {/* Summary Card (Kode Lama Tetap Disini) */}
//       <div className={`p-6 rounded-2xl border mb-8 shadow-sm ${summary.status === 'MAINTAINED' ? 'bg-green-50' : 'bg-gray-50'}`}>
//          {/* ... Isi Summary Card kamu tetap sama ... */}
//          <div className="flex justify-between items-center">
//             <div>
//                 <h2 className="font-bold text-lg">Status: {formatStatus(summary.status)}</h2>
//                 <p className="text-gray-600">Netto: {summary.currentNet} / {summary.target} kkal</p>
//             </div>
//          </div>
//       </div>

//       {/* --- FITUR AI CHATBOT SECTION --- */}
//       <div className="mb-10">
//         <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
//           {/* Dekorasi Background */}
//           <Sparkles className="absolute top-4 right-4 text-blue-300 opacity-50" size={48} />
          
//           <div className="relative z-10">
//             <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
//               <Bot size={24} /> Tanya BeeCoach (AI)
//             </h3>
//             <p className="text-blue-100 mb-4 text-sm max-w-lg">
//               Bingung mau makan apa atau olahraga apa? Minta saran personal dari AI berdasarkan data kalorimu hari ini.
//             </p>

//             {!aiAdvice && !loadingAi && (
//               <button 
//                 onClick={handleAskAI}
//                 className="bg-white text-blue-600 px-5 py-2.5 rounded-full font-bold shadow-md hover:bg-blue-50 transition-transform hover:scale-105 flex items-center gap-2"
//               >
//                 <Sparkles size={18} /> Minta Saran Sekarang
//               </button>
//             )}

//             {loadingAi && (
//               <div className="flex items-center gap-3 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
//                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                 <span className="text-sm font-medium">Sedang menganalisis kebutuhan nutrisimu...</span>
//               </div>
//             )}

//             {aiAdvice && (
//               <div className="mt-4 bg-white/95 text-gray-800 p-5 rounded-xl shadow-lg animate-in fade-in slide-in-from-bottom-4">
//                 <div className="flex items-start gap-3">
//                   <div className="bg-blue-100 p-2 rounded-full mt-1">
//                     <Sparkles size={20} className="text-blue-600" />
//                   </div>
//                   <div className="prose prose-sm max-w-none">
//                     {/* Jika pakai react-markdown */}
//                     {/* <ReactMarkdown>{aiAdvice}</ReactMarkdown> */}
                    
//                     {/* Jika teks biasa */}
//                     <p className="whitespace-pre-line leading-relaxed">{aiAdvice}</p>
//                   </div>
//                 </div>
//                 <button 
//                     onClick={handleAskAI} 
//                     className="mt-4 text-xs text-blue-500 font-bold hover:underline"
//                 >
//                     Refresh Saran
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       {/* -------------------------------- */}

//       {/* Rekomendasi Makanan (Kode Lama) */}
//       {summary.status === "NEEDS_FOOD" && recommendations.food?.length > 0 && (
//          // ... kode map makanan kamu ...
//          <div className="mb-8">
//             <h3 className="font-bold mb-4">Rekomendasi Statis</h3>
//             {/* Grid makanan */}
//          </div>
//       )}

//        {/* Rekomendasi Olahraga (Kode Lama) */}
//        {summary.status === "NEEDS_EXERCISE" && (
//          // ... kode map olahraga kamu ...
//          <div>
//             <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2 border-b pb-2">
//               <Dumbbell className="text-red-500" /> Saran Pembakaran Kalori
//             </h3>
//             <p className="text-sm text-gray-500 mb-4 bg-red-50 p-3 rounded-lg border border-red-100 inline-block">
//               Pilih salah satu aktivitas di bawah ini dan lakukan selama <strong>30 menit</strong> untuk kembali ke target.
//             </p>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {recommendations.exercise.map((item, idx) => (
//                 <div key={idx} className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-all group">
//                   <div className="flex justify-between items-start mb-2">
//                     <h4 className="font-bold text-gray-800 group-hover:text-red-600 transition-colors">
//                       {item.name}
//                     </h4>
//                     <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full">
//                       -{Math.round(item.caloriesBurnPerMinute * 30)} kkal
//                     </span>
//                   </div>
//                   <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
//                     <span>Intensitas: {item.caloriesBurnPerMinute} kal/menit</span>
//                     <Dumbbell size={14} className="opacity-50" />
//                   </div>
//               </div>
//             ))}
//           </div>
//          </div>
//        )}

//     </div>
//   );
 };

export default Rekomendasi;