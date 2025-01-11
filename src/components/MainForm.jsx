import React from "react";
import DashboardGrid from "../components/Dashboard/DashboardGrid";
import "../styles/Mainform.css";

const MainForm = () => {
  return (
    <div className="main-content">
      <div className="fixed-screen bg-gray-100">
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">대시보드</h2>
        </div>
        <main className="dashboard-container">
          <DashboardGrid />
        </main>
      </div>
    </div>
  );
};

export default MainForm;
