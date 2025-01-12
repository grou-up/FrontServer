import React from "react";
import DashboardGrid from "../components/Dashboard/DashboardGrid";

const MainForm = () => {
  return (
    <div className="main-content">
      <div className="fixed-screen bg-gray-100">
        <main className="dashboard-container">
          <DashboardGrid />
        </main>
      </div>
    </div>
  );
};

export default MainForm;
