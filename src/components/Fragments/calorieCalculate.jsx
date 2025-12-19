import axios from "axios";
import { useState } from "react";
// import { API_URL } from "../../api";
import Button from "../Elements/Button/Index";
import ResultsDisplay from "./ResultsDisplay";

const API_URL = import.meta.env.VITE_API_URL;

const CalorieCalculate = () => { 
    const [formData, setFormData] = useState({
        gender: "MALE",
        age: 20,
        height: 160,
        weight: 60,
        goal: "CUTTING",
    });
    
    const API_PATH = `${API_URL}/user/calculate`;
    
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => { 
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResults(null);

        try {
            // PERBAIKAN: Coba berbagai kemungkinan key untuk token
            const token = localStorage.getItem("AuthToken") || 
                         localStorage.getItem("token") || 
                         localStorage.getItem("authToken");
            
            // PERBAIKAN: Coba berbagai kemungkinan key untuk userId
            const id = localStorage.getItem("userId") || 
                      localStorage.getItem("userid") || 
                      localStorage.getItem("userId");
            

            if (!token) {
                setError("Token tidak ditemukan. Silakan login kembali.");
                setLoading(false);
                return;
            }

            if (!id) {
                setError("User ID tidak ditemukan. Silakan login kembali.");
                setLoading(false);
                return;
            }

            const payload = {
                userId: id,
                gender: formData.gender,
                age: parseInt(formData.age),
                height: parseFloat(formData.height),
                weight: parseFloat(formData.weight),
                goal: formData.goal,
            };

            const response = await axios.post(API_PATH, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });

            console.log("Response berhasil:", response.data);
            setResults(response.data);
        } catch (err) {
            console.error("Error detail:", err);
            console.error("Error response:", err.response);
            
            if (err.response?.status === 401) {
                setError("Sesi Anda telah berakhir. Silakan login kembali.");
            } else if (err.response?.status === 500) {
                setError(
                    err.response?.data?.message || 
                    "Terjadi kesalahan server. Periksa data yang dikirim."
                );
            } else {
                setError(
                    err.response?.data?.message ||
                    err.response?.data?.error ||
                    "Terjadi kesalahan saat menghitung kalori."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return ( 
        <div className="calorie-calculator-container p-5 font-sans">
            <h3 className="text-lg font-semibold mb-4">
                Let's Calculate your Calorie!
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* GENDER */}
                <div className="form-group-radio">
                    <label className="block font-medium mb-2">Gender</label>
                    <div className="radio-options flex items-center gap-6">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="gender"
                                value="MALE"
                                checked={formData.gender === "MALE"}
                                onChange={handleChange}
                                
                            />
                            Male
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="gender"
                                value="FEMALE"
                                checked={formData.gender === "FEMALE"}
                                onChange={handleChange}
                            />
                            Female
                        </label>
                    </div>
                </div>

                {/* AGE */}
                <label className="block">
                    Age
                    <input
                        className="text-sm border rounded w-full py-2 px-3 mt-1 text-slate-700 placeholder:opacity-50"
                        type="number"
                        placeholder="Enter your age"
                        name="age"
                        // value={formData.age}
                        onChange={handleChange}
                        min="1"
                        max="120"
                        required
                    />
                </label>

                {/* HEIGHT */}
                <label className="block">
                    Height (cm)
                    <input
                        className="text-sm border rounded w-full py-2 px-3 mt-1 text-slate-700 placeholder:opacity-50"
                        type="number"
                        placeholder="Enter your height in cm"
                        name="height"
                        // value={formData.height}
                        onChange={handleChange}
                        min="50"
                        max="300"
                        required
                    />
                </label>

                {/* WEIGHT */}
                <label className="block">
                    Weight (kg)
                    <input
                        className="text-sm border rounded w-full py-2 px-3 mt-1 text-slate-700 placeholder:opacity-50"
                        type="number"
                        placeholder="Enter your weight in kg"
                        name="weight"
                        // value={formData.weight}
                        onChange={handleChange}
                        min="20"
                        max="500"
                        required
                    />
                </label>

                <label className="block">
                    Goal
                    <select
                        className="text-sm border rounded w-full py-2 px-3 mt-1 text-slate-700"
                        name="goal"
                        // value={formData.goal}
                        onChange={handleChange}
                    >
                        <option value="CUTTING">Cutting</option>
                        <option value="BULKING">Bulking</option>
                        {/* <option value="weight_gain">Weight Gain</option> */}
                    </select>
                </label>

                <Button type="submit" disabled={loading}>
                    {loading ? "Calculating..." : "Calculate"}
                </Button>
            </form>

            {error && (
                <div className="error-message mt-3 p-3 bg-red-100 text-red-700 rounded border border-red-300">
                    {error}
                </div>
            )}
            {results && <ResultsDisplay results={results} formData={formData} />}
        </div>
    );
};

export default CalorieCalculate;