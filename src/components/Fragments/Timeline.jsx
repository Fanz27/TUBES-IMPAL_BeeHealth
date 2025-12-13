import React, { useEffect, useState } from 'react';
import { Flame, Heart, MessageCircle, ChevronDown, Plus, Utensils, Flag, X } from 'lucide-react';

// Jika file '../../api' belum ada, gunakan URL dummy ini agar tidak error saat testing:
// const API_URL = "http://localhost:3000"; 
import api, { API_URL } from '../../api'; 

const Timeline = () => {
    // --- STATE ---
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // State untuk Modal Create Post
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPostContent, setNewPostContent] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const [userData, setUserData] = useState({
        streakCount: 5, 
        username: 'Arif',
        userImage: 'https://i.pravatar.cc/150?img=12',
        calories: 1641,
        targetCalories: 2000,
        consumed: 1641,
        target: 1412
    });

    // Mock Data untuk Meal
    const meals = [
        { name: "Sarapan", calories: 506, items: [
            { name: "Bubur Ayam", portion: "1 porsi", cal: 376 },
            { name: "Tahu Isi", portion: "1 porsi", cal: 174 }
        ]},
        { name: "Makan Siang", calories: 506, items: [] },
        { name: "Makan Malam", calories: 506, items: [] },
        { name: "Kudapan", calories: 506, items: [] },
        { name: "Kudapan", calories: 506, items: [] },
    ];

    const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const streakData = [true, true, true, true, true, false, false];

    // State Expand Meal
    const [expandMeals, setExpandMeals] = useState({0: true});

    useEffect(() => {
        fetchPosts();
    }, []);

    // --- FETCH DATA ---
    const fetchPosts = async () => {
        try {
            setLoading(true);
            
            // Mock Data Fallback (Data awal agar layar tidak kosong)
            const mockPosts = [
                {
                    id: 1,
                    username: "Budiono Siregar bin kapal lawd",
                    userImage: "https://i.pravatar.cc/150?img=11",
                    content: "menu makan hari ke-3. cuman nasi sama ayam aja hehe😁",
                    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop",
                    likes: 12,
                    liked: false,
                    isLikedByYou: true
                }
            ];
            setPosts(mockPosts);

            // Fetch dari API
            if (API_URL) {
                const response = await fetch(`${API_URL}/posts`); 
                if (response.ok) {
                    const data = await response.json();
                    setPosts(data);
                }
            }
        } catch (err) {
            console.error("Error fetching posts:", err);
        } finally {
            setLoading(false);
        }
    }

    // --- CREATE POST LOGIC ---
    const handleCreatePost = async () => {
        if (!newPostContent.trim()) return;

        setIsCreating(true);
        try {
            const payload = {
                username: userData.username,
                userImage: userData.userImage,
                content: newPostContent,
                // Gambar random simulasi
                image: `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60`, 
                likes: 0,
                liked: false
            };

            // Coba kirim ke backend
            let savedPost = null;
            try {
                const response = await fetch(`${API_URL}/posts`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                if (response.ok) {
                    savedPost = await response.json();
                }
            } catch (apiError) {
                console.warn("API tidak tersedia, menggunakan simulasi lokal.");
            }

            // Jika API gagal atau tidak ada, gunakan simulasi lokal (agar UI tetap jalan)
            if (!savedPost) {
                savedPost = { ...payload, id: Date.now() };
            }

            // Update State (UI langsung berubah)
            setPosts([savedPost, ...posts]);

            // Reset Form & Tutup Modal
            setNewPostContent("");
            setIsModalOpen(false);

        } catch (error) {
            console.error("Error creating post:", error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleLike = (id) => {
        setPosts(posts.map(p => p.id === id ? { ...p, liked: !p.liked } : p));
    };

    const toggleMeal = (index) => {
        setExpandMeals((prev) => ({
            ...prev,
            [index]: !prev[index]
        }))
    }
    console.log("jwj")

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans relative">
            <div className='max-w-7xl mx-auto px-4 py-8'>
                
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6 lg:ml-[26%] lg:w-[74%] pl-4">
                    <button className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm text-gray-700 font-medium hover:bg-gray-50">
                        <span>Following</span>
                        <ChevronDown size={16} />
                    </button>
                    
                    {/* --- TOMBOL CREATE POST (YANG DIPERBAIKI) --- */}
                    {/* Perhatikan onClick di bawah ini memanggil setIsModalOpen, BUKAN alert() */}
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center space-x-2 bg-[#FDE68A] text-yellow-800 px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-[#FCD34D] transition-colors"
                    >
                        <Plus size={18} />
                        <span>Create Post</span>
                    </button>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
                    
                    {/* --- LEFT SIDEBAR (Streak & Calories) --- */}
                    <div className='lg:col-span-3 space-y-6'>
                        
                        {/* 1. Streak Card */}
                        <div className='bg-white rounded-2xl shadow-sm p-6 border border-gray-100'>
                            <div className='flex flex-col items-center text-center'>
                                <div className="relative mb-2">
                                    <div className="text-orange-500">
                                        <Flame size={48} strokeWidth={1.5} />
                                    </div>
                                    <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-4 text-3xl font-bold text-gray-800">
                                        {userData.streakCount}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-700">Streak Counts</h3>
                                <p className="text-xs text-gray-400 mb-6">You are doing great, {userData.username}!</p>
                                
                                <div className="flex justify-between w-full px-1">
                                    {weekDays.map((day, index) => (
                                        <div className="flex flex-col items-center gap-2" key={index}>
                                            <span className="text-xs font-medium text-gray-400">{day}</span>
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] border
                                                ${streakData[index] 
                                                    ? 'bg-orange-500 border-orange-500 text-white' 
                                                    : 'bg-white border-gray-200 text-transparent'
                                                }`}>
                                                {streakData[index] && '✓'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 2. Calories Target Card */}
                        <div className='bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex items-center space-x-4'>
                            <div className="relative w-20 h-20 flex-shrink-0">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="40" cy="40" r="32" stroke="#FEF3C7" strokeWidth="8" fill="transparent" />
                                    <circle cx="40" cy="40" r="32" stroke="#F59E0B" strokeWidth="8" fill="transparent" 
                                            strokeDasharray={200} strokeDashoffset={200 - (200 * 0.75)} strokeLinecap="round" />
                                </svg>
                                <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                                    <span className="text-lg font-bold text-gray-800">{userData.calories}</span>
                                    <span className="text-[9px] text-gray-400">Di Atas</span>
                                </div>
                            </div>
                            <div className="flex flex-col space-y-3">
                                <div className="flex items-center space-x-2">
                                    <Flag size={16} className="text-gray-400"/>
                                    <div>
                                        <p className="text-[10px] text-gray-400">Sasaran Kalori</p>
                                        <p className="text-xs font-bold text-gray-600">{userData.target}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Utensils size={16} className="text-yellow-400"/>
                                    <div>
                                        <p className="text-[10px] text-gray-400">Makanan</p>
                                        <p className="text-xs font-bold text-gray-600">{userData.consumed}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Meals List Card */}
                        <div className='bg-white rounded-2xl shadow-sm p-5 border border-gray-100'>
                            <h3 className="text-sm font-bold text-gray-600 mb-4 text-center">Hari ini</h3>
                            
                            <div className="flex justify-between items-center text-xs font-semibold text-gray-500 border-b pb-2 mb-2">
                                <span>Sasaran Kalori</span>
                                <span>{userData.target}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-semibold text-gray-500 border-b pb-4 mb-4">
                                <span>Makanan</span>
                                <span>{userData.consumed}</span>
                            </div>

                            <div className="space-y-4">
                                {meals.map((meal, idx) => (
                                    <div key={idx} className="border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                                        <div className="flex justify-between items-center mb-1 cursor-pointer select-none" 
                                            onClick={() => toggleMeal(idx)}>
                                                <span className="text-sm font-bold text-gray-700">{meal.name}</span>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm font-bold text-gray-700">{meal.calories}</span>
                                                    <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${expandMeals[idx] ? 'rotate-180' : ''}`} />
                                                </div>
                                        </div>
                                        {/* Sub Items */}
                                        {expandMeals[idx] && meal.items.length > 0 && (
                                            <div className="pl-1 space-y-1 mt-1">
                                                {meal.items.map((item, i) => (
                                                    <div key={i} className="flex justify-between text-[10px] text-gray-500">
                                                        <div className="flex flex-col">
                                                            <span className="text-blue-400 font-medium">{item.name}</span>
                                                            <span className="text-gray-400">{item.portion}</span>
                                                        </div>
                                                        <span>{item.cal}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Warning Banner */}
                            <div className="mt-4 bg-red-100 text-red-500 text-[10px] font-medium py-2 px-3 rounded-lg text-center flex items-center justify-center gap-2">
                                <span>📌</span> Kalori harian kamu melebihi batas!
                            </div>
                        </div>
                    </div>

                    {/* --- MAIN FEED (CENTER) --- */}
                    <div className="lg:col-span-9 space-y-6">
                        {loading && posts.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">Loading posts...</div>
                        ) : (
                            posts.map((post) => (
                                <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    {/* Image */}
                                    <div className="w-full h-80 bg-gray-200 relative">
                                        <img src={post.image} alt="Post" className="w-full h-full object-cover" />
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-4">
                                        {/* User Info */}
                                        <div className="flex items-center space-x-3 mb-3">
                                            <img src={post.userImage || "https://via.placeholder.com/40"} alt="Avatar" className="w-10 h-10 rounded-full border border-gray-200" />
                                            <span className="font-semibold text-gray-800 text-sm">{post.username}</span>
                                        </div>

                                        {/* Caption */}
                                        <p className="text-gray-600 text-sm mb-4">
                                            {post.content}
                                        </p>

                                        {/* Action Buttons */}
                                        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                                            <div className="flex items-center space-x-4">
                                                <button onClick={() => handleLike(post.id)} className="flex items-center space-x-1 group">
                                                    <div className={`p-1.5 rounded-full ${post.liked ? 'bg-red-50' : 'bg-gray-100 group-hover:bg-red-50'}`}>
                                                        <Heart size={18} className={post.liked ? "fill-red-500 text-red-500" : "text-gray-500"} />
                                                    </div>
                                                    <span className="text-xs font-medium text-gray-500">Liked</span>
                                                </button>
                                                
                                                {/* Stacked Avatars (Visual Only) */}
                                                <div className="flex -space-x-2">
                                                    <div className="w-6 h-6 rounded-full bg-red-400 border-2 border-white"></div>
                                                    <div className="w-6 h-6 rounded-full bg-green-400 border-2 border-white"></div>
                                                    <div className="w-6 h-6 rounded-full bg-blue-400 border-2 border-white"></div>
                                                </div>
                                            </div>

                                            <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                                                <MessageCircle size={18} className="text-gray-500" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* --- MODAL POPUP: CREATE POST (BAGIAN PENTING) --- */}
            {/* Modal ini hanya muncul jika isModalOpen === true */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden">
                        
                        {/* Header Modal */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-100">
                            <h3 className="font-bold text-lg text-gray-800">Buat Postingan Baru</h3>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Body Modal */}
                        <div className="p-4">
                            <div className="flex items-start space-x-3 mb-4">
                                <img src={userData.userImage} alt="User" className="w-10 h-10 rounded-full" />
                                <div className="font-semibold text-sm mt-2">{userData.username}</div>
                            </div>
                            <textarea
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                                placeholder={`Apa yang sedang Anda makan, ${userData.username}?`}
                                className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none resize-none bg-gray-50"
                            />
                        </div>

                        {/* Footer Modal */}
                        <div className="flex justify-end items-center p-4 bg-gray-50 space-x-3 border-t border-gray-100">
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors text-sm"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={handleCreatePost}
                                disabled={isCreating || !newPostContent}
                                className={`px-4 py-2 rounded-lg font-medium text-white text-sm transition-colors ${
                                    isCreating || !newPostContent 
                                    ? 'bg-gray-300 cursor-not-allowed' 
                                    : 'bg-yellow-500 hover:bg-yellow-600 shadow-md'
                                }`}
                            >
                                {isCreating ? 'Mengirim...' : 'Posting'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Timeline