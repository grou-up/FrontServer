import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement } from 'chart.js';

// Chart.js 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement);

const StatGraph2 = ({ search, nonSearch, startDate, endDate }) => {
    // 날짜를 배열로 생성
    const dateLabels = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    // 날짜를 추가
    for (let dt = start; dt <= end; dt.setDate(dt.getDate() + 1)) {
        dateLabels.push(dt.toISOString().split('T')[0]); // 'YYYY-MM-DD' 형식으로 변환
    }

    // search와 nonSearch 데이터를 각각의 배열로 변환
    const searchImpressionData = dateLabels.map(date => (search[date] ? search[date].keyClicks : 0));
    const searchKeyTotalSalesData = dateLabels.map(date => (search[date] ? search[date].keyTotalSales : 0));
    const nonsearchImpressionData = dateLabels.map(date => (nonSearch[date] ? nonSearch[date].keyClicks : 0));
    const nonsearchKeyTotalSalesData = dateLabels.map(date => (nonSearch[date] ? nonSearch[date].keyTotalSales : 0));

    // 광고비 데이터 생성
    const searchAdCostData = dateLabels.map(date => (search[date] ? search[date].keyAdcost : 0));
    const nonSearchAdCostData = dateLabels.map(date => (nonSearch[date] ? nonSearch[date].keyAdcost : 0));

    // cvr 데이터 생성
    const searchCvrData = dateLabels.map((date, index) => {
        const keyClicks = searchImpressionData[index];
        // console.log(impressions);
        const adSales = searchKeyTotalSalesData[index];
        // console.log(adSales);
        return keyClicks > 0 ? (adSales / keyClicks) * 100 : 0; // 퍼센트로 표현
    });
    const nonsearchCvrData = dateLabels.map((date, index) => {
        const keyClicks = nonsearchImpressionData[index];
        // console.log(impressions);
        const adSales = nonsearchKeyTotalSalesData[index];
        console.log(adSales);
        return keyClicks > 0 ? (adSales / keyClicks) * 100 : 0; // 퍼센트로 표현
    });



    const data = {
        labels: dateLabels,
        datasets: [
            {
                label: '검색 광고비',
                data: searchAdCostData,
                backgroundColor: 'rgba(54, 162, 235, 0.6)', // Search 색상 (파랑)
                stack: 'Stack 0', // 스택 설정
                order: 1, // 막대 그래프 우선
            },
            {
                label: '비검색 광고비',
                data: nonSearchAdCostData,
                backgroundColor: 'rgba(255, 159, 64, 0.6)', // Non-Search 색상 (주황)
                stack: 'Stack 0', // 스택 설정
                order: 1, // 막대 그래프 우선
            },
            {
                label: '검색 전환율',
                data: searchCvrData,
                borderColor: 'rgb(255, 99, 132)', // 전환율 선 색상 (빨강)
                backgroundColor: 'rgba(255, 99, 132, 0.3)', // 전환율 색상 (옅은 빨강)
                type: 'line', // 선 그래프로 표시
                fill: false, // 선 그래프 안 채우기
                yAxisID: 'y-cvr', // CVR 데이터의 y축 ID
                order: 2, // CVR 선 그래프를 막대 위에 표시
            },
            {
                label: '비검색 전환율',
                data: nonsearchCvrData,
                borderColor: 'rgb(0, 123, 255)', // Ad Cost 선 색상 (짙은 파랑)
                backgroundColor: 'rgba(0, 123, 255, 0.3)', // Ad Cost 색상 (옅은 파랑)
                type: 'line', // 선 그래프로 표시
                fill: false, // 선 그래프 안 채우기
                yAxisID: 'y-cvr', // CVR 데이터의 y축 ID
                order: 2, // CVR 선 그래프를 막대 위에 표시
            },
        ],
    };

    // 옵션 설정
    const options = {
        responsive: true,
        maintainAspectRatio: false, // 비율 유지하지 않음
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: '광고비 및 전환율 그래프',
            },
        },
        scales: {
            x: {
                title: {
                    display: false,
                    text: 'Date',
                },
            },
            y: {
                title: {
                    display: true,
                    text: '광고비',
                },
                stacked: true, // y 축 스택 설정
                min: 0, // 최소값 설정
                max: Math.max(...searchAdCostData, ...nonSearchAdCostData) * 1.5, // 최대값 설정 (최대 데이터의 1.5배)
            },
            'y-cvr': {
                title: {
                    display: true,
                    text: '전환율 (%)',
                },
                position: 'right', // y축 위치 설정
                ticks: {
                    beginAtZero: true,
                    max: 100, // CVR 최대값 설정
                },
                grid: {
                    display: false, // Y축의 그리드 선을 보이지 않게 설정
                },
            },
        },
    };

    return (
        <div style={{ height: '100%' }}> {/* 부모의 높이에 맞추기 위해 100% 설정 */}
            <Bar data={data} options={{ ...options, maintainAspectRatio: false }} /> {/* 비율 유지하지 않음 */}
        </div>
    );
};

export default StatGraph2;
