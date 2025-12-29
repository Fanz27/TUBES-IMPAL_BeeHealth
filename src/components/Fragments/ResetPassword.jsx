import InputForm from "../Elements/Input/Index";
import Button from "../Elements/Button/Index.jsx";
import { useState } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../../../api";

const FormResetPassword = () => {
  const [searchParams] = useSearchParams();
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!password || !confirmPassword) {
      setMessage("Semua field harus diisi.");
      return;
    }

    if (password.length < 8) {
      setMessage("Password minimal 8 karakter.");
      return;
    }

    if (!/^[A-Z]/.test(password)) {
      setMessage("Password harus diawali huruf kapital.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Konfirmasi password tidak sama.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post(`/auth/reset-password/${token}`, {
        newPassword: password
      });
      // const data = await response.json();
      alert("Password berhasil direset. Silakan login.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        setMessage(error.response.data.message || "Reset password gagal.");
      } else {
        setMessage("Terjadi kesalahan pada server atau koneksi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleResetPassword} className="space-y-5 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="space-y-4">
        <div className="relative group">
          <InputForm
            label="Password Baru"
            type={showPassword ? "text" : "password"}
            placeholder="Minimal 8 karakter"
            nama="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pr-12 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="relative group">
          <InputForm
            label="Konfirmasi Password"
            type={showPassword ? "text" : "password"}
            placeholder="Ulangi password"
            nama="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pr-12 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
          
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] p-1 text-gray-400 hover:text-blue-600 transition-colors"
            tabIndex="-1"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {message && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 mt-2">
          <p className="text-red-600 text-sm font-medium">{message}</p>
        </div>
      )}

      <Button 
        className="w-full mt-4 py-3 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform transition-all active:scale-[0.98]" 
        type="submit"
      >
        Simpan Password Baru
      </Button>
    </form>
  );
};

export default FormResetPassword;