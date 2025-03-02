import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UploadFile = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file first!");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            // ✅ Upload file without email
            const response = await fetch(`${API_BASE_URL}/drive/upload`, {
                method: "POST",
                body: formData
            });

            if (!response.ok) throw new Error("Upload failed!");

            const data = await response.json();
            console.log(data)
            alert(`✅ File uploaded successfully! Redirecting to edit...`);

            // ✅ Redirect to ViewFile page with the edit link
            navigate(`/drive/view?embedLink=${encodeURIComponent(data.editLink)}&fileId=${data.fileId}`);
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("❌ File upload failed.");
        }
        setLoading(false);
    };

    return (
        <div>
            <h2>Upload a File to Google Drive</h2>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={handleUpload} disabled={loading}>
                {loading ? "Uploading..." : "📤 Upload & Edit"}
            </button>
        </div>
    );
};

export default UploadFile;
