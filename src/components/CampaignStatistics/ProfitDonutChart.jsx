import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// --- 1. 차트 중앙에 텍스트를 그리는 커스텀 플러그인 ---
const centerTextPlugin = {
    id: 'centerText',
    afterDraw: (chart) => {
        const ctx = chart.ctx;
        const { top, left, width, height } = chart.chartArea;
        const centerX = left + width / 2;
        const centerY = top + height / 2;

        // 중앙에 표시할 텍스트와 값을 플러그인 옵션에서 가져온다.
        const title = chart.options.plugins.centerText.title;
        const value = chart.options.plugins.centerText.value;

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // 윗줄 텍스트 (제목) 그리기
        ctx.font = '14px Arial';
        ctx.fillStyle = '#666'; // 텍스트 색상
        ctx.fillText(title, centerX, centerY - 10); // y좌표를 살짝 위로

        // 아랫줄 텍스트 (값) 그리기
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = '#000'; // 값 텍스트 색상
        ctx.fillText(value, centerX, centerY + 15); // y좌표를 살짝 아래로

        ctx.restore();
    }
};


const ProfitDonutChart = ({ marginData }) => {
    const totals = marginData[0].data.reduce(
        (acc, item) => {
            acc.totalAdCost += item.marAdCost || 0;
            acc.totalAdSales += item.marSales || 0; // 기준이 전체 매출이므로 marSales를 사용
            return acc;
        },
        { totalAdCost: 0, totalAdSales: 0 }
    );

    const { totalAdCost, totalAdSales } = totals;
    const adProfit = totalAdSales - totalAdCost;

    // --- 2. '매출 대비 이익 비율' 퍼센트 계산 ---
    // 전체 매출이 0일 경우 0으로 처리 (0으로 나누기 방지)
    const profitMargin = totalAdSales > 0 ? (adProfit / totalAdSales) * 100 : 0;

    // 퍼센트 값을 소수점 첫째 자리까지 표시
    const formattedProfitMargin = profitMargin.toFixed(1) + '%';

    if (totalAdSales <= 0) {
        return <div style={{ textAlign: 'center', paddingTop: '50px' }}>매출 데이터가 없습니다.</div>;
    }

    // --- 3. 차트 데이터와 옵션을 새 디자인에 맞게 수정 ---
    const chartData = {
        datasets: [
            {
                data: [profitMargin, 100 - profitMargin], // [이익비율, 나머지]
                backgroundColor: [
                    '#36A2EB', // 이익 비율 색상
                    '#E5E5E5'  // 나머지 회색
                ],
                borderColor: [
                    '#36A2EB',
                    '#E5E5E5'
                ],
                borderWidth: 1,
                cutout: '85%', // 도넛 두께 조절 (구멍 크기)
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            // 기존 범례와 툴팁은 비활성화
            legend: {
                display: false,
            },
            tooltip: {
                enabled: false,
            },
            // 위에서 만든 커스텀 플러그인에 동적 텍스트 전달
            centerText: {
                title: '매출 대비 이익 비율',
                value: formattedProfitMargin
            }
        },
    };

    // 4. Doughnut 컴포넌트에 커스텀 플러그인을 등록
    return <Doughnut data={chartData} options={options} plugins={[centerTextPlugin]} />;
};

export default ProfitDonutChart;