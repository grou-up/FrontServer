import { useState } from "react";

const useFileUpload = (uploadFunction, successMessage, shouldNavigate = false, setFileData = null, setUploadingGlobal) => {
  const [file, setFile] = useState([]); // 배열로 변경
  const [uploading, setUploading] = useState(false);

  const handleUploadFile = async () => {
    if (file.length === 0) { // 변경
      alert("파일을 업로드 해주세요.");
      return;
    }

    setUploading(true);
    setUploadingGlobal(true);

    try {
      for (let i = 0; i < file.length; i++) { // 여러 파일 처리 가능
        const response = await uploadFunction(file[i]);
        if (response.status !== 200) {
          throw new Error("파일 업로드 실패");
        }
      }
      alert(successMessage);
      if (setFileData) {
        setFileData(file); // 데이터 반영
      }
      if (shouldNavigate) {
        window.location.href = "/main";
      }
    } catch (error) {
      console.error("파일 업로드 오류:", error);
      alert("업로드 실패!");
    } finally {
      setUploading(false);
      setUploadingGlobal(false);
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
