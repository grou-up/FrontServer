import { useState } from "react";

const useFileUpload = (uploadFunction, successMessage, shouldNavigate = false, setFileData = null, setUploadingGlobal) => {
  const [file, setFile] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUploadFile = async () => {
    if (file.length === 0) {
      alert("파일을 업로드 해주세요.");
      return false;
    }

    setUploading(true);
    setUploadingGlobal(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < file.length; i++) {
        const progressCallback = (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        };

        const response = await uploadFunction(file[i], progressCallback);
        if (response.status !== 200) {
          throw new Error("파일 업로드 실패");
        }
      }
      alert(successMessage);
      window.location.reload();
      if (setFileData) setFileData(file);
      return true;
    } catch (error) {
      console.error("업로드 오류:", error);
      alert("업로드 실패!");
      return false;
    } finally {
      setUploading(false);
      setUploadingGlobal(false);
      setUploadProgress(0);
    }
  };

  return {
    file,
    setFile,
    handleUploadFile,
    uploading,
    uploadProgress,
  };
};

export default useFileUpload;