import Navbar from "../Fragments/Navbar.jsx";
import MainDashboard from "../Fragments/MainDashboard.jsx";

const DashboardLayout = (props) => {
    return (
        <div className="flex flex-col min-h-screen"> 
            <Navbar/>
            <MainDashboard>
            </MainDashboard>
        </div>
    )
} 

export default DashboardLayout;