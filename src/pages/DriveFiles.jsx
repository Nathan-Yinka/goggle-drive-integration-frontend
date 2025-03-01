import React, { useState, useEffect } from "react";
import { fetchFiles, createFile } from "../api";
import { useNavigate } from "react-router-dom";

const DriveFiles = () => {
    const [files, setFiles] = useState([]);
    const [nextPageToken, setNextPageToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadFiles();
    }, []);

    const loadFiles = async (pageToken = null) => {
        setLoading(true);
        try {
            const response = await fetchFiles(pageToken);
            setFiles(response.files);
            setNextPageToken(response.nextPageToken);
        } catch (error) {
            console.error("Error fetching files:", error);
        }
        setLoading(false);
    };

    // ✅ Create a Google Docs, Sheet, Slide, etc. and Redirect
    const handleCreateFile = async (fileType) => {
        const title = prompt(`Enter a title for your new ${fileType}:`);
        const userEmail = prompt("Enter your email to share the file:");

        if (title && userEmail) {
            setLoading(true);
            try {
                const response = await createFile(title, fileType, userEmail);

                // ✅ Get `fileId` and `editLink`
                const { fileId, editLink } = response;

                alert(`${fileType} Created! Redirecting to the document...`);

                // ✅ Redirect to the new document page with `fileId`
                navigate(`/drive/view?embedLink=${encodeURIComponent(editLink)}&fileId=${fileId}&fileType=${fileType}`);
            } catch (error) {
                console.error(`Error creating ${fileType}:`, error);
            }
            setLoading(false);
        }
    };


    // ✅ Handle Click on File to View Inside iFrame
    const handleFileClick = (file) => {
        const embedLink = file.webViewLink.replace("/view", "/preview"); // Ensure it's embeddable
        navigate(`/drive/view?embedLink=${encodeURIComponent(embedLink)}&fileId=${file.id}`);
    };

    return (
        <div>
            <h2>Your Google Drive Files</h2>

            {/* 🔹 File Creation Buttons */}
            <div>
                <button onClick={() => handleCreateFile("doc")}>➕ Create Google Doc</button>
                <button onClick={() => handleCreateFile("sheet")}>➕ Create Google Sheet</button>
                <button onClick={() => handleCreateFile("slide")}>➕ Create Google Slide</button>
                {/* <button onClick={() => handleCreateFile("form")}>➕ Create Google Form</button> */}
                {/* <button onClick={() => handleCreateFile("drawing")}>➕ Create Google Drawing</button> */}
            </div>

            {/* 🔹 Upload File */}
            <div>
                <button onClick={() => navigate("/drive/upload")}>📤 Upload File</button>
            </div>

            {/* 🔹 Refresh Files Button */}
            <button onClick={() => loadFiles()} disabled={loading}>
                {loading ? "Loading..." : "🔄 Refresh Files"}
            </button>

            {/* 🔹 List Files */}
            {files.length > 0 ? (
                <ul>
                    {files.map((file) => (
                        <li key={file.id} onClick={() => handleFileClick(file)} style={{ cursor: "pointer", color: "blue" }}>
                            {file.name} ({file.mimeType})
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No files found.</p>
            )}

            {/* 🔹 Pagination Button */}
            {nextPageToken && (
                <button onClick={() => loadFiles(nextPageToken)}>➡ Next Page</button>
            )}
        </div>
    );
};

export default DriveFiles;
