import InputForm from "../Elements/Input/Index";
import Button from "../Elements/Button/Index.jsx";
import { useState } from "react";
import { Link } from "react-router-dom";
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
    <form onSubmit={handleForgotPassword}>
      <InputForm
        label="Email"
        type="email"
        placeholder="example@gmail.com"
        nama="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Button className="w-full mt-3" type="submit">
        Kirim Link Reset
      </Button>
      <Link to='/login'>Back</Link>

      {message && <p className="text-red-500 mt-2">{message}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </form>
  );
};

export default FormForgotPassword;