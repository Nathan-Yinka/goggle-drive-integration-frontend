import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Callback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            localStorage.setItem("accessToken", token);
            navigate("/drive/files"); // ✅ Redirect user to files page
        } else {
            console.error("Authentication failed");
            navigate("/");
        }
    }, [navigate, searchParams]);

    return <h2>Authenticating...</h2>;
};

export default Callback;
