import React, { useState } from 'react';
import FileUploadComponent from '../components/FileUploadComponent';
import Button from './Button';
import useFileUpload from '../hooks/useFileUpload';
import { CircleHelp } from 'lucide-react';
import { uploadFile1, uploadFile2, uploadFile3 } from '../services/pythonapi';
import '../styles/Mainform.css'; // 스타일 파일 추가
import '../styles/FileUpload.css';
const FileUploadForm = () => {
  const [file1Data, setFile1Data] = useState([]);
  const [file2Data, setFile2Data] = useState([]);
  const [file3Data, setFile3Data] = useState([]);
  const [activeDescription, setActiveDescription] = useState(''); // 활성화된 설명

  const descriptions = {
    광고보고서: {
      imageSrc: require('../images/SalesReport.png'),
      description: '광고 보고서를 업로드하세요. 광고 클릭, 노출수, 광고비 등의 데이터가 포함됩니다.',
    },
    판매내역: {
      // imageSrc: ,
      description: '판매 내역을 업로드하세요. 날짜별 판매량, 총 매출액, 환불 데이터가 포함됩니다.',
    },
    상품정보: {
      // imageSrc: ,
      description: '상품 정보를 업로드하세요. 상품명, 옵션명, 가격 등의 데이터가 포함됩니다.',
    },
  };

  const handleDescriptionChange = (section) => {
    setActiveDescription(descriptions[section]);
  };

  // 첫 번째 파일 업로드 훅
  const {
    file: file1,
    setFile: setFile1,
    handleUploadFile: handleUploadFile1,
  } = useFileUpload(uploadFile1, '광고 보고서 업로드 성공!', false, setFile1Data);

  // 두 번째 파일 업로드 훅
  const {
    file: file2,
    setFile: setFile2,
    handleUploadFile: handleUploadFile2,
  } = useFileUpload(uploadFile2, '판매 내역 업로드 성공!', false, setFile2Data);

  // 세 번째 파일 업로드 훅
  const {
    file: file3,
    setFile: setFile3,
    handleUploadFile: handleUploadFile3,
  } = useFileUpload(uploadFile3, '상품 정보 업로드 성공!', false, setFile3Data);

  return (
    <div className="upload-content min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-lfet mb-8">파일 업로드</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 광고 보고서 업로드 */}
        <div className="bg-white rounded-lg shadow-md p-6 relative">
          <h2 className="text-xl font-semibold mb-4">광고 보고서</h2>
          <button
            className="absolute top-4 right-4 text-sm text-blue-500 underline"
            onClick={() => handleDescriptionChange('광고보고서')}
          >
            <div className="icon-next-to">
              <CircleHelp />
              도움말
            </div>
          </button>
          <FileUploadComponent
            label="광고 보고서를 업로드 해주세요."
            file={file1}
            setFile={setFile1}
          />
          <div className="mt-4 text-center">
            <Button onClick={handleUploadFile1}>업로드</Button>
          </div>
        </div>

        {/* 판매 내역 업로드 */}
        <div className="bg-white rounded-lg shadow-md p-6 relative">
          <h2 className="text-xl font-semibold mb-4">판매 내역</h2>
          <button
            className="absolute top-4 right-4 text-sm text-blue-500 underline"
            onClick={() => handleDescriptionChange('판매내역')}
          >

            <div className="icon-next-to">
              <CircleHelp />
              도움말
            </div>
          </button>
          <FileUploadComponent
            label="판매 내역을 업로드 해주세요."
            file={file2}
            setFile={setFile2}
          />
          <div className="mt-4 text-center">
            <Button onClick={handleUploadFile2}>업로드</Button>
          </div>
        </div>

        {/* 상품 정보 업로드 */}
        <div className="bg-white rounded-lg shadow-md p-6 relative">
          <h2 className="text-xl font-semibold mb-4">상품 정보</h2>
          <button
            className="absolute top-4 right-4 text-sm text-blue-500 underline"
            onClick={() => handleDescriptionChange('상품정보')}
          >
            <div className="icon-next-to">
              <CircleHelp />
              도움말
            </div>

          </button>
          <FileUploadComponent
            label="상품 정보를 업로드 해주세요."
            file={file3}
            setFile={setFile3}
          />
          <div className="mt-4 text-center">
            <Button onClick={handleUploadFile3}>업로드</Button>
          </div>
        </div>
      </div>

      {/* 도움말 설명 */}
      {activeDescription && (
        <div className="mt-8 bg-blue-100 text-blue-800 p-4 rounded-lg">
          <img
            src={activeDescription.imageSrc}
            alt="도움말 이미지"
            className="w-full h-auto mb-4"
          />
          <p>{activeDescription.description}</p>
        </div>
      )}
    </div>
  );
};

export default FileUploadForm;
