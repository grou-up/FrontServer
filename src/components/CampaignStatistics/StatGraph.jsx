import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement } from 'chart.js';

// Chart.js 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement);

// 이모티콘 플러그인 정의
const emojiPlugin = {
    id: 'emojiPlugin',
    afterDatasetsDraw: (chart) => {
        const { ctx, data, scales } = chart;

        // searchData는 첫 번째 데이터셋
        const searchData = data.datasets[0].data;

        searchData.forEach((value, index) => {
            const x = scales.x.getPixelForValue(index);
            const y = scales.y.getPixelForValue(value);

            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.font = '20px Arial';
            ctx.fillText('⭐', x, y - 10);
            ctx.restore();
        });
    }
};


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
    const adCostData = dateLabels.map((date, index) => searchAdCostData[index] + nonSearchAdCostData[index]);

    // ROAS 데이터 생성
    const roasData = dateLabels.map((date, index) => {
        const totalRevenue = searchData[index] + nonSearchData[index];
        const totalCost = searchAdCostData[index] + nonSearchAdCostData[index];
        return totalCost > 0 ? (totalRevenue / totalCost) * 100 : 0;
    });

    const data = {
        labels: dateLabels,
        datasets: [
            {
                label: '검색',
                data: searchData,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                stack: 'Stack 0',
                order: 3,
            },
            {
                label: '비검색',
                data: nonSearchData,
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
                stack: 'Stack 0',
                order: 3,
            },
            {
                label: '광고비',
                data: adCostData,
                borderColor: 'rgb(0, 123, 255)',
                backgroundColor: 'rgba(0, 123, 255, 0.3)',
                type: 'line',
                fill: false,
                order: 1,
            },
            {
                label: 'ROAS',
                data: roasData,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.3)',
                type: 'line',
                fill: false,
                yAxisID: 'y-roas',
                order: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            emojiPlugin: {}, // 플러그인 활성화
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
                stacked: true,
                min: 0,
                max: Math.max(...adCostData, ...searchData, ...nonSearchData) * 1.5,
            },
            'y-roas': {
                title: {
                    display: true,
                    text: 'ROAS (%)',
                },
                position: 'right',
                ticks: {
                    beginAtZero: true,
                },
                grid: {
                    display: false,
                },
            },
        },
    };

    return (
        <div style={{ height: '100%' }}>
            <Bar
                data={data}
                options={{ ...options, maintainAspectRatio: false }}
                plugins={[emojiPlugin]} // 플러그인 등록
            />
        </div>
    );
};

export default StatGraph; 