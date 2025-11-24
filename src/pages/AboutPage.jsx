import About from "../components/Fragments/About";
import Navbar from "../components/Fragments/Navbar";
import NavbarFooter from "../components/Fragments/NavbarFooter";
import Footer from "../components/Fragments/Footer";
const AboutPage = () => {
    return (
        <>
        <Navbar></Navbar>
        <About/>
        <Footer>
            <NavbarFooter/>
        </Footer>
        </>
    )
}

export default AboutPage;