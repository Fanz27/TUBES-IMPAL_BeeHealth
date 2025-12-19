import React, { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'ngrok-skip-browser-warning': 'true', // Penting untuk ngrok
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("AuthToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const baseUrl = import.meta.env.VITE_API_URL;

const AddOlahraga = () => {
    // State untuk menampung list olahraga
    const [exerciseList, setExerciseList] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    
    // State untuk kontrol modal form
    const [showOlahraga, setShowOlahraga] = useState(false);
    const [editOlahraga, setEditOlahraga] = useState(null); // bernilai boolean atau id
    
    // State untuk form input
    const [currentOlahraga, setCurrentOlahraga] = useState({
        id: "",
        namaKegiatan: "",
        caloriesBurnPerMinute: ""
    });

    // Fetch data saat komponen dimuat
    useEffect(() => {
        fetchOlahraga();
    }, []);

    // Fetch data saat pencarian berubah (debounce)
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchOlahraga();
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchOlahraga = async () => {
        setLoading(true);
        setError(null);

        try {
            const queryParam = search ? `?search=${encodeURIComponent(search)}` : '';
            // Pastikan endpoint sesuai dengan backend Anda
            const response = await api.get(`/exercise${queryParam}`);
            
            // Penyesuaian struktur response sesuai backend (bisa berbeda-beda)
            const result = response.data;
            
            if (response.status === 200) {
                let dataKegiatan = [];
                // Cek berbagai kemungkinan struktur response
                if (result.data && Array.isArray(result.data)) {
                    dataKegiatan = result.data;
                } else if (Array.isArray(result)) {
                    dataKegiatan = result;
                } else if (result.exercise && Array.isArray(result.exercise)) {
                    dataKegiatan = result.exercise;
                }
                setExerciseList(dataKegiatan);
            } else {
                setError(result.message || "Gagal mengambil data olahraga.");
            }
        } catch (err) {
            console.error('Error fetching:', err);
            setError("Terjadi kesalahan saat mengambil data olahraga.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddOlahraga = () => {
        const role = localStorage.getItem('role');
        if (role !== "ADMIN") {
            setError("Hanya admin yang dapat menambah olahraga.");
            setTimeout(() => setError(null), 3000);
            return;
        }
        setCurrentOlahraga({
            id: '',
            namaKegiatan: '',
            caloriesBurnPerMinute: ''
        });
        setEditOlahraga(false);
        setShowOlahraga(true);
    };

    const handleEditOlahraga = (exercise) => {
        const role = localStorage.getItem('role');
        if (role !== "ADMIN") {
            setError("Hanya admin yang dapat mengedit olahraga.");
            setTimeout(() => setError(null), 3000);
            return;
        }
        setCurrentOlahraga({
            id: exercise.id,
            namaKegiatan: exercise.namaKegiatan,
            caloriesBurnPerMinute: exercise.caloriesBurnPerMinute
        });
        setEditOlahraga(true);
        setShowOlahraga(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentOlahraga((prev) => ({  
            ...prev, 
            [name]: value 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem("AuthToken");
            if (!token) {
                setError("Silahkan login kembali.");
                setLoading(false);
                return;
            }

            const url = editOlahraga
                ? `${baseUrl}/exercise/${currentOlahraga.id}`
                : `${baseUrl}/exercise`;
            
            const method = editOlahraga ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    namaKegiatan: currentOlahraga.namaKegiatan,
                    caloriesBurnPerMinute: parseFloat(currentOlahraga.caloriesBurnPerMinute),
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setSuccess(result.message || "Data olahraga berhasil disimpan.");
                
                // Update state lokal tanpa fetch ulang agar lebih cepat
                if (editOlahraga) {
                    setExerciseList(prev => prev.map(item => item.id === currentOlahraga.id ? { ...item, ...currentOlahraga } : item));
                } else {
                    // Jika backend mengembalikan data yang baru dibuat di result.data
                    const newData = result.data || { ...currentOlahraga, id: result.id || Math.random() }; 
                    setExerciseList(prev => [newData, ...prev]);
                }

                setCurrentOlahraga({
                    id: "",
                    namaKegiatan: "",
                    caloriesBurnPerMinute: "",
                });
                setShowOlahraga(false);
                setEditOlahraga(null);
                setTimeout(() => {
                    setSuccess('');
                    fetchOlahraga(); // Refresh data untuk memastikan sinkronisasi
                }, 1500);
            } else {
                setError(result.message || "Gagal menyimpan data olahraga.");
            }
        } catch (err) {
            console.error('Submit error:', err);
            setError("Terjadi kesalahan saat menyimpan data olahraga di server.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteOlahraga = async (id, namaKegiatan) => {
        if (!window.confirm("Apakah anda yakin ingin menghapus kegiatan " + namaKegiatan + "?")) return;

        setLoading(true);
        setError('');
        setSuccess('');

        const role = localStorage.getItem('role');
        if (role !== "ADMIN") {
            setError("Hanya admin yang dapat menghapus olahraga.");
            setLoading(false);
            return;
        }

        try {
            // Perhatikan endpoint delete, apakah menggunakan ID atau Nama
            // Jika backend menggunakan ID: `/exercise/${id}`
            // Jika backend menggunakan Nama: `/exercise/${encodeURIComponent(namaKegiatan)}`
            // Di sini saya asumsikan menggunakan ID agar lebih aman, jika error ganti ke namaKegiatan
            const response = await api.delete(`/exercise/${id}`); 

            if (response.status === 200) {
                setSuccess(response.data.message || "Data olahraga berhasil dihapus.");
                setExerciseList(prev => prev.filter(item => item.id !== id));
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError("Gagal menghapus data olahraga.");
            }
        } catch (err) {
            console.error('Delete error:', err);
            // Fallback jika delete by ID gagal, coba delete by nama (sesuai kode lama Anda)
            try {
                 await api.delete(`/exercise/${encodeURIComponent(namaKegiatan)}`);
                 setSuccess("Data olahraga berhasil dihapus.");
                 setExerciseList(prev => prev.filter(item => item.namaKegiatan !== namaKegiatan));
                 setTimeout(() => setSuccess(''), 3000);
            } catch (e) {
                setError("Terjadi kesalahan saat menghapus data olahraga di server.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        🏃 Aplikasi Manajemen Olahraga
                    </h1>
                    <p className="text-gray-600">Kelola data jenis kegiatan olahraga dan kalori</p>
                </div>

                {/* Notifikasi Error/Success */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {success}
                    </div>
                )}

                {/* Search & Add Button */}
                <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Cari kegiatan olahraga..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            onClick={handleAddOlahraga}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Plus size={20} />
                            Tambah Olahraga
                        </button>
                    </div>
                </div>

                {/* Table Data */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {loading && !showOlahraga && exerciseList.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">Loading...</div>
                    ) : exerciseList.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            Tidak ada data olahraga. Silakan tambah data baru.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Kegiatan</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kalori Bakar / Menit</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {exerciseList.map((exercise) => (
                                        <tr key={exercise.id || Math.random()} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{exercise.namaKegiatan}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{exercise.caloriesBurnPerMinute} kkal</td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEditOlahraga(exercise)}
                                                        className="text-blue-600 hover:text-blue-800 transition-colors"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteOlahraga(exercise.id, exercise.namaKegiatan)}
                                                        className="text-red-600 hover:text-red-800 transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Modal Form Tambah/Edit */}
                {showOlahraga && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {editOlahraga ? 'Edit Olahraga' : 'Tambah Olahraga Baru'}
                                    </h2>
                                    <button
                                        onClick={() => setShowOlahraga(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nama Kegiatan *
                                        </label>
                                        <input
                                            type="text"
                                            name="namaKegiatan"
                                            placeholder="Contoh: Lari, Berenang"
                                            value={currentOlahraga.namaKegiatan}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Kalori Terbakar per Menit *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            name="caloriesBurnPerMinute"
                                            placeholder="Contoh: 10.5"
                                            value={currentOlahraga.caloriesBurnPerMinute}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            onClick={handleSubmit}
                                            disabled={loading}
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <Save size={20} />
                                            {loading ? 'Menyimpan...' : 'Simpan'}
                                        </button>
                                        <button
                                            onClick={() => setShowOlahraga(false)}
                                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AddOlahraga;