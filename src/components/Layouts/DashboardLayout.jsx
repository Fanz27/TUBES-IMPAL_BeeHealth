import NavbarFooter from "../Fragments/NavbarFooter.jsx";
import Footer from "../Fragments/footer.jsx";
import Navbar from "../Fragments/Navbar.jsx";
import MainDashboard from "../Fragments/MainDashboard.jsx";

const DashboardLayout = (props) => {
    return (
        <div className="flex flex-col min-h-screen"> 
        <Navbar/>
        <MainDashboard>
            
        </MainDashboard>
        <Footer>
            <NavbarFooter/>
        </Footer>
        </div>
    )
} 

export default DashboardLayout;