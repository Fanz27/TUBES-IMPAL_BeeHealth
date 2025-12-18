import React, { useEffect, useState } from "react";
import api from "../../api";
import { Utensils, Dumbbell, Activity, AlertCircle, CheckCircle } from "lucide-react";

const Rekomendasi = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRekomendasi = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("AuthToken");
        if (!token) throw new Error("Token tidak ditemukan. Silakan login.");

        const response = await api.get("/rekomendasi", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setData(response.data);
      } catch (err) {
        console.error(err);
        const message =
          err.response?.data?.message || err.message || "Terjadi kesalahan saat mengambil rekomendasi.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchRekomendasi();
  }, []);

  const formatStatus = (status) => {
    switch (status) {
      case "NEEDS_FOOD":
        return "Butuh Asupan";
      case "NEEDS_EXERCISE":
        return "Perlu Olahraga";
      case "MAINTAINED":
        return "Seimbang";
      default:
        return status;
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-3xl mx-auto mt-10 p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg text-red-600 p-4 flex items-center gap-2">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      </div>
    );

  if (!data?.summary?.target)
    return (
      <div className="max-w-3xl mx-auto mt-10 p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
        Silakan lakukan perhitungan kalori terlebih dahulu untuk melihat rekomendasi.
      </div>
    );

  const { summary, recommendations } = data;

  return (
    <div className="max-w-4xl mx-auto mt-6 p-4 pt-24 font-sans">
      {/* Header */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Activity className="text-green-600" />
        Analisis & Rekomendasi Harian
      </h1>

      {/* Summary Card */}
      <div
        className={`p-6 rounded-2xl border mb-8 shadow-sm transition-colors duration-300
          ${summary.status === "MAINTAINED" ? "bg-green-50 border-green-200 text-green-900" : ""}
          ${summary.status === "NEEDS_FOOD" ? "bg-yellow-50 border-yellow-200 text-yellow-900" : ""}
          ${summary.status === "NEEDS_EXERCISE" ? "bg-red-50 border-red-200 text-red-900" : ""}
        `}
      >
        <h2 className="font-bold text-lg">Status: {formatStatus(summary.status)}</h2>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-4">
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold mb-2 flex items-center justify-center md:justify-start gap-2">
              {summary.status === "MAINTAINED" && <CheckCircle size={24} className="text-green-600" />}
              {summary.status === "NEEDS_FOOD" && <Utensils size={24} className="text-yellow-600" />}
              {summary.status === "NEEDS_EXERCISE" && <Dumbbell size={24} className="text-red-600" />}
              Status: {formatStatus(summary.status)}
            </h2>
            <p className="text-sm opacity-90 max-w-md">
              {summary.status === "MAINTAINED" &&
                "Target kalori Anda hari ini sudah pas! Pertahankan pola makan ini."}
              {summary.status === "NEEDS_FOOD" &&
                "Energi Anda masih kurang dari target. Tubuh butuh asupan tambahan agar tetap bugar."}
              {summary.status === "NEEDS_EXERCISE" &&
                "Asupan kalori hari ini berlebih. Bakar kelebihan energi dengan olahraga ringan."}
            </p>
          </div>

          {/* Statistik Angka */}
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl flex gap-6 text-center text-gray-700 shadow-sm border border-white/50">
            <div>
              <span className="block text-xs font-bold uppercase text-gray-400 mb-1">Target</span>
              <span className="font-bold text-xl">{summary.target}</span>
            </div>
            <div className="w-px bg-gray-300 h-10 self-center"></div>
            <div>
              <span className="block text-xs font-bold uppercase text-gray-400 mb-1">Netto</span>
              <span className="font-bold text-xl">{summary.currentNet}</span>
            </div>
            <div className="w-px bg-gray-300 h-10 self-center"></div>
            <div>
              <span className="block text-xs font-bold uppercase text-gray-400 mb-1">
                {summary.remaining >= 0 ? "Kurang" : "Lebih"}
              </span>
              <span className={`font-bold text-xl ${summary.remaining < 0 ? "text-red-600" : "text-green-600"}`}>
                {Math.abs(summary.remaining)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Rekomendasi Makanan */}
      {summary.status === "NEEDS_FOOD" && recommendations.food?.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2 border-b pb-2">
            <Utensils className="text-yellow-500" /> Rekomendasi Makanan Penambah Energi
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.food.map((item, idx) => (
              <div key={idx} className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-800 group-hover:text-yellow-600 transition-colors">
                    {item.name}
                  </h4>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">
                    {item.calories} kkal
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2">Porsi: 1 Porsi standar</p>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-yellow-400 h-full"
                    style={{ width: `${Math.min((item.calories / 500) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rekomendasi Olahraga */}
      {summary.status === "NEEDS_EXERCISE" && recommendations.exercise?.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2 border-b pb-2">
            <Dumbbell className="text-red-500" /> Saran Pembakaran Kalori
          </h3>
          <p className="text-sm text-gray-500 mb-4 bg-red-50 p-3 rounded-lg border border-red-100 inline-block">
            Pilih salah satu aktivitas di bawah ini dan lakukan selama <strong>30 menit</strong> untuk kembali ke target.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.exercise.map((item, idx) => (
              <div key={idx} className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-800 group-hover:text-red-600 transition-colors">
                    {item.name}
                  </h4>
                  <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full">
                    -{Math.round(item.caloriesBurnPerMinute * 30)} kkal
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                  <span>Intensitas: {item.caloriesBurnPerMinute} kal/menit</span>
                  <Dumbbell size={14} className="opacity-50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Jika MAINTAINED */}
      {summary.status === "MAINTAINED" && (
        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200 animate-in zoom-in duration-500">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Kerja Bagus!</h3>
          <p className="text-gray-500 max-w-md mx-auto px-4">
            Tidak ada rekomendasi khusus saat ini. Anda telah mencapai keseimbangan kalori yang sempurna. Istirahat yang cukup!
          </p>
        </div>
      )}
    </div>
  );
};

export default Rekomendasi;
