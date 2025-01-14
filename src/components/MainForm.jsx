import React from "react";
import DashboardGrid from "../components/Dashboard/DashboardGrid";
import "../styles/Mainform.css"; // 메인 폼 전용 스타일

const MainForm = () => {
  return (
    <div className="form-main-content">
      <div className="form-fixed-screen bg-gray-100">
        <main className="form-dashboard-container">
          <DashboardGrid />
        </main>
      </div>
    </div>
  );
};
export default MainForm;
