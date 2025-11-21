import Button from "../Elements/Button/Index.jsx";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const nama = localStorage.getItem('nama');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('nama');
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    localStorage.removeItem('AuthToken');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate("/login"); 
  };

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
          <li><Link to="/home" className="hover:text-green-500 font-medium">Home</Link></li>
          <li><Link to="/calculate" className="hover:text-green-500 font-medium">Calculate</Link></li>
          <li><Link to="/Rekomendasi" className="hover:text-green-500 font-medium">Recomendasi</Link></li>
          <li><Link to="/addMakanan" className="hover:text-green-500 font-medium">Add</Link></li>
          <li><Link to="/timeline" className="hover:text-green-500 font-medium">Timeline</Link></li>
          <li><Link to="/about" className="hover:text-green-500 font-medium">About</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
