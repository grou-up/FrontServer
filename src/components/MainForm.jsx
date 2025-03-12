import { React, useEffect } from "react";
import DashboardGrid from "../components/Dashboard/DashboardGrid";
import "../styles/Mainform.css"; // 메인 폼 전용 스타일

const MainForm = () => {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=0.3';
    document.head.appendChild(meta)
  }, []); // 빈 배열([])을 넣으면 컴포넌트가 처음 렌더링될 때만 실행됨
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
