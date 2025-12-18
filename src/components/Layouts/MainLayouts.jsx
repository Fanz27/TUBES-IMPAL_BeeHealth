import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Fragments/Navbar";
import Footer from "../Fragments/Footer"; // Pastikan path benar

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* 1. Navbar Fixed di Atas */}
      <Navbar />

      {/* 2. Content Wrapper dengan Padding Top */}
      {/* pt-32 (128px) memberi ruang agar konten tidak tertutup Navbar */}
      <main className="flex-grow pt-32 bg-[#F3F4F6]">
        <Outlet /> 
      </main>

      {/* 3. Footer di Bawah */}
      <Footer>
         {/* <NavbarFooter/> */}
      </Footer>
    </div>
  );
};

export default MainLayout;