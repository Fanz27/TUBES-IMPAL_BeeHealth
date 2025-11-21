import { Link } from "react-router-dom";

const NavbarFooter = () => {
    return (
        <nav className="bg-[#D9FBC5] text-gray-800 p-4 flex justify-center">
            <ul className="flex space-x-6">
                <li><Link to="/home" className="hover:text-green-500 font-medium">Home</Link></li>
                <li><Link to="/calculate" className="hover:text-green-500 font-medium">Calculate</Link></li>
                <li><Link to="/Rekomendasi" className="hover:text-green-500 font-medium">Recomendasi</Link></li>
                <li><Link to="/addMakanan" className="hover:text-green-500 font-medium">Add</Link></li>
                <li><Link to="/timeline" className="hover:text-green-500 font-medium">Timeline</Link></li>
                <li><Link to="/about" className="hover:text-green-500 font-medium">About</Link></li>
            </ul>
        </nav>
    )
}

export default NavbarFooter;