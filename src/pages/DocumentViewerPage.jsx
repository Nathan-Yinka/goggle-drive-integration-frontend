import React, { useState, useRef } from "react";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import { renderAsync } from "docx-preview"; // Correct named import

const DocumentViewerPage = () => {
    const [documents, setDocuments] = useState([]);
    const [docxContent, setDocxContent] = useState(false);
    const docxContainerRef = useRef(null);

    const handleFileUpload = (event) => {
        const uploadedFile = event.target.files[0];

        if (!uploadedFile) return;

        const allowedTypes = [
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
            "application/vnd.openxmlformats-officedocument.presentationml.presentation", // PPTX
            "application/pdf", // PDF
            "text/plain", // TXT
            "image/png", // PNG
            "image/jpeg", // JPG
        ];

        if (!allowedTypes.includes(uploadedFile.type)) {
            alert("❌ Unsupported file type! Please upload a valid file.");
            return;
        }

        const fileURL = URL.createObjectURL(uploadedFile);

        if (uploadedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            // Read .docx file and render it
            const reader = new FileReader();
            reader.readAsArrayBuffer(uploadedFile);
            reader.onload = async (e) => {
                const arrayBuffer = e.target.result;

                if (docxContainerRef.current) {
                    docxContainerRef.current.innerHTML = ""; // Clear previous content
                    await renderAsync(arrayBuffer, docxContainerRef.current); // Render DOCX
                }
                setDocxContent(true); // Show DOCX preview
                setDocuments([]); // Clear other document viewers
            };
        } else {
            setDocxContent(false);
            setDocuments([{ uri: fileURL, fileType: uploadedFile.type }]);
        }
    };

    return (
        <iframe 
    src="https://drive.google.com/file/d/1_Jp5LUPeyoZzI0EK7bQbDOBWwKznFKmggIZ33X2KW1E/preview"
    width="100%"
    height="600px"
    style="width: 100vw; height: 900px; border: none; background-color: white; display: block;"
   >
</iframe>

    );
};

export default DocumentViewerPage;
