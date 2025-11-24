import React from "react";
import { HeartPulse, Leaf, Calculator } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const About = () => {

    // const locationRoute = useLocation();

    // useEffect(() => {
    //     // Cek apakah ada hash di URL
    //     if (locationRoute.hash) {
    //     const element = document.querySelector(location.hash);
    //     if (element) {
    //         // Smooth scroll ke element
    //         element.scrollIntoView({ 
    //         behavior: 'smooth',
    //         block: 'start'
    //         });
    //     }
    //     }
    // }, [location]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 mt-auto mb-auto">
            <h1 className="text-4xl font-bold mb-6 text-green-700">Tentang BeeHealth</h1>
            <p className="text-lg text-center max-w-3xl mb-8">
                BeeHealth adalah platform sederhana yang membantu kamu menghitung 
                kebutuhan kalori harian serta memberikan rekomendasi makanan yang 
                sehat dan sesuai dengan kebutuhan tubuhmu. Dengan tampilan yang 
                user-friendly, BeeHealth dirancang untuk membuat hidupmu lebih sehat 
                dengan cara yang mudah.
            </p>
           <div className="grid sm:grid-cols-4 gap-6 mt-12">
                <div className="bg-[#D9FBC5] gap-6 rounded-2xl shadow-ml p-6 hover:scale-105 transform transition duration-300">
                    <Calculator className="mx-auto mb-4 text-green-500" size={48} />
                    <h3 className="font-semibold text-lg mb-2">Hitung Kalori</h3>
                    <p className="text-sm text-gray-500">
                        Hitung kebutuhan kalori harianmu dengan mudah berdasaran usia, berat, dan tinggi.
                    </p>
                </div>
                <div className="bg-[#D9FBC5] gap-6 rounded-2xl shadow-ml p-6 hover:scale-105 transform transition duration-300">
                    <Leaf className="mx-auto mb-4 text-green-500" size={48} />
                    <h3 className="font-semibold text-lg mb-2">Rekomendasi</h3>
                    <p className="text-sm text-gray-500">
                        Hitung kebutuhan kalori harianmu dengan mudah berdasaran usia, berat, dan tinggi.
                    </p>
                </div>
                <div className="bg-[#D9FBC5] gap-6 rounded-2xl shadow-ml p-6 hover:scale-105 transform transition duration-300">
                    <Leaf className="mx-auto mb-4 text-green-500" size={48} />
                    <h3 className="font-semibold text-lg mb-2">Timeline</h3>
                    <p className="text-sm text-gray-500">
                        Berbagi pencapaian kesehatanmu dengan orang lain dan dapatkan motivasi.
                    </p>
                </div>
                <div className="bg-[#D9FBC5] gap-6 rounded-2xl shadow-ml p-6 hover:scale-105 transform transition duration-300">
                    <Leaf className="mx-auto mb-4 text-green-500" size={48} />
                    <h3 className="font-semibold text-lg mb-2">Misi BeeHealth</h3>
                    <p className="text-sm text-gray-500">
                        Membuat hidup sehat lebih mudah dan menyenangkan bagi semua orang.
                    </p>
                </div>
           </div>
        </div>
    )
}

export default About;