import salad2 from "/images/salad2.png";
import makananSehat from "/images/makananSehat.png";
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MainDashboard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const Aktif = (path) => location.pathname === path;
  
  const stories = [
    {
      id: 1,
      name: "Ahmad Rizki",
      image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=500&fit=crop",
      story: "Berhasil menurunkan berat badan 15kg dalam 3 bulan! BeeHealth membantu saya konsisten dengan pola makan sehat dan olahraga teratur.",
      achievement: "Turun 15kg",
      duration: "3 bulan"
    },
    {
      id: 2,
      name: "Siti Nurhaliza",
      image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=500&fit=crop",
      story: "Dari yang awalnya susah bangun pagi, sekarang saya rutin jogging setiap hari. Timeline BeeHealth sangat memotivasi!",
      achievement: "Rutin Olahraga",
      duration: "2 bulan"
    },
    {
      id: 3,
      name: "Budi Santoso",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&h=500&fit=crop",
      story: "Kolesterol saya turun drastis setelah mengikuti meal plan dari BeeHealth. Dokter juga memuji progress saya!",
      achievement: "Kolesterol Normal",
      duration: "4 bulan"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
                <span className="ml-3 text-green-700 font-semibold">Memuat Home BeeHealth...</span>
            </div>
        );
    }

  return (
    // WRAPPER UTAMA: Menggunakan max-w-7xl agar lurus dengan Navbar & Footer
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-20">
      
      {/* SECTION 1: FITUR */}
      <section className="flex flex-col gap-16">
        {/* Fitur 1 */}
        <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-16">
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Pola Makan Baik Buat Tubuh Sehat
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Ingin tubuh sehat dan bugar? Sangat tepat anda mengunjungi
              BeeHealth. BeeHealth menyediakan fitur yang anda butuhkan dalam
              mengelola pola makan yang baik.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src={salad2}
              alt="Salad Buah"
              className="w-full max-w-sm rounded-2xl shadow-lg object-cover"
            />
          </div>
        </div>

        {/* Fitur 2 */}
        <div className="flex flex-col-reverse md:flex-row items-center gap-8 lg:gap-16">
          <div className="md:w-1/2 flex justify-center">
            <img
              src={makananSehat}
              alt="Makanan Sehat"
              className="w-full max-w-sm rounded-2xl shadow-lg object-cover"
            />
          </div>
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Catat Lebih dari 10 Juta Makanan
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Lihat rincian kalori dan bandingkan ukuran porsi serta rasakan apa yang akan terjadi pada tubuhmu.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: TESTIMONI (Carousel) */}
      <section className="bg-white rounded-3xl p-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Bagikan Keberhasilanmu dengan orang lain
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Setiap hari, pengguna BeeHealth membagikan Keberhasilan mereka dalam menciptakan pola makan yang baik.
            Dapatkan motivasi mu bersama timeline BeeHealth dan raih tujuanmu.
          </p>
        </div>

        <div className="relative bg-green-50/50 rounded-3xl p-6 md:p-12 border border-green-100">
          {/* Tombol Navigasi */}
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-green-500 hover:text-white transition-all z-10 border border-gray-100"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-green-500 hover:text-white transition-all z-10 border border-gray-100"
          >
            <ChevronRight size={24} />
          </button>

          {/* Konten Card */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
            {/* Foto */}
            <div className="flex-shrink-0">
              <img
                src={stories[currentIndex].image}
                alt={stories[currentIndex].name}
                className="w-48 h-64 md:w-60 md:h-72 object-cover rounded-2xl shadow-xl border-4 border-white"
              />
            </div>

            {/* Teks */}
            <div className="max-w-lg text-center md:text-left">
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {stories[currentIndex].name}
                </h3>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                    {stories[currentIndex].achievement}
                  </span>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                    {stories[currentIndex].duration}
                  </span>
                </div>
              </div>
              
              <blockquote className="text-gray-700 text-lg leading-relaxed mb-8 italic">
                "{stories[currentIndex].story}"
              </blockquote>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Link
                  to="/Timeline"
                  className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-sm ${
                    Aktif('/Timeline') ? 'bg-green-600 text-white' : 'bg-green-500 text-white hover:bg-green-600 hover:shadow-md'
                  }`}
                >
                  Bagikan Cerita
                </Link>
                <Link
                  to="/Timeline"
                  className="px-6 py-3 rounded-xl font-semibold bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                >
                  Lihat Timeline
                </Link>
              </div>
            </div>
          </div>

          {/* Indikator Titik */}
          <div className="flex justify-center gap-2 mt-8">
            {stories.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'w-8 bg-green-500' : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainDashboard;