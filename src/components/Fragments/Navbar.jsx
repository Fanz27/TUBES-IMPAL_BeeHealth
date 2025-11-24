import Button from "../Elements/Button/Index.jsx";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const nama = localStorage.getItem('nama');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();
  const location = useLocation(); // PENTING: Harus ada baris ini!

  const handleLogout = () => {
    localStorage.removeItem('nama');
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    localStorage.removeItem('AuthToken');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    navigate("/login"); 
  };

  // Fungsi untuk mengecek apakah link sedang aktif
  const Aktif = (path) => location.pathname === path;

  return (
    <nav className="bg-[#D9FBC5] text-gray-800 shadow-md">
      <div className="flex justify-end items-center px-8 py-3">
        <span className="mr-4 font-medium">Selamat Datang, {nama}</span>
        <Button 
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 hover:bg-red-800 text-white font-bold rounded"
          variant="default"
        >
          Logout
        </Button>
      </div>

      <div className="p-4 justify-between items-center max-w-7xl mx-auto flex">
        <div className="flex justify-between items-center mb-4">
          <Link to="/home" className="text-3xl font-bold hover:opacity-70 transition">
            Bee<span className="text-white">Health</span>
          </Link>
        </div>

        <ul className="flex justify-end items-center gap-x-8 text-base">
          <li>
            <Link 
              to="/home" 
              className={`hover:text-white-500 font-medium px-3 py-2 rounded transition ${
                Aktif('/home') ? 'bg-green-500 text-white' : ''
              }`}
            >
              Home
            </Link>
          </li>
          {role !== 'ADMIN' && (
          <li>
            <Link 
              to="/calculate" 
              className={`hover:text-white-500 font-medium px-3 py-2 rounded transition ${
                Aktif('/calculate') ? 'bg-green-500 text-white' : ''
              }`}
            >
              Calculate
            </Link>
          </li>
          )}
          {role !== 'ADMIN' && (
          <li>
            <Link 
              to="/notebook" 
              className={`hover:text-white-500 font-medium px-3 py-2 rounded transition ${
                Aktif('/notebook') ? 'bg-green-500 text-white' : ''
              }`}
            >
              Notebook
            </Link>
          </li>
          )}
          {role !== 'ADMIN' && (
          <li>
            <Link 
              to="/Rekomendasi" 
              className={`hover:text-white-500 font-medium px-3 py-2 rounded transition ${
                Aktif('/Rekomendasi') ? 'bg-green-500 text-white' : ''
              }`}
            >
              Recomendasi
            </Link>
          </li>
          )}
          {role === 'ADMIN' && (
          <li>
            <Link 
              to="/addMakanan" 
              className={`hover:text-white-500 font-medium px-3 py-2 rounded transition ${
                Aktif('/addMakanan') ? 'bg-green-500 text-white' : ''
              }`}
            >
              Add
            </Link>
          </li>
          )}
          <li>
            <Link 
              to="/Timeline" 
              className={`hover:text-white-500 font-medium px-3 py-2 rounded transition ${
                Aktif('/Timeline') ? 'bg-green-500 text-white' : ''
              }`}
            >
              Timeline
            </Link>
          </li>
          <li>
            <Link 
              to="/About" 
              className={`hover:text-white-500 font-medium px-3 py-2 rounded transition ${
                Aktif('/About') ? 'bg-green-500 text-white' : ''
              }`}
            >
              About
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;