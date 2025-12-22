import { Link } from "react-router-dom";
import { FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa"; 

const Footer = () => {
    return (
        <footer className="bg-[#D9FBC5] text-gray-800 py-8 px-4 mt-auto border-t border-green-200">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center md:items-start">
                
                {/* --- BAGIAN KIRI: Brand & Sosmed --- */}
                <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
                    <h2 className="text-2xl font-bold mb-2 tracking-tight">
                        Bee<span className="text-white drop-shadow-sm">Health</span>
                    </h2>

                    <div className="flex space-x-4 mb-2">
                        <SocialLink href="#" icon={<FaFacebook />} label="Facebook" />
                        <SocialLink href="#" icon={<FaLinkedin />} label="LinkedIn" />
                        <SocialLink href="#" icon={<FaInstagram />} label="Instagram" />
                    </div>

                    <p className="text-xs font-medium text-gray-600">
                        &copy; {new Date().getFullYear()} BeeHealth. All rights reserved.
                    </p>
                </div>

                {/* --- BAGIAN KANAN: Navigasi --- */}
                <div className="flex flex-col justify-center h-full md:pt-1">
                    <ul className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2 text-sm font-semibold text-gray-700">
                        <FooterLink to="/home" text="Home" />
                        <FooterLink to="/calculate" text="Calculate" />
                        <FooterLink to="/notebook" text="Notebook"/>
                        <FooterLink to="/Rekomendasi" text="Recommendation" />
                        <FooterLink to="/Timeline" text="Timeline" />
                        <FooterLink to="/About" text="About" />
                    </ul>
                </div>

            </div>
        </footer>
    );
}

// --- Komponen Kecil ---

const FooterLink = ({ to, text }) => (
    <li>
        <Link 
            to={to} 
            className="relative hover:text-green-700 transition-colors duration-300 after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-green-600 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
        >
            {text}
        </Link>
    </li>
);

const SocialLink = ({ href, icon, label }) => (
    <a 
        href={href} 
        aria-label={label}
        className="text-lg text-gray-700 hover:text-green-700 hover:-translate-y-1 transition-all duration-300 transform"
    >
        {icon}
    </a>
);

export default Footer;