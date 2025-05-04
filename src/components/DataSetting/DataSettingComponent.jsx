import React from "react";
import "./DataSettingComponent.css";
import DataDeletionComponent from "./DataDeletionComponent"; // 데이터 삭제 컴포넌트
import DataHistoryComponent from "./DataHistoryComponent";   // 데이터 이력 컴포넌트

const DataSettingComponent = ({ }) => {
    return (
        <div className="dataSetting_container">
            <DataDeletionComponent />
            <DataHistoryComponent />
        </div>
    );
};

export default DataSettingComponent;
