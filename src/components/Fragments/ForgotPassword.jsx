import InputForm from "../Elements/Input/Index";
import Button from "../Elements/Button/Index.jsx";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';
import api from "../../../api";


const FormForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");


  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess("");

    if (!email.trim()) {
      setMessage("Email tidak boleh kosong.");
      return;
    }

    try {
      const response = await api.post(`/auth/forgot-password`, {
        email: email.trim(),
        user: ''
      });
      
      setSuccess("Link reset password telah dikirim ke email Anda.");
      setEmail("");

    } catch (error) {
        if (error.response) {
            setMessage(error.response.data.message || "Email tidak ditemukan.");
        } else {
            setMessage("Terjadi kesalahan pada server atau koneksi.");
        }
    } 
  };

  return (
    <form onSubmit={handleForgotPassword} className="space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Lupa Password?</h2>
        <p className="text-sm text-gray-500">Masukkan email Anda untuk menerima link pemulihan.</p>
      </div>

      <div className="space-y-4">
        <InputForm
          label="Email"
          type="email"
          placeholder="beehealth@gmail.com"
          nama="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {message && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100 animate-pulse">
          {message}
        </div>
      )}
      
      {success && (
        <div className="p-3 text-sm text-green-600 bg-green-50 rounded-lg border border-green-100">
          {success}
        </div>
      )}

      <div className="space-y-3">
        <Button 
          className="w-full py-2.5 text-white font-medium rounded-lg shadow-sm transition-all active:scale-95" 
          type="submit"
        >
          Kirim Link Reset
        </Button>

        <Link 
          to='/login' 
          className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors py-2"
        >
          <ArrowLeft size={16} />
          Kembali ke Login
        </Link>
      </div>
    </form>
  );
};

export default FormForgotPassword;