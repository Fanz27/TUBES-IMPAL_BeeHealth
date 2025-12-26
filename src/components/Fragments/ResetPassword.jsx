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
    <form onSubmit={handleResetPassword}>
      <div className="relative">
        <InputForm
          label="Password Baru"
          type={showPassword ? "text" : "password"}
          placeholder="Minimal 8 karakter"
          nama="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="relative">
        <InputForm
          label="Konfirmasi Password"
          type={showPassword ? "text" : "password"}
          placeholder="Ulangi password"
          nama="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-9.5"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <Button className="w-full mt-3" type="submit">
        Reset Password
      </Button>

      {message && <p className="text-red-500 mt-2">{message}</p>}
    </form>
  );
};

export default FormResetPassword;