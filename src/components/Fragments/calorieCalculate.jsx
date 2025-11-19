import React from "react";
import axios from "axios";
import { useState } from "react";
import { API_URL } from "../../api";
import InputForm from "../Elements/Input/Index";
import Button from "../Elements/Button/Index";
import ResultsDisplay from "./ResultsDisplay";

const CalorieCalculate = () => { 
    const [formData, setFormData] = useState({
        gender: "male",
        age: 20,
        height: 160,
        weight: 60,
        goal: "maintenance",
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
            const token = localStorage.getItem("AuthToken");
            const id = localStorage.getItem("userId");
            if (!token) {
                setError("User not authenticated. Please log in.");
                setLoading(false);
                return;
            }

            if (!id) {
                setError("User ID not found. Please log in again.");
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

            console.log("Data yang dikirim ke backend:", payload);

            const response = await axios.post(API_PATH, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setResults(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Error occurred while calculating calories."
            );
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
                <div className="form-group-radio">
                    <label className="block font-mmedium mb-2">Gender</label>
                    <div className="radio-options flex items-center gap-6">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="gender"
                                value="Male"
                                checked={formData.gender === "Male"}
                                onChange={handleChange}
                            />
                            Male
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="gender"
                                value="Female"
                                checked={formData.gender === "Female"}
                                onChange={handleChange}
                            />
                            Female
                        </label>
                    </div>
                </div>
                <input className="text-sm border rounded w-full py-2 px-3 text-slate-700 placeholder: opacity-50"
                    label="Age" 
                    type="number" 
                    placeholder="Enter your age" 
                    name="age" 
                    value={formData.age}
                    onChange={handleChange} 
                />
                <input className="text-sm border rounded w-full py-2 px-3 text-slate-700 placeholder: opacity-50"
                    label="Height (cm)" 
                    type="number" 
                    placeholder="Enter your height in cm" 
                    name="height" 
                    value={formData.height} 
                    onChange={handleChange} 
                />
                <input className="text-sm border rounded w-full py-2 px-3 text-slate-700 placeholder: opacity-50"
                    label="Weight (kg)" 
                    type="number" 
                    placeholder="Enter your weight in kg"
                    name="weight" 
                    value={formData.weight} 
                    onChange={handleChange} 
                />
                
                <Button type="submit" className="" disabled={loading}>
                    Calculate
                </Button>
            </form>
            {error && <div className="error-message">{error}</div>}
            {results && <ResultsDisplay results={results} formData={formData} />}
        </div>
    );
};

export default CalorieCalculate;