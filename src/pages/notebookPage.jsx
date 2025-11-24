import Notebook from "../components/Fragments/Notebook";
import Navbar from "../components/Fragments/Navbar";
import NavbarFooter from "../components/Fragments/NavbarFooter";
import Footer from "../components/Fragments/Footer";

const NotebookPage = () => {
  return (
    <div>
        <Navbar/>
        <Notebook/>
        <Footer>
            <NavbarFooter/>
        </Footer>
    </div>
  )
}
export default NotebookPage;