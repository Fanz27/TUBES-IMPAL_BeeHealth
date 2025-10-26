import { Link } from "react-router-dom";

const NavbarFooter = () => {
    return (
        <nav>
            <ul className="flex space-x-6">
                <li><Link to="/" className="hover:underline">Home</Link></li>
                <li><a href="#" className="hover:underline">Calculate</a></li>
                <li><a href="#" className="hover:underline">Rekomendasi</a></li>
                <li><a href="#" className="hover:underline">Tambah</a></li>
                <li><a href="#" className="hover:underline">Timeline</a></li>
                <li><a href="#" className="hover:underline">About</a></li>
            </ul>
        </nav>
    )
}

export default NavbarFooter;