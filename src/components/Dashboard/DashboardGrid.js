import React from "react";
import SalesReport from "./SalesReport";
import '../../styles/Dashboard.css';

const DashboardGrid = () => {
    return (
        <div className="dashboard-grid">
            <div className="dashboard-item">
                <SalesReport />
            </div>
            <div className="dashboard-item">
                <SalesReport />
            </div>
            <div className="dashboard-item">
                <SalesReport />
            </div>
            <div className="dashboard-item">
                <SalesReport />
            </div>
        </div>
    );
};

export default DashboardGrid;
