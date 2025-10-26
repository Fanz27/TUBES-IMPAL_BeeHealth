import { FaFacebookF, FaLine, FaLinkedinIn } from "react-icons/fa";

const Footer = (props) => {
    const { children } = props;
  return (
    <footer className="bg-[#D9FBC5] text-gray-800 p-8 mt-auto">
      <div className="container mx-auto flex justify-between items-start">
        {/* Kolom Kiri: Logo, Ikon, dan Copyright */}
        <div className="flex flex-col space-y-4">
          <h2 className="text-3xl font-bold mb-4">Bee<span className="text-white">Health</span></h2>
          <div className="flex justify-center md:justify-start space-x-4 mb-4">
            <a
              href="#"
              aria-label="Facebook"
              className="text-xl p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              aria-label="Line"
              className="text-xl p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <FaLine />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="text-xl p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <FaLinkedinIn />
            </a>
          </div>
          <p className="text-sm font-bold">&copy; 2025 BeeHealth. All rights reserved.</p>
        </div>

        {/* Kolom Kanan: Link Navigasi */}
        {children}
      </div>
    </footer>
  );
};

export default Footer;
