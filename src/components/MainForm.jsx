import React, { useState } from 'react';
import FileUploadComponent from '../components/FileUploadComponent';
import Button from './Button';
import useFileUpload from '../hooks/useFileUpload';
import { uploadFile1, uploadFile2 } from '../services/pythonapi';
import '../styles/Mainform.css'; // 스타일 파일 추가

const MainForm = () => {
  const [file1Data, setFile1Data] = useState([]);
  const [file2Data, setFile2Data] = useState([]);

  // 첫 번째 파일 업로드 훅 (업로드 후 메인 페이지로 이동)
  const {
    file: file1,
    setFile: setFile1,
    handleUploadFile: handleUploadFile1,
  } = useFileUpload(uploadFile1, '파일 1 업로드 성공!', true, setFile1Data);

  // 두 번째 파일 업로드 훅 (업로드 후 새로고침)
  const {
    file: file2,
    setFile: setFile2,
    handleUploadFile: handleUploadFile2,
  } = useFileUpload(uploadFile2, '파일 2 업로드 성공!', false, setFile2Data);

  return (
    <div className="main-content">
    <div className="min-h-screen bg-gray-100">
      {/* 네비게이션 바 삭제 */}

      {/* 메인 컨텐츠 */}
      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 첫 번째 파일 업로드 */}
          <FileUploadComponent
            label="광고 보고서를 업로드 해주세요."
            file={file1}
            setFile={setFile1}
          />
          <div className="mt-4 text-center">
            <Button onClick={handleUploadFile1}>파일 1 등록하기</Button>
          </div>

          {/* 두 번째 파일 업로드 */}
          <FileUploadComponent
            label="상품정보를 업로드 해주세요."
            file={file2}
            setFile={setFile2}
          />
          <div className="mt-4 text-center">
            <Button onClick={handleUploadFile2}>파일 2 등록하기</Button>
          </div>
        </div>

        {/* 데이터 테이블 영역 */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">분석 결과</h2>
          {/* 결과 테이블 렌더링 */}
        </div>
      </main>
    </div>
    </div>
  );
};

export default MainForm;
