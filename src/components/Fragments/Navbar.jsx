import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const [isScrolled, setIsScrolled] = useState(false); // Scroll effect state
  const [isProfileOpen, setIsProfileOpen] = useState(false); // Profile dropdown state

  const nama = localStorage.getItem('nama');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();
  const location = useLocation();

  // Handle Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Cek Link Aktif
  const isActive = (path) => location.pathname === path;

  // Efek Scroll (Mengubah background saat di-scroll)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Daftar Menu
  const menuItems = [
    { name: 'Home', path: '/home', show: true },
    { name: 'Calculate', path: '/calculate', show: role !== 'ADMIN' },
    { name: 'Notebook', path: '/notebook', show: role !== 'ADMIN' },
    { name: 'Recommendation', path: '/Rekomendasi', show: role !== 'ADMIN' },
    { name: 'Add Makanan', path: '/addMakanan', show: role === 'ADMIN' },
    { name:'Add Olahraga', path: '/addOlahraga', show: role == 'ADMIN'},
    { name: 'Timeline', path: '/Timeline', show: true },
    { name: 'About', path: '/About', show: true },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-gray-100 py-2' 
          : 'bg-[#D9FBC5] border-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* 1. LOGO */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/home" className="text-3xl font-bold tracking-tighter text-green-700 hover:opacity-90 transition">
              Bee
              {/* Warna tulisan 'Health' berubah tergantung posisi scroll */}
              <span className={`${isScrolled ? 'text-green-500' : 'text-white drop-shadow-sm'}`}>
                Health
              </span>
            </Link>
          </div>

          {/* 2. DESKTOP MENU (Dengan Animasi Footer) */}
          <div className="hidden md:flex space-x-8 items-center">
            {menuItems.map((item) => (
              item.show && (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative text-base font-medium transition-colors duration-300 pb-1
                    ${isActive(item.path) 
                      ? 'text-green-700' 
                      : 'text-gray-600 hover:text-green-700'
                    }
                    /* ANIMASI GARIS BAWAH (Sama seperti Footer) */
                    after:content-[''] after:absolute after:w-full after:h-0.5 after:bottom-0 after:left-0 
                    after:bg-green-600 after:origin-bottom-right after:transition-transform after:duration-300 after:scale-x-0
                    hover:after:scale-x-100 hover:after:origin-bottom-left
                    ${isActive(item.path) ? 'after:scale-x-100 after:origin-bottom-left' : ''}
                  `}
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>

          {/* 3. PROFILE DROPDOWN (DESKTOP) */}
          <div className="hidden md:relative md:flex items-center ml-4">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              onBlur={() => setTimeout(() => setIsProfileOpen(false), 200)} // Tutup otomatis saat klik luar
              className="flex items-center gap-2 text-gray-700 hover:text-green-700 font-medium focus:outline-none group"
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                isScrolled ? 'bg-green-100 text-green-700' : 'bg-white/50 text-green-800'
              }`}>
                <User size={18} />
              </div>
              <span className="max-w-[100px] truncate">{nama}</span>
              <ChevronDown size={16} className={`transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`}/>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Signed in as</p>
                  <p className="text-sm font-bold text-gray-800 truncate">{nama}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold text-green-700 bg-green-100 rounded-full">
                    {role}
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>

          {/* 4. MOBILE MENU BUTTON */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-green-600 focus:outline-none p-2"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* 5. MOBILE MENU (SLIDE DOWN) */}
      <div className={`md:hidden bg-white border-t border-gray-100 transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-screen opacity-100 shadow-lg' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pt-4 pb-6 space-y-2">
          {menuItems.map((item) => (
            item.show && (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all ${
                  isActive(item.path)
                    ? 'bg-green-50 text-green-700 translate-x-1'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-green-600'
                }`}
              >
                {item.name}
              </Link>
            )
          ))}
          
          {/* Mobile Profile Section */}
          <div className="border-t border-gray-100 mt-6 pt-6 px-2">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <User size={20} className="text-green-700"/>
              </div>
              <div>
                <div className="font-bold text-gray-800">{nama}</div>
                <div className="text-xs text-gray-500 bg-gray-100 inline-block px-2 py-0.5 rounded-full mt-0.5">{role}</div>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full bg-red-50 hover:bg-red-100 text-red-600 px-4 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-colors"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;