import React from "react";
import SalesReport from "./SalesReport";
import '../../styles/Dashboard.css';
import TotalSalesReport from "./TotlaSalesReport";

const DashboardGrid = () => {
    return (
        <div className="dashboard-grid">
            <div className="dashboard-item">
                <TotalSalesReport />
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
