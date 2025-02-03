import { useState } from "react";

const useFileUpload = (uploadFunction, successMessage, shouldNavigate = false, setFileData = null, setUploadingGlobal) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUploadFile = async () => {
    if (!file) {
      alert("파일을 업로드 해주세요.");
      return;
    }

    setUploading(true);
    setUploadingGlobal(true); // 전체 로딩 상태 업데이트

    try {
      const response = await uploadFunction(file);
      if (response.status === 200) {
        alert(successMessage);
        if (setFileData && response.data) {
          setFileData(response.data);
        }
        if (shouldNavigate) {
          window.location.href = "/main";
        }
      } else {
        alert("업로드 실패!");
      }
    } catch (error) {
      console.error("파일 업로드 오류:", error);
      alert("업로드 실패!");
    } finally {
      setUploading(false);
      setUploadingGlobal(false); // 업로드 종료 후 로딩 해제
    }
  };

  return {
    file,
    setFile,
    handleUploadFile,
    uploading,
  };
};

export default useFileUpload;
