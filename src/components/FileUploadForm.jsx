import React, { useState, useEffect } from "react";
import FileUploadComponent from "../components/FileUploadComponent";
import Button from "./Button";
import useFileUpload from "../hooks/useFileUpload";
import { CircleHelp } from "lucide-react";
import { uploadFile1, uploadFile3 } from "../services/pythonapi";
import "../styles/Mainform.css";
import "../styles/FileUpload.css";

const FileUploadForm = () => {
  const [file1Data, setFile1Data] = useState([]);
  const [file3Data, setFile3Data] = useState([]);
  const [activeDescription, setActiveDescription] = useState("");
  const [uploadingGlobal, setUploadingGlobal] = useState(false); // 전체 로딩 상태
  const [uploadText, setUploadText] = useState("업로드 중"); // 업로드 텍스트 상태

  useEffect(() => {
    let interval;

    if (uploadingGlobal) {
      interval = setInterval(() => {
        setUploadText((prev) => {
          if (prev.length < 10) {
            return prev + ".";
          }
          return "업로드 중"; // 텍스트 길이가 15를 넘으면 초기화
        });
      }, 500); // 500ms마다 점을 추가
    }

    return () => {
      clearInterval(interval); // 컴포넌트가 언마운트될 때 인터벌 정리
    };
  }, [uploadingGlobal]);

  const descriptions = {
    광고보고서: {
      imageSrc: require("../images/SalesReport.png"),
      description: "광고 보고서를 업로드하세요. 광고 클릭, 노출수, 광고비 등의 데이터가 포함됩니다.",
    },
    상품정보: {
      description: "하루 마진 데이터를 업로드 해주세요.",
    },
  };

  const handleDescriptionChange = (section) => {
    setActiveDescription(descriptions[section]);
  };

  // 광고 보고서 업로드 훅
  const {
    file: file1,
    setFile: setFile1,
    handleUploadFile: handleUploadFile1,
  } = useFileUpload(uploadFile1, "광고 보고서 업로드 성공!", false, setFile1Data, setUploadingGlobal);

  // 상품 정보 업로드 훅
  const {
    file: file3,
    setFile: setFile3,
    handleUploadFile: handleUploadFile3,
  } = useFileUpload(uploadFile3, "마진 보고서 업로드 성공!", false, setFile3Data, setUploadingGlobal);

  return (
    <div className="upload-content">
      <h1 className="text-3xl font-bold text-left mb-8">파일 업로드</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 광고 보고서 업로드 */}
        <div className="upload-card">
          <h2 className="upload-title">광고 보고서</h2>
          <button className="upload-button" onClick={() => handleDescriptionChange("광고보고서")}>
            <div className="icon-next-to">
              <CircleHelp />
              도움말
            </div>
          </button>
          <FileUploadComponent label="광고 보고서를 업로드 해주세요." file={file1} setFile={setFile1} />
          <div className="mt-4 text-center">
            <Button onClick={handleUploadFile1}>업로드</Button>
          </div>
        </div>

        {/* 상품 정보 업로드 */}
        <div className="upload-card">
          <h2 className="upload-title">일일 마진 보고서</h2>
          <button className="upload-button" onClick={() => handleDescriptionChange("상품정보")}>
            <div className="icon-next-to">
              <CircleHelp />
              도움말
            </div>
          </button>
          <FileUploadComponent label="일일 마진 데이터 업로드 해주세요." file={file3} setFile={setFile3} />
          <div className="mt-4 text-center">
            <Button onClick={handleUploadFile3}>업로드</Button>
          </div>
        </div>
      </div>

      {/* 도움말 설명 */}
      {activeDescription && (
        <div className="help-box">
          {activeDescription.imageSrc && <img src={activeDescription.imageSrc} alt="도움말 이미지" />}
          <p>{activeDescription.description}</p>
        </div>
      )}

      {/* 업로드 진행 중일 때 화면 전체 블러 & 스피너 표시 */}
      {uploadingGlobal && (
        <div className="overlay">
          <div className="spinner"></div>
          <p className="overlay-text">{uploadText}</p> {/* 동적으로 변경된 업로드 텍스트 */}
        </div>
      )}
    </div>
  );
};

export default FileUploadForm;
