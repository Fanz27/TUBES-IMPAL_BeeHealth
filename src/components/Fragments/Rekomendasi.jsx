// import React, {useEffect, useState} from "react";
// import api from "../../api";
// import ChatbotCalories from "./ChatBotCalories";

// const Rekomendasi = () => {
//     const [rekomendasi, setRekomendasi] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [kaloriMasukan, setKaloriMasukan] = useState(0);
//     const [kaloriTarget, setKaloriTarget] = useState(0);
    

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         setRekomendasi([]);
//         setLoading(true);
//         setError(null);

//     };
    
//     return (
//         <>
//         <div>Rekomendasi</div>
//         <ChatbotCalories />
//         </>
//     )
// }

// export default Rekomendasi;

import React, { useState } from "react";
import ChatbotCalories from "./ChatBotCalories";
import api, { API_URL } from "../../api";

const Rekomendasi = () => {
  const [kaloriMasukan, setKaloriMasukan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rekomendasiList, setRekomendasiList] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRekomendasiList([]);

    try {
      const res = await fetch(`${API_URL}/users/rekomendasi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kalori: Number(kaloriMasukan) }),
      });

      const data = await res.json();
      setRekomendasiList(data.rekom);

    } catch (err) {
      setError("Gagal mengambil rekomendasi");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 p-4">

      <h1 className="text-3xl font-bold text-center mb-6">
        Rekomendasi Makanan 🍱
      </h1>

      {/* Form Input Kalori */}
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          className="w-full p-3 border rounded-lg mb-3"
          type="number"
          placeholder="Masukkan target kalori harian..."
          value={kaloriMasukan}
          onChange={(e) => setKaloriMasukan(e.target.value)}
        />

        <button
          type="submit"
          className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Cari Rekomendasi
        </button>
      </form>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {/* Hasil Rekomendasi */}
      <div className="grid grid-cols-1 gap-4">
        {rekomendasiList.map((item, index) => (
          <div key={index} className="p-4 border rounded-lg shadow-md bg-white">
            <h3 className="font-semibold text-lg">{item.nama}</h3>
            <p>Kalori: {item.kalori}</p>
            <p>Waktu: {item.waktu}</p>
          </div>
        ))}
      </div>

      {/* Chatbot
      <div className="mt-10">
        <ChatbotCalories />
      </div> */}

    </div>
  );
};

export default Rekomendasi;
