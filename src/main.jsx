import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./pages/App";
import DriveFiles from "./pages/DriveFiles";
// import CreateFile from "./pages/CreateFile";
import UploadFile from "./pages/UploadFile";
import Callback from './pages/Callback';
import ViewFile from './pages/ViewFile';
import DocumentViewerPage from './pages/DocumentViewerPage';

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <Router>
      <Routes>
            <Route path="/" element={<App />} />
            <Route path="/callback" element={<Callback />} />
            <Route path="/drive/files" element={<DriveFiles />} />
            {/* <Route path="/drive/create" element={<CreateFile />} /> */}
            <Route path="/drive/view" element={<ViewFile />} />
            <Route path="/drive/upload" element={<UploadFile />} />
            <Route path="/drive/viewonly" element={<DocumentViewerPage />} />
        </Routes>
    </Router>
  </StrictMode>,
)
