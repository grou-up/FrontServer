import React from "react";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const TotalGraph = ({ data }) => {
    if (!data || data.length === 0) {
        return <p style={{ textAlign: "center", padding: "20px" }}>시각화할 데이터가 없습니다.</p>;
    }

    // 차트 데이터 구성
    const chartData = {
        labels: data.map((item) => item.date), // x축: 날짜
        datasets: [
            {
                label: "총 매출",
                data: data.map((item) => item.totalSales), // 총 매출 데이터
                borderColor: "rgba(255, 99, 132, 1)", // 빨간색 선
                backgroundColor: "rgba(255, 99, 132, 0.2)", // 빨간색 배경
                fill: true,
                tension: 0.4, // 곡선의 매끄러움
            },
            {
                label: "총 광고비",
                data: data.map((item) => item.totalAdCost), // 총 광고비 데이터
                borderColor: "rgba(54, 162, 235, 1)", // 파란색 선
                backgroundColor: "rgba(54, 162, 235, 0.2)", // 파란색 배경
                fill: true,
                tension: 0.4,
            },
            {
                label: "ROAS",
                data: data.map((item) => item.roas), // ROAS 데이터
                borderColor: "rgba(0, 0, 0, 1)", // 검정색 선
                backgroundColor: "rgba(0, 0, 0, 0.2)", // 검정색 배경
                fill: false, // 배경 없음
                tension: 0.4,
            },
        ],
    };

    // 차트 옵션
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            tooltip: {
                callbacks: {
                    label: (context) =>
                        `${context.dataset.label}: ${context.raw}${context.dataset.label === "ROAS" ? "%" : ""
                        }`, // ROAS에 % 추가
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "값",
                },
            },
            x: {
                title: {
                    display: true,
                    text: "날짜",
                },
            },
        },
    };

    return (
        <Line data={chartData} options={options} />
    );
};

export default TotalGraph;
