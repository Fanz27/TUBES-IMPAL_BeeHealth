import Navbar from "../components/Fragments/Navbar.jsx";
import Footer from "../components/Fragments/Footer.jsx";
import NavbarFooter from "../components/Fragments/NavbarFooter.jsx";
import Timeline from "../components/Fragments/Timeline.jsx";

const TimelinePage = () => {
    return (
        <>
            <Navbar></Navbar>
            <Timeline/>
            <Footer>
                <NavbarFooter/>
            </Footer>
        </>
    )
}
export default TimelinePage;