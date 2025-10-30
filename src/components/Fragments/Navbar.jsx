import Button from "../Elements/Button/Index.jsx"
const Navbar = () => {
  const nama = localStorage.getItem('nama');
  const handleLogout = () => {
    localStorage.removeItem('nama');
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    window.location.href = "/login";
  }
  return (
      <nav className="bg-[#D9FBC5] text-gray-800 p-8 mt-auto">
        <div className="flex justify-end h-10 text-white items-center px-10 gap-x-5">
          {nama}
          <Button className="ml-5" onClick={handleLogout}>Logout</Button>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center px-8 py-4">
          <h2 className="text-3xl font-bold mb-4 hover:underline">Bee<span className="text-white">Health</span></h2></div>
        <ul className="flex justify-end items-center gap-x-6 px-8 pb-4">
          <li>
            <a href="/home" className="hover:underline">
              Home
            </a>
          </li>
          <li>
            <a href="/calculate" className="hover:underline">
              Calculate
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              Rekomendasi
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              Tambah
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              Timeline
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              About
            </a>
          </li>
        </ul>
      </nav>
  );
};

export default Navbar;
