import React from 'react';
import { Upload } from 'lucide-react';
import '../styles/FileUpload.css';

const FileUploadComponent = ({ label, files, setFiles, multiple = false }) => {
  const handleFileUpload = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(multiple ? (prevFiles) => [...prevFiles, ...selectedFiles] : selectedFiles);
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
            multiple={multiple} // multiple 속성 반영
          />
        </label>
      </div>
      {files.length > 0 && (
        <div className="file-upload-selected">
          {files.map((file, index) => (
            <p key={index}>선택된 파일: {file.name}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadComponent;
