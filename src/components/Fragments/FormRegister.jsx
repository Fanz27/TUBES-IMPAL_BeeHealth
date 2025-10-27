import InputForm from "../Elements/Input/Index"
import Button from "../Elements/Button/Index.jsx"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { API_URL }  from "../../api.js";


const FormRegister = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');

        if (name.trim() === '' || email.trim() === '' || username.trim() === '' || password.trim() === '') {
            setMessage('Semua form harus diisi.');
            return;                                                                 
        }
        if (name.trim() === '') {
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
            console.log("Response status:");
            const response = await fetch(`${API_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    username: username.trim(),
                    password: password.trim(),
                })
            });
            console.log("Response status:", response);
            let data = {};
            if (response.headers.get("Content-Type")?.includes("application/json")) {
                data = await response.json();
            }

            if (response.ok) {
                setMessage("Registrasi anda berhasil");
                setUsername('');
                setEmail('');
                setPassword('');
                localStorage.setItem('token', data.token);
                localStorage.setItem('user_id', data.id);
                navigate('/dashboard');
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
                value={name}
                onChange={(e) => setName(e.target.value)}
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
            <InputForm 
                label="Password" 
                type="password" 
                placeholder="8+character"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            ></InputForm>
            <Button classname ="w-full" type="submit">Daftar</Button>
            {message && <p className="text-red-500 mt-2">{message}</p>}
        </form>
    )
}

export default FormRegister