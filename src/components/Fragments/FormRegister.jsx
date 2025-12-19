import InputForm from "../Elements/Input/Index"
import Button from "../Elements/Button/Index.jsx"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { EyeOff, Eye } from "lucide-react";
import {API_URL}  from "../../../api";

const FormRegister = () => {
    const [nama, setNama] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');

        if (nama.trim() === '' || email.trim() === '' || username.trim() === '' || password.trim() === '') {
            setMessage('Semua form harus diisi.');
            return;                                                                 
        }
        if (nama.trim() === '') {
            setMessage('Name tidak boleh kosong.');
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
            console.log("Validasi berhasil. Melakukan proses registrasi...");
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nama: nama.trim(),
                    email: email.trim(),
                    username: username.trim(),
                    password: password.trim(),
                })
            });
            let data = {};
            if (response.headers.get("Content-Type")?.includes("application/json")) {
                data = await response.json();
            }

            if (response.ok) {
                console.log("response", data);
                setMessage("Registrasi anda berhasil");
                setUsername('');
                setEmail('');
                setPassword('');
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.id);
                navigate('/login');
            } else {
                setMessage(data.message || 'Registrasi gagal. silahkan coba lagi')
            }
        } catch (error) {
            console.error('Error selama registrasi:', error);
            setMessage('Terjadi kesalahan selama registrasi. Silahkan coba lagi.');
        }
    }
    return (
        <form onSubmit={handleRegister}>
            <InputForm 
                label="Name" 
                type="text" 
                placeholder="Masukkan nama anda" 
                name="name"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
            ></InputForm>
            <InputForm 
                label="Email" 
                type="email" 
                placeholder="beehealth001@gmail.com" 
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            ></InputForm>
            <InputForm 
                label="Username" 
                type="text" 
                placeholder="beehealth" 
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            ></InputForm>
            <div className="relative">
                <InputForm 
                    label="Password"
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password harus 8 karakter" 
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}

                ></InputForm>
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-9.5"
                >
                    {showPassword ? <EyeOff size={18}/> : <Eye size={18}/> }
                </button>
            </div>
            <Button className ="w-full" type="submit" variant="default">Daftar</Button>
            {message && <p className="text-red-500 mt-2">{message}</p>}
        </form>
    )
}

export default FormRegister