import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useFileUpload = (uploadFunction, successMessage, shouldNavigate = false, setFileData = null) => {
  const [file, setFile] = useState(null);
  const handleUploadFile = async () => {
    if (!file) {
      alert('파일을 업로드 해주세요.');
      return;
    }

    try {
      const response = await uploadFunction(file);
      if (response.status === 200) {
        alert(successMessage);
        if (setFileData && response.data) {
          setFileData(response.data);
        }
        if (shouldNavigate) {
          window.location.href = '/main';
        }
      } else {
        alert('업로드 실패!');
      }
    } catch (error) {
      console.error('파일 업로드 오류:', error);
      alert('업로드 실패!');
    }
  };

  return {
    file,
    setFile,
    handleUploadFile,
  };
};

export default useFileUpload;
