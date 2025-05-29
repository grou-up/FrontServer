// FileMarginReport.jsx
import React, { useState } from "react";
import FileUploadComponent from "../FileUploadComponent";
import UploadButton from "../Upload/UploadButton";
import useFileUpload from "../../hooks/useFileUpload";
import { CircleHelp } from "lucide-react";
import { uploadFile3 } from "../../services/pythonapi";
import "../../styles/FileUpload.css";

const FileMarginReport = () => {
    // 1) 날짜 상태 (초기값: 오늘)
    const [selectedDate, setSelectedDate] = useState(
        () => new Date().toISOString().slice(0, 10)
    );
    const [showHelp, setShowHelp] = useState(false);
    const [uploadingGlobal, setUploadingGlobal] = useState(false);

    // 2) 날짜를 함께 넘기는 래퍼 함수
    const uploadWithDate = (file, onUploadProgress) => {
        // uploadFile3(file, date, onUploadProgress) 시그니처에 맞춰 호출
        return uploadFile3(file, selectedDate, onUploadProgress);
    };

    // 3) useFileUpload 훅에 래퍼 전달
    const {
        file: file3,
        setFile: setFile3,
        handleUploadFile: handleUploadFile3,
    } = useFileUpload(
        uploadWithDate,
        "마진 보고서 업로드 성공!",
        false,
        null,
        setUploadingGlobal
    );

    // 4) 파일 레이블에 날짜_파일명 적용
    const fileLabel = (() => {
        if (file3.length === 0) return "판매 분석 보고서를 업로드 해주세요.";
        if (file3.length === 1) {
            return `선택된 파일: ${selectedDate}_${file3[0].name}`;
        }
        return `선택된 파일 ${file3.length}개`;
    })();

    return (
        <div className="file-card file-margin-report">
            <div className="upload-title-row">
                <h2 className="upload-title">마진 보고서</h2>

                <CircleHelp
                    className="help-icon"
                    onClick={() => setShowHelp(true)}
                    style={{ cursor: "pointer" }}
                />

                <input
                    type="date"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    className="date-input"
                />
            </div>

            <FileUploadComponent
                label={fileLabel}
                files={file3}
                setFiles={setFile3}
                multiple={false}
            />

            <div className="file-upload-wrapper">
                <UploadButton
                    onClick={handleUploadFile3}
                    className="upload-action-button"
                    disabled={uploadingGlobal}
                >
                    파일 업로드
                </UploadButton>
            </div>

            {/* 도움말 모달 */}
            {showHelp && (
                <div className="help-overlay" onClick={() => setShowHelp(false)}>
                    <div className="help-modal">
                        <img
                            src={require("../../images/MarginReport.png")}
                            alt="도움말"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileMarginReport;
