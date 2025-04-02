import React, { useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement);

const StatGraph = ({ search, nonSearch, memoData, startDate, endDate }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const chart = chartRef.current;
        const canvas = chart.canvas;

        const handleMouseMove = (event) => {
            const xAxis = chart.scales.x; // x축 스케일 가져오기
            const xAxisArea = {
                top: chart.chartArea.bottom + 5, // x축 레이블 영역 시작 (임의 값 조정)
                left: chart.chartArea.left,
                right: chart.chartArea.right,
                bottom: chart.height
            };

            // 마우스 좌표가 x축 레이블 영역 안에 있는지 확인
            if (event.y >= xAxisArea.top && event.y <= xAxisArea.bottom && event.x >= xAxisArea.left && event.x <= xAxisArea.right) {
                // 가장 가까운 x축 레이블 찾기
                let minDist = Infinity;
                let closestLabel = null;

                for (let i = 0; i < chart.data.labels.length; i++) {
                    const labelX = xAxis.getPixelForValue(i); // 각 레이블의 x좌표
                    const dist = Math.abs(event.x - labelX);

                    if (dist < minDist) {
                        minDist = dist;
                        closestLabel = chart.data.labels[i];
                    }
                }

                // 툴팁 표시
                if (closestLabel && memoData && memoData[closestLabel]) {
                    // 툴팁 엘리먼트 생성 또는 업데이트
                    let tooltipEl = document.getElementById('chartjs-x-axis-tooltip');

                    if (!tooltipEl) {
                        tooltipEl = document.createElement('div');
                        tooltipEl.id = 'chartjs-x-axis-tooltip';
                        tooltipEl.style.background = 'rgba(0, 0, 0, 0.7)';
                        tooltipEl.style.color = 'white';
                        tooltipEl.style.borderRadius = '3px';
                        tooltipEl.style.padding = '5px';
                        tooltipEl.style.position = 'absolute';
                        tooltipEl.style.zIndex = 10;
                        canvas.parentNode.appendChild(tooltipEl);
                    }

                    // 툴팁 위치 설정
                    tooltipEl.innerHTML = memoData[closestLabel];
                    tooltipEl.style.top = (event.clientY - 50) + 'px'; // 마우스 위치 기준으로 툴팁 위치 조정
                    tooltipEl.style.left = (event.clientX + 10) + 'px';
                    tooltipEl.style.display = 'block';
                } else {
                    // 툴팁 숨김
                    const tooltipEl = document.getElementById('chartjs-x-axis-tooltip');
                    if (tooltipEl) {
                        tooltipEl.style.display = 'none';
                    }
                }
            } else {
                // 마우스가 x축 레이블 영역 밖에 있으면 툴팁 숨김
                const tooltipEl = document.getElementById('chartjs-x-axis-tooltip');
                if (tooltipEl) {
                    tooltipEl.style.display = 'none';
                }
            }
        };

        canvas.addEventListener('mousemove', handleMouseMove);

        return () => {
            canvas.removeEventListener('mousemove', handleMouseMove);
            const tooltipEl = document.getElementById('chartjs-x-axis-tooltip');
            if (tooltipEl && canvas.parentNode) {
                canvas.parentNode.removeChild(tooltipEl);
            }
        };
    }, [memoData]);

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
        },
        scales: {
            x: {
                title: {
                    display: false,
                    text: 'Date',
                },
                ticks: {
                    color: (context) => {
                        const label = context.tick.label;
                        return memoData && memoData[label] ? 'red' : 'black'; // memoData에 해당 날짜가 있으면 빨간색, 없으면 검은색
                    }
                }
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
            />
        </div>
    );
};

export default StatGraph;
