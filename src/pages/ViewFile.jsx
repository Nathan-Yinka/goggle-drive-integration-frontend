import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ViewFile = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const embedLink = new URLSearchParams(location.search).get("embedLink");
    const fileId = new URLSearchParams(location.search).get("fileId");
    const [saving, setSaving] = useState(false);

    // 🔹 Function to Download File from API
    const downloadFile = async () => {
        if (!fileId) {
            alert("Error: File ID not found!");
            return;
        }

        setSaving(true);
        try {
            const response = await fetch(`http://localhost:8000/drive/download-file?file_id=${fileId}`);
            if (!response.ok) throw new Error("Failed to fetch file");

            // Extract file metadata from headers
            const contentDisposition = response.headers.get("Content-Disposition");
            const mimeType = response.headers.get("Content-Type") || "application/octet-stream";

            let originalFileName = "downloaded_file";  // Default fallback
            if (contentDisposition) {
                const match = contentDisposition.match(/filename="(.+)"/);
                if (match) originalFileName = match[1]; // ✅ Extract filename correctly
            }

            // Convert response to Blob
            const blob = await response.blob();

            console.log("📄 Extracted File Name:", originalFileName);
            console.log("📌 MIME Type:", mimeType);

            // ✅ Pass correct parameters
            await uploadToSnaarp(blob, originalFileName, mimeType);
        } catch (error) {
            console.error("Error downloading file:", error);
            alert("❌ Failed to download file.");
        }
        setSaving(false);
    };


    // 🔹 Log Blob and Download with Correct File Name
    const uploadToSnaarp = async (blob, originalFileName, mimeType) => {
        console.log("🔹 File Blob:", blob);
        console.log("📄 Original File Name:", originalFileName);
        console.log("📌 MIME Type:", mimeType);

        // 🔹 Determine file extension based on MIME type
        const mimeToExtension = {
            "application/pdf": ".pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
            "text/plain": ".txt",
            "image/png": ".png",
            "image/jpeg": ".jpg",
            "image/gif": ".gif",
            "application/zip": ".zip",
            "application/json": ".json"
        };

        // Use original filename or fallback
        const fileExtension = mimeToExtension[mimeType] || "";
        const sanitizedFileName = originalFileName ? originalFileName.replace(/\s+/g, "_") : "downloaded_file";
        const finalFileName = `${sanitizedFileName}${fileExtension}`;

        console.log("✅ Final File Name:", finalFileName);

        // 🔹 Create a local download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = finalFileName; // ✅ Uses correct file name and extension
        document.body.appendChild(a);
        a.click();

        // 🔹 Cleanup
        window.URL.revokeObjectURL(url);
    };


    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            {/* 🔹 Fixed Header */}
            <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                background: "#fff",
                padding: "10px",
                boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
                zIndex: 1000,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <h2 style={{ margin: 0 }}>Google Document Editor</h2>
                <div>
                    <button onClick={() => navigate("/drive/files")}>⬅ Back to Files</button>
                    <button onClick={downloadFile} disabled={saving} style={{ marginLeft: "10px" }}>
                        {saving ? "Saving..." : "💾 Save to Snaarp"}
                    </button>
                </div>
            </div>

            {/* 🔹 Full Page Iframe Below Header */}
            <div style={{ flexGrow: 1, marginTop: "60px", overflow: "hidden" }}>
                {embedLink ? (
                    <iframe
                        id="docFrame"
                        src={embedLink}
                        width="100%"
                        height="100%"
                        style={{
                            border: "none",
                            position: "absolute",
                            top: "60px", // Push down below header
                            left: 0,
                            width: "100%",
                            height: "calc(100vh - 60px)", // Fill remaining height
                        }}
                        allow="clipboard-write"
                    ></iframe>
                ) : (
                    <p>Error: No valid file link provided.</p>
                )}
            </div>
        </div>
    );
};

export default ViewFile;
