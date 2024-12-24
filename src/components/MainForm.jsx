import React, { useState } from 'react';
import FileUploadComponent from '../components/FileUploadComponent';
import Button from './Button';
import useFileUpload from '../hooks/useFileUpload';
import { uploadFile1, uploadFile2 } from '../services/pythonapi';
import '../styles/Mainform.css'; // 스타일 파일 추가
import KeywordComponent from '../components/KeywordComponent'; // 추가
import Totalsearchbar from './Totalsearchbar';

const MainForm = () => {
  return (
    <div className="main-content">
      <div className="min-h-screen bg-gray-100">
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">대시보드</h2>
        </div>
        <main className="container mx-auto p-6">
          {/* <Totalsearchbar /> */}
          <div className="mt-8">
            {/* <KeywordComponent /> */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainForm;
