import React from 'react';
import { Upload } from 'lucide-react';

const FileUploadComponent = ({ label, file, setFile }) => {
  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-center w-full">
        <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg tracking-wide border border-blue-500 cursor-pointer hover:bg-blue-50">
          <Upload className="w-8 h-8 text-blue-500" />
          <span className="mt-2 text-base">{label}</span>
          <input
            type="file"
            className="hidden"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
          />
        </label>
      </div>
      {file && (
        <p className="mt-2 text-sm text-gray-600">
          선택된 파일: {file.name}
        </p>
      )}
    </div>
  );
};

export default FileUploadComponent;
