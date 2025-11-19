import React, { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import axios from "axios";
import { API_URL } from "../../api";

const AddMakanan = () => {
    const [FoodName, setFoodName] = useState([]);
    const [search , setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showMakanan, setShowMakanan] = useState(false);
    const [editMakanan, setEditMakanan] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [currentMakanan, setCurrentMakanan] = useState({
        id: "",
        nama: "",
        kalori: "",
        protein: "",
        carbs: "",
        fat: "",
    });

    useEffect(() => {
        const userRole = localStorage.getItem('role');
        setIsAdmin(userRole === 'admin');
    }, []);

    const fetchMakanan = async () => {
        setLoading(true);
        setError(null);
        try {
            const queryParam = search ? `?search=${encodeURIComponent(search)}` : '';
            const token = localStorage.getItem("AuthToken");

            console.log('Fetching with token:', token ? 'Token exists' : 'No token');
            console.log('URL:', `${API_URL}/food${queryParam}`);

              const response = await fetch(`${API_URL}/food${queryParam}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
              const textResponse = await response.text();
              console.error('Response bukan JSON (first 200 chars):', textResponse.substring(0, 200));
              throw new Error("Response bukan JSON");
            }

            const result = await response.json();
            console.log('API Response:', result);


            if ( response.ok) {
              let  foodData = [];
              if (result.data && Array.isArray(result.data)) {
                foodData = result.data
              } else if (Array.isArray(result)) {
                foodData = result;
              } else if (result.food && Array.isArray(result.food)) {
                foodData = result.food;
              }
              console.log('Setting food data:', foodData);
              setFoodName(foodData);
            } else {
                setError(result.message || "Gagal mengambil data makanan.");
            }
        } catch (err) {
          console.error('Error fetching:', err);
          if (!err.message.includes('ngrok')) {
            setError("Terjadi kesalahan saat mengambil data makanan.");
          }
        } finally {
          setLoading(false);
        }
    };

    useEffect(() => {
        fetchMakanan();
    }, []);

    useEffect(() => {
      if (loading || showMakanan) return;
        const timer = setTimeout(() => {
            fetchMakanan();
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleAddMakanan = () => {
        setCurrentMakanan({
            id: '',
            nama: '',
            kalori: '',
            protein: '',
            carbs: '',
            fat: '',
        });
        setEditMakanan(false);
        setShowMakanan(true);
    };

    const handleEditMakanan = (food) => {
        setCurrentMakanan(food);
        setEditMakanan(true);
        setShowMakanan(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentMakanan((prev) => ({  
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
            console.log('Submitting data:', currentMakanan);

            const url = editMakanan
                ? `${API_URL}/food/${currentMakanan.id}`
                : `${API_URL}/food/`;
            const method = editMakanan ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nama: currentMakanan.nama,
                    kalori: parseFloat(currentMakanan.kalori),
                    protein: parseFloat(currentMakanan.protein),
                    carbs: parseFloat(currentMakanan.carbs),
                    fat: parseFloat(currentMakanan.fat),
                }),
            });
            console.log('Submit response status:', response.status);

            const result = await response.json();
            console.log('Submit API Response:', result);

            if (response.ok) {
                setSuccess(result.message || "Data makanan berhasil disimpan.");
                // setShowMakanan(false);
                if (editMakanan) {
                  setFoodName(prev => prev.map(food => food.id === currentMakanan.id ? currentMakanan : food));
                } else {
                  setFoodName(prev => [result.data, ...prev ]);
                }
                setCurrentMakanan({
                    id: "",
                    nama: "",
                    kalori: "",
                    protein: "",
                    carbs: "",
                    fat: "",
                });
                setShowMakanan(false);
                setEditMakanan(null);
                // setSearch('');
                // await fetchMakanan();
                setTimeout(() => {
                    setSuccess('');
                }, 3000);
            } else {
                setError(result.message || "Gagal menyimpan data makanan.")
            }
        } catch (err) {
          console.error('Submit error:', err);
          setError("Terjadi kesalahan saat menyimpan data makanan di server.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMakanan = async (id, nama) => {
        if (!window.confirm("Apakah anda yakin ingin menghapus makanan" + nama + "?")) return;

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch (`${API_URL}/food/${id}`, {
                method: 'DELETE',
            });
            const result = await response.json();

            if (response.ok) {
                setSuccess(result.message || "Data makanan berhasil di hapus.");
                fetchMakanan();
                setTimeout(() => {
                    setSuccess('');
                }, 3000);
            } else {
                setError(result.message || "Gagal menghapus data makanan.");
            }
        } catch (err) {
            setError("Terjadi kesalahan saat menghapus data makanan di server.")
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
            🍎 Aplikasi Manajemen Makanan
          </h1>
          <p className="text-gray-600">Kelola data nutrisi makanan Anda</p>
        </div>

        {/* Alert Messages */}
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
                placeholder="Cari makanan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleAddMakanan}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Tambah Makanan
            </button>
          </div>
        </div>

        {/* Food List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {loading && !showMakanan ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : FoodName.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Tidak ada data makanan. Silakan tambah data baru.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kalori</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Protein (g)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Carbs (g)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fat (g)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {FoodName.map((food) => (
                    <tr key={food.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{food.nama}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{food.kalori}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{food.protein}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{food.carbs}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{food.fat}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditMakanan(food)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteMakanan(food.id, food.nama)}
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

        {/* Modal Form */}
        {showMakanan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editMakanan ? 'Edit Makanan' : 'Tambah Makanan Baru'}
                  </h2>
                  <button
                    onClick={() => setShowMakanan(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Makanan *
                    </label>
                    <input
                      type="text"
                      name="nama"
                      value={currentMakanan.nama}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kalori *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="kalori"
                      value={currentMakanan.kalori}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Protein (gram) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="protein"
                      value={currentMakanan.protein}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Carbs (gram) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="carbs"
                      value={currentMakanan.carbs}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fat (gram) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="fat"
                      value={currentMakanan.fat}
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
                      onClick={() => setShowMakanan(false)}
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
export default AddMakanan;

