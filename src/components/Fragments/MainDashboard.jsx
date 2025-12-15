import salad2 from "/images/salad2.png";
import makananSehat from "/images/makananSehat.png";
import React, { use, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MainDashboard = (props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading]= useState(true);
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
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  
  return (
    <>
      <section className="container mx-auto py-16 px-4">
        <div className="flex flex-col gap-24">
          {/* Bagian 1 - Text Kiri, Gambar Kanan */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2 text-center md:text-left">
              <h2 className="text-3xl font-bold mb-4">
                Pola Makan Baik Buat Tubuh Sehat
              </h2>
              <p className="text-gray-600">
                Ingin tubuh sehat dan bugar? Sangat tepat anda mengunjungi
                BeeHealth. BeeHealth menyediakan fitur yang anda butuhkan dalam
                mengelola pola makan yang baik.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src={salad2}
                alt="Salad Buah"
                className="w-full max-w-md rounded-lg"
              />
            </div>
          </div>

          {/* Bagian 2 - Gambar Kiri, Text Kanan */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Gambar di sebelah kiri (desktop) */}
            <div className="md:w-1/2 flex justify-center">
              <img
                src={makananSehat}
                alt="Salad Buah 2"
                className="w-full max-w-md rounded-lg"
              />
            </div>
            
            {/* Text di sebelah kanan (desktop) */}
            <div className="md:w-1/2 text-center md:text-left">
              <h2 className="text-3xl font-bold mb-4">
                Catat Lebih dari 10 Juta Makanan
              </h2>
              <p className="text-gray-600">
                Lihat rincian kalori dan bandingkan ukuran porsi serta rasakan apa yang akan terjadi.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto p-8 bg-white">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bagikan Keberhasilanmu dengan orang lain
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Setiap hari, pengguna BeeHealth membagikan keberhasilan mereka dalam menciptakan pola makan yang baik. 
            Dapatkan motivasi mu bersama timeline BeeHealth dan raih tujuanmu.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative bg-gray-50 rounded-2xl p-12 shadow-sm">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors z-10"
            aria-label="Previous story"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors z-10"
            aria-label="Next story"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          {/* Card Content */}
          <div className="flex items-center justify-center gap-8">
            {/* Image */}
            <div className="flex-shrink-0">
              <img
                src={stories[currentIndex].image}
                alt={stories[currentIndex].name}
                className="w-80 h-96 object-cover rounded-2xl shadow-xl"
              />
            </div>

            {/* Story Details */}
            <div className="flex-1 max-w-md">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {stories[currentIndex].name}
                  </h3>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                      {stories[currentIndex].achievement}
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                      {stories[currentIndex].duration}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  {stories[currentIndex].story}
                </p>
                
                <div className="flex gap-3">
                  <Link
                    to="/Timeline"
                    className={`flex-1 text-center bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors ${
                      Aktif('/Timeline') ? 'bg-green-500 text-white' : ''
                    }`}
                  >
                    Bagikan Ceritamu
                  </Link>
                  <Link
                    to="/Timeline"
                    className={`flex-1 text-center bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors ${
                      Aktif('/Timeline') ? 'bg-green-500 text-white' : ''
                    }`}
                  >
                    Lihat Timeline
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {stories.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'w-8 bg-green-500' 
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to story ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MainDashboard;