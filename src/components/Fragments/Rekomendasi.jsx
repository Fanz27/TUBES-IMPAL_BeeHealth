import React, {useEffect, useState} from "react";
import api from "../../api";

const Rekomendasi = () => {
    const [rekomendasi, setRekomendasi] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [kaloriMasukan, setKaloriMasukan] = useState(0);
    const [kaloriTarget, setKaloriTarget] = useState(0);
    

    const handleSubmit = (e) => {
        e.preventDefault();
        setRekomendasi([]);
        setLoading(true);
        setError(null);

    };
    
    return (
        <div>Rekomendasi</div>
    )
}

export default Rekomendasi;