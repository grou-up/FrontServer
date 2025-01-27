import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement } from 'chart.js';

// Chart.js 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement);

const StatGraph = ({ search, nonSearch, startDate, endDate }) => {
    // 날짜를 배열로 생성
    const dateLabels = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    // 날짜를 추가
    for (let dt = start; dt <= end; dt.setDate(dt.getDate() + 1)) {
        dateLabels.push(dt.toISOString().split('T')[0]); // 'YYYY-MM-DD' 형식으로 변환
    }

    // search와 nonSearch 데이터를 각각의 배열로 변환
    const searchData = dateLabels.map(date => (search[date] ? search[date].keyAdsales : 0));
    const nonSearchData = dateLabels.map(date => (nonSearch[date] ? nonSearch[date].keyAdsales : 0));

    // 광고비 데이터 생성
    const searchAdCostData = dateLabels.map(date => (search[date] ? search[date].keyAdcost : 0));
    const nonSearchAdCostData = dateLabels.map(date => (nonSearch[date] ? nonSearch[date].keyAdcost : 0));

    // adCostData 생성: searchAdCostData와 nonSearchAdCostData의 합
    const adCostData = dateLabels.map((date, index) => searchAdCostData[index] + nonSearchAdCostData[index]);

    // ROAS 데이터 생성
    const roasData = dateLabels.map((date, index) => {
        const totalRevenue = searchData[index] + nonSearchData[index]; // 총 광고 수익
        const totalCost = searchAdCostData[index] + nonSearchAdCostData[index]; // 총 광고 비용
        return totalCost > 0 ? (totalRevenue / totalCost) * 100 : 0; // 비용이 0일 경우 0을 반환
    });

    // 데이터 준비
    const data = {
        labels: dateLabels,
        datasets: [
            {
                label: '검색',
                data: searchData,
                backgroundColor: 'rgba(54, 162, 235, 0.6)', // Search 색상 (파랑)
                stack: 'Stack 0', // 스택 설정
            },
            {
                label: '비검색',
                data: nonSearchData,
                backgroundColor: 'rgba(255, 159, 64, 0.6)', // Non-Search 색상 (주황)
                stack: 'Stack 0', // 스택 설정
            },
            {
                label: '광고비',
                data: adCostData,
                borderColor: 'rgb(0, 123, 255)', // Ad Cost 선 색상 (짙은 파랑)
                backgroundColor: 'rgba(0, 123, 255, 0.3)', // Ad Cost 색상 (옅은 파랑)
                type: 'line', // 선 그래프로 표시
                fill: true, // 선 그래프 안 채우기
            },
            {
                label: 'ROAS',
                data: roasData,
                borderColor: 'rgb(255, 99, 132)', // ROAS 선 색상 (빨강)
                backgroundColor: 'rgba(255, 99, 132, 0.3)', // ROAS 색상 (옅은 빨강)
                type: 'line', // 선 그래프로 표시
                fill: true, // 선 그래프 안 채우기
                yAxisID: 'y-roas', // ROAS 데이터의 y축 ID
            },
        ],
    };

    // 옵션 설정
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Statistics Graph',
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
                    text: 'Ad Sales',
                },
                stacked: true, // y 축 스택 설정
            },
            'y-roas': {
                title: {
                    display: true,
                    text: 'ROAS (%)',
                },
                position: 'right', // y축 위치 설정
                ticks: {
                    beginAtZero: true,
                },
            },
        },
    };

    return (
        <div>
            <Bar data={data} options={options} />
        </div>
    );
};

export default StatGraph;
