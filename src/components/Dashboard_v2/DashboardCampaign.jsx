import React from 'react';
import "../../styles/Dashboard/DashboardCampaign.css";

const DashboardCampaign = () => {
    return (
        <div className="dashboard-card dashboard-campaign">
            <div className="card-label">개발중</div>
            {/* <div className="campaign-list">
                <table className="campaign-table">
                    <thead>
                        <tr>
                            <th>캠페인명</th>
                            <th>기간</th>
                            <th>작업</th>
                        </tr>
                    </thead>
                    <tbody className="campaign-table-body-scroll">
                         {Array(10).fill(0).map((_, i) => (
                            <tr key={i}>
                                <td>반팔티 {i + 1}</td>
                                <td className="campaign-date">~25.05.29</td>
                                <td><button className="view-button">연장하기</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div> */}
        </div>
    );
};

export default DashboardCampaign;
