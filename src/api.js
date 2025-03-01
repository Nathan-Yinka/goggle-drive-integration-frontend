import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 🔹 Get Google OAuth URL
export const getAuthUrl = async () => {
    const response = await axios.get(`${API_BASE_URL}/auth`);
    return response.data.authUrl;
};

// 🔹 Handle OAuth Callback and Retrieve Tokens
export const handleAuthCallback = async (code) => {
    const response = await axios.get(`${API_BASE_URL}/auth/callback`, { params: { code } });
    return response.data;
};

// 🔹 Get User's Google Drive Files
export const fetchFiles = async (pageToken = null) => {
    const response = await axios.get(`${API_BASE_URL}/drive/files`, { params: { page_token: pageToken } });
    return response.data;
};

// 🔹 Create Google Docs, Sheets, etc.
export const createFile = async (title, fileType, email) => {
    const response = await axios.post(`${API_BASE_URL}/drive/create-file`, null, {
        params: { title, file_type: fileType, user_email: email },
    });
    return response.data;
};

// 🔹 Upload File to Google Drive
export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${API_BASE_URL}/drive/upload`, formData);
    return response.data;
};
