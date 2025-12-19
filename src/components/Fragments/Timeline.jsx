import React, { useEffect, useState, useRef } from 'react';
import { Flame, Heart, MessageCircle, ChevronDown, Plus, Utensils, Flag, X, Image as ImageIcon, Trash2 } from 'lucide-react';
import axios from 'axios';
// import api, { API_URL } from '../../api'; 
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'ngrok-skip-browser-warning': 'true', // Penting untuk ngrok
    'Content-Type': 'application/json'
  }
});

// 3. Tambahkan interceptor untuk Token (jika pakai login)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("AuthToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const Timeline = ({selectedDate = new Date()}) => {
    // --- STATE ---
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentUserId, setCurrentUserId] = useState();
    const [roleId, setRoleId] = useState();
    // const [selectedDate, setSelectedDate] = useState(new Date());

    
    // State Modal & Form
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPostContent, setNewPostContent] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    // State Komen
    const [commentText, setCommentText] = useState('');
    const [activePostId, setActivePostId] = useState(null);
    const [commentLoading, setCommentLoading] = useState(false);
    
    // State Upload
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const fileInputRef = useRef(null);

    const [userData, setUserData] = useState({
        streakCount: 5, 
        username: 'Arif',
        userImage: 'https://i.pravatar.cc/150?img=12',
        calories: 0,
        targetCalories: 2000,
        consumed: 1641,
        target: 1412
    });

    const [meals, setMeals] = useState({
        MAKAN_PAGI: [], MAKAN_SIANG: [], MAKAN_MALAM: [], KUDAPAN: []
    });

    const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const streakData = [true, true, true, true, true, false, false];
    const [expandMeals, setExpandMeals] = useState({0: true});

    const formatDate = (date) => {
        if (!date) return "Tanggal tidak valid!!"
        return new Date(date).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };


    useEffect(() => {
        fetchPosts();

        // fetchUserStats();
        
        const nama = localStorage.getItem("nama");
        const idPengguna = localStorage.getItem("userId");
        const role = localStorage.getItem("role");

        if (nama) setUserData(prev => ({ ...prev, username: nama }));
        if (idPengguna) setCurrentUserId(idPengguna);
        if (role) setRoleId(role);
    }, []);

    // const fetchUserStats = async () => {
    //     try {
    //         const userId = localStorage.getItem("userId");
    //         if (!userId) return;

    //         const res = await api.get(`/user/stats`);

    //         if (res.data?.data) {
    //             setUserData(prev => ({
    //                 ...prev,
    //                 streakCount: res.data.data.streak || 0,
    //                 username: res.data.data.nama || prev.username,
    //                 calories: res.data.data.totalCaloriesToday ||  0,
    //                 target: res.data.data.totalCalories || prev.target
    //             }));
    //         }
    //     } catch (err) {
    //         console.log("Gagal mengambil data user stats", err);
    //     }
    // }

    // --- FETCH MEALS ---
    const fetchMeals = async (dateInput) => {
        const targetDate = dateInput || selectedDate || new Date();
        try {
            // const today = new Date().toISOString().split('T')[0];
            const formattedDate = targetDate.toISOString().split('T')[0];
            const res = await api.get('/log/daily',{
                params: {date: formattedDate}
            });
            const grouped = { SARAPAN: [], MAKAN_SIANG: [], MAKAN_MALAM: [], KUDAPAN: [] };

            let totalCalories = 0;

            const logData = res.data?.foodLogs || [];

            if (logData.length > 0) {
                logData.forEach(item => {
                    // Hitung kalori (Handle jika food null)
                    const calorie = item.food ? (item.food.kalori * item.porsi) : 0;
                    const foodNama = item.food ? item.food.nama : "Unknown";

                    const cleanItem = {
                        ...item,
                        foodName: foodNama,
                        calories: calorie
                    };

                    // Masukkan ke kategori yang sesuai
                    if (grouped[item.mealType]) {
                        grouped[item.mealType].push(cleanItem);
                    } else {
                        // Jaga-jaga kalau backend kirim "SARAPAN" tapi state kita "MAKAN_PAGI"
                        if(item.mealType === 'SARAPAN') {
                             grouped['MAKAN_PAGI'].push(cleanItem);
                        }
                    }
                    
                    totalCalories += calorie;
                });
            }
            setMeals(grouped);
            setUserData(prev => ({ ...prev, calories: totalCalories, consumed: totalCalories}));
        } catch (err) {
            console.log("Gagal mengambil data makanan", err);
        }
    };

    useEffect(() => {
        if (selectedDate) {          
            fetchMeals(selectedDate);
        };
    }, [selectedDate]);


    // --- FETCH POSTS (PERBAIKAN UTAMA DISINI) ---
    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/post/'); 
            const baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/api\/?$/, '');

            // 2. Cek Validitas Data
            const rawData = response.data.data || response.data;
            if (!Array.isArray(rawData)) {
                console.warn("Format data post bukan array");
                setPosts([]);
                return;
            }

            // 3. Transform Data
            const transformedPosts = rawData.map(post => {
                let finalImageUrl = null;
                
                if (post.imageUrl) {
                    // Bersihkan path gambar
                    let cleanPath = post.imageUrl.replace(/\\/g, "/"); 
                    if (cleanPath.startsWith('/')) cleanPath = cleanPath.substring(1);
                    
                    // Tambah 'uploads/' jika belum ada
                    if (!cleanPath.startsWith('uploads') && !cleanPath.startsWith('http')) {
                         cleanPath = `uploads/${cleanPath}`;
                    }

                    // Gabung URL
                    finalImageUrl = cleanPath.startsWith('http') ? cleanPath : `${baseURL}/${cleanPath}`;
                }

                return {
                    id: post.id,
                    username: post.user?.nama || post.user?.username || "User",
                    userImage: "https://i.pravatar.cc/150?img=12",
                    content: post.deskripsi,
                    image: finalImageUrl,
                    likes: post.likesCount || 0, // Pakai 0 jika undefined
                    liked: post.liked || false,
                    comments: post.comments || [],
                    user: post.user
                };
            });

            setPosts(transformedPosts);

        } catch (err) {
            console.error("Error fetching posts:", err);
            setPosts([]); // Fallback array kosong agar tidak crash
        } finally {
            setLoading(false);
        }
    }

    // --- HANDLE UPLOAD ---
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Hanya file gambar yang diperbolehkan!');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('Ukuran file maksimal 5MB!');
                return;
            }
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setSelectedFile(null);
        setPreviewImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // --- CREATE POST ---
    const handleCreatePost = async () => {
        if (!newPostContent.trim() && !selectedFile) {
            alert('Isi deskripsi atau upload gambar!');
            return;
        }

        setIsCreating(true);
        try {
            const formData = new FormData();
            formData.append('deskripsi', newPostContent);
            if (selectedFile) formData.append('postImage', selectedFile);

            await api.post('/post/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            await fetchPosts(); // Refresh data
            
            setNewPostContent("");
            removeImage();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error creating post:", error);
            alert(error.response?.data?.message || 'Gagal membuat post.');
        } finally {
            setIsCreating(false);
        }
    };

    // --- LIKE & COMMENT & DELETE ---
    const handleLike = async (id) => {
        try {
            const res = await api.post(`/post/${id}/like`);
            const action = res.data?.data?.action; 

            setPosts(prevPosts => prevPosts.map(p => {
                if (p.id === id) {
                    const newLikes = action === 'liked' ? (p.likes || 0) + 1 : Math.max((p.likes || 1) - 1, 0);
                    return { ...p, liked: action === 'liked', likes: newLikes };
                }
                return p;
            }));
        } catch (error) {
            console.error("Error liking post:", error);
        }
    };

    const handleComment = async (postId) => {
        if (!commentText.trim()) return;
        setCommentLoading(true);
        try {
            const res = await api.post(`/post/${postId}/comment`, { text: commentText });
            setPosts(prev => prev.map(post => post.id === postId ? {
                ...post, 
                comments: [res.data.data, ...(post.comments || [])]
            }: post));
            setCommentText('');
            // setActivePostId(null);
        } catch (err) {
            console.log("Gagal komentar", err);
        } finally {
            setCommentLoading(false);
        }
    };

    const handleDeletePost = async (id) => {
        if (!confirm("Yakin hapus?")) return;
        try {
            await api.delete(`/post/${id}`);
            setPosts(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.log("Gagal hapus", err);
        }
    };

    const toggleMeal = (type) => setExpandMeals(prev => ({...prev, [type]: !prev[type]}));

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans relative">
            <div className='max-w-7xl mx-auto px-4 py-8'>
                {/* Header */}
                <div className="flex justify-between items-center mb-6 lg:ml-[26%] lg:w-[74%] pl-4">
                    {/* <button className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm font-medium">Following<ChevronDown size={16}/></button> */}
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2 bg-[#FDE68A] text-yellow-800 px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-[#FCD34D]">
                        <Plus size={18} /><span>Create Post</span>
                    </button>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
                    {/* Sidebar Kiri */}
                    <div className='lg:col-span-3 space-y-6'>
                        {/* Streak Card */}
                        <div className='bg-white rounded-2xl shadow-sm p-6 border border-gray-100 text-center'>
                            <Flame size={40} className="text-orange-500 mx-auto mb-2"/>
                            <h3 className="font-bold">Streak: {userData.streakCount}</h3>
                        </div>
                        
                        {/* Meals List */}
                        <div className='bg-white rounded-2xl shadow-sm p-5 border border-gray-100'>
                            <h3 className="text-sm font-bold text-gray-600 mb-4 text-center"> {formatDate(selectedDate)}</h3>
                            <div className="space-y-4">
                                {Object.entries(meals).map(([mealType, items]) => (
                                    <div key={mealType} className="border-b pb-2">
                                        <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleMeal(mealType)}>
                                            <span className="font-bold text-gray-700">{mealType}</span>
                                            <span className="font-bold">{items.reduce((s, i) => s + i.calories, 0)} kcal</span>
                                        </div>
                                        {expandMeals[mealType] && items.map(item => (
                                            <div key={item.id} className="pl-2 text-xs flex justify-between text-gray-500 mt-1">
                                                <span>{item.foodName}</span><span>{item.calories}</span>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* MAIN FEED */}
                    <div className="lg:col-span-9 space-y-6">
                        {loading ? (
                            <div className="text-center py-10">Loading...</div>
                        ) : (
                            posts.length > 0 ? posts.map((post) => (
                                <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    {/* Image Post */}
                                    {post.image && (
                                        <div className="w-full h-80 bg-gray-200 relative">
                                            <img src={post.image} alt="Post" className="w-full h-full object-cover" 
                                                 onError={(e) => {
                                                     e.target.onerror = null;
                                                     e.target.src = "https://via.placeholder.com/800x400?text=Gambar+Rusak";
                                                 }} 
                                            />
                                        </div>
                                    )}
                                    
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center space-x-3">
                                                <img src={post.userImage} className="w-10 h-10 rounded-full border" />
                                                <span className="font-bold text-sm">{post.username}</span>
                                            </div>
                                            {(roleId === "ADMIN" || post.user?.id === currentUserId) && (
                                                <button onClick={() => handleDeletePost(post.id)} className="text-red-500 hover:text-red-700 p-1">
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>

                                        <p className="text-gray-700 text-sm mb-4">{post.content}</p>

                                        {/* Actions */}
                                        <div className="flex items-center gap-4 border-t pt-3">
                                            <button onClick={() => handleLike(post.id)} className={`flex items-center gap-1 ${post.liked ? 'text-red-500' : 'text-gray-500'}`}>
                                                <Heart size={20} className={post.liked ? "fill-current" : ""} />
                                                <span className="text-sm">{post.likes}</span>
                                            </button>
                                            <button onClick={() => setActivePostId(activePostId === post.id ? null : post.id)} className="text-gray-500">
                                                <MessageCircle size={20} />
                                            </button>
                                        </div>

                                        {/* Comments Section */}
                                        {activePostId === post.id && (
                                            <div className="mt-3 pt-3 border-t">
                                                <div className="flex gap-2 mb-3">
                                                    <input 
                                                        value={commentText} 
                                                        onChange={(e) => setCommentText(e.target.value)} 
                                                        placeholder="Tulis komentar..." 
                                                        className="flex-1 border rounded px-2 py-1 text-sm"
                                                    />
                                                    <button onClick={() => handleComment(post.id)} disabled={commentLoading} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">
                                                        {commentLoading ? 'Mengirim...' : 'Kirim'}
                                                    </button>
                                                </div>
                                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                                    {post.comments?.map(c => (
                                                        <div key={c.id} className="bg-gray-50 p-2 rounded text-sm">
                                                            <span className="font-bold mr-2">{c.user?.nama}:</span>
                                                            {c.text}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )) : <div className="text-center py-10 text-gray-500">Belum ada postingan.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Create Post */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white w-full max-w-lg rounded-xl p-4 shadow-2xl">
                        <div className="flex justify-between mb-4 border-b pb-2">
                            <h3 className="font-bold">Buat Postingan</h3>
                            <button onClick={() => setIsModalOpen(false)}><X/></button>
                        </div>
                        <div className="flex gap-3 mb-4">
                            <img src={userData.userImage} className="w-10 h-10 rounded-full"/>
                            <span className="font-bold mt-2">{userData.username}</span>
                        </div>
                        <textarea 
                            value={newPostContent} 
                            onChange={(e) => setNewPostContent(e.target.value)} 
                            className="w-full h-24 border rounded p-2 mb-2 bg-gray-50"
                            placeholder={`Apa yang Anda pikirkan, ${userData.username}?`}
                        />
                        {previewImage && (
                            <div className="relative mb-2">
                                <img src={previewImage} className="h-40 w-full object-cover rounded" />
                                <button onClick={removeImage} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"><X size={14}/></button>
                            </div>
                        )}
                        <div className="flex justify-between items-center mt-2 pt-2 border-t">
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                            <button onClick={() => fileInputRef.current.click()} className="flex items-center gap-2 text-gray-500 hover:bg-gray-100 px-3 py-2 rounded">
                                <ImageIcon size={20}/> Foto
                            </button>
                            <div className="flex gap-2">
                                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Batal</button>
                                <button onClick={handleCreatePost} disabled={isCreating || (!newPostContent && !selectedFile)} className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 disabled:bg-gray-300">
                                    {isCreating ? 'Mengirim...' : 'Posting'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Timeline;