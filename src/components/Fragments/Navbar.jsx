import Button from "../Elements/Button/Index.jsx";

const Navbar = () => {
  const nama = localStorage.getItem('nama');
  
  const handleLogout = () => {
    localStorage.removeItem('nama');
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    localStorage.removeItem('AuthToken');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.href = "/login";
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
          <a href="/home" className="text-3xl font-bold hover:opacity-70 transition">
            Bee<span className="text-white">Health</span>
          </a>
        </div>

        <ul className="flex justify-end items-center gap-x-8 text-base">
          <li>
            <a 
              href="/home" 
              className="hover:text-green-500 font-medium"
            >
              Home
            </a>
          </li>
          <li>
            <a 
              href="/calculate" 
              className="hover:text-green-500 font-medium"
            >
              Calculate
            </a>
          </li>
          <li>
            <a 
              href="/rekomendasi" 
              className="hover:text-green-500 font-medium"
            >
              Recomendasi
            </a>
          </li>
          <li>
            <a 
              href="/addMakanan" 
              className="hover:text-green-500 font-medium"
            >
              Add
            </a>
          </li>
          <li>
            <a 
              href="/timeline" 
              className="hover:text-green-500 font-medium"
            >
              Timeline
            </a>
          </li>
          <li>
            <a 
              href="/about" 
              className="hover:text-green-500 font-medium"
            >
              About
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
