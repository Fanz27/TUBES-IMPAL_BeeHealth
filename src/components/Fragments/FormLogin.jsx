import InputForm from "../Elements/Input/Index";
import Button from "../Elements/Button/Index.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FormLogin = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
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
      const response = await fetch('http://localhost:3000/api/auth', {
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

      if (response.ok) {
        setMessage("Login berhasil");
        setUsername('');
        setEmail('');
        setPassword('');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user_id', data.id);
        navigate('/dashboard');
      } else {
        setMessage(data.message || 'Login gagal. silahkan coba lagi')
      }
    } catch (error) {
      console.error('Error', error)
      setMessage('Terjadikesalahan pada server. Silahkan coba lagi nanti.');
    }

    // localStorage.setItem('name', e.target.name.value)
    // localStorage.setItem('email', e.target.email.value)
    // localStorage.setItem('password', e.target.password.value)
    // console.log("Login");
  };

  return (
    <form onSubmit={handleLogin}>
      <InputForm
        label="Username"
        type="text"
        placeholder="Masukkan username anda"
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      ></InputForm>
      <InputForm
        label="Email"
        type="email"
        placeholder="example@gmail.com"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      ></InputForm>
      <InputForm
        label="Password"
        type="password"
        placeholder="Harus 8 karakter"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      ></InputForm>
      <Button classname="w-full" type="submit">
        Login
      </Button>
        {message && <p className="text-red-500 mt-2">{message}</p>}
    </form>
  );
};


export default FormLogin;
