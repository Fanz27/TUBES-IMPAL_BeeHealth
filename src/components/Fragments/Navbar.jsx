const Navbar = () => {
  return (
      <nav className="bg-[#D9FBC5] text-gray-800 p-8 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 py-4">
          <h2 className="text-3xl font-bold mb-4 hover:underline">Bee<span className="text-white">Health</span></h2></div>
        <ul className="flex justify-end items-center gap-x-6 px-8 pb-4">
          <li>
            <a href="/home" className="hover:underline">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
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
