import InputForm from "../Elements/Input/Index";
import Button from "../Elements/Button/Index.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL }  from "../../api.jsx";

const FormLogin = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    if (username.trim() === '' || email.trim() === '' || password.trim() === '') {
      setMessage('Semua form harus diisi.');
      return;
    }

    if (username.trim() === '') {
      setMessage('Username tidak boleh kosong.');
      return;
    }

    if (password.trim() === '') {
      setMessage('Password tidak boleh kosong.');
      return;
    }
    if (email.trim() === '') {
      setMessage('Email tidak boleh kosong.');
      return;
    }

    if (password.length < 8) {
      setMessage('Password harus terdiri dari minimal 8 karakter!');
      return;
    }

    if (!/^[A-Z]/.test(password)) {
      setMessage('Password harus diawali dengan huruf kapital!');
      return;
    }

    try {
      console.log("Validasi berhasil. Melakukan proses login...");
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password: password.trim(),
        })
      });

      const data = await response.json();
      console.log("response", data);

      if (response.ok) {
        if (data.token && data.userId) {
          setMessage("Login berhasil");
          localStorage.setItem('AuthToken', data.token);
          localStorage.setItem('userId', data.userId);
          localStorage.setItem('nama', data.nama);
          localStorage.setItem('role', data.role);
          setUsername('');
          setEmail('');
          setPassword('');
          if (data.role === 'ADMIN') {
            navigate('/addMakanan');
          }
          if (data.role === 'PENGGUNA_UMUM') {
            navigate('/home');
          }
        }
      } else {
        if (response.status === 401) {
          setMessage('Email atau username salah. Silahkan coba lagi.');
          return;
        } else {
          if (data.field === 'email') {
            setMessage('Format email salah. Silahkan periksa kembali.');
          } else if (data.field === 'password') {
            setMessage('Password terlalu pendek. Harus terdiri dari minimal 8 karakter.');
          } else if (data.field === 'username') {
            setMessage('Username tidak ditemukan. Silahkan periksa kembali.');
          } else {
            setMessage(data.message || 'Login gagal. silahkan coba lagi');
          }
        }
      }
    } catch (error) {
      console.error('Error', error)
      setMessage('Terjadikesalahan pada server. Silahkan coba lagi nanti.');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <InputForm
        label="Username"
        type="text"
        placeholder="Masukkan username anda"
        nama="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      ></InputForm>
      <InputForm
        label="Email"
        type="email"
        placeholder="example@gmail.com"
        nama="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      ></InputForm>
      <div className="relative">
      <InputForm
        label="Password"
        type={showPassword ? "text" : "password"}
        placeholder="Harus 8 karakter"
        nama="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      ></InputForm>
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-9 text-sm text-black-600 hover:text-black-800"
      >
        {showPassword ? "Sembunyikan" : "Lihat"}
      </button>
    </div>
      <Button className="w-full" type="submit" variant="default">
        Login
      </Button>
        {message && <p className="text-red-500 mt-2">{message}</p>}
    </form>
  );
};


export default FormLogin;
