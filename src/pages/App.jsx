import React, { useState, useEffect } from "react";
import { getAuthUrl } from "../api";
import { useNavigate } from "react-router-dom";

const App = () => {
    const [authUrl, setAuthUrl] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAuth = async () => {
            const url = await getAuthUrl();
            setAuthUrl(url);
        };
        fetchAuth();
    }, []);

    return (
        <div>
            <h1>Google Drive Integration</h1>
            {authUrl ? (
                <button onClick={() => window.location.href = authUrl}>Login with Google</button>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default App;
