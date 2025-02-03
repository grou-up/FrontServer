import React from 'react';
import { Upload } from 'lucide-react';
import '../styles/FileUpload.css';


const FileUploadComponent = ({ label, file, setFile }) => {
  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  return (
    <div className="file-upload-container">
      <div className="file-upload-wrapper">
        <label className="file-upload-label">
          <Upload className="file-upload-icon" />
          <span className="file-upload-text">{label}</span>
          <input
            type="file"
            className="file-upload-input"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
          />
        </label>
      </div>
      {file && <p className="file-upload-selected">선택된 파일: {file.name}</p>}
    </div>
  );
};

export default FileUploadComponent;

