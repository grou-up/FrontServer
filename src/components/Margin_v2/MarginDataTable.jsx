// src/components/margin/MarginDataTable.jsx

import React from 'react';
import { useMarginData } from '../../hooks/useMarginData';
import MarginTablePresenter from './MarginTablePresenter';

const MarginDataTable = ({ startDate, endDate, campaignId, onDataChange, onSave }) => {
    // "두뇌"인 커스텀 훅을 호출하여 모든 로직과 데이터를 가져옵니다.
    const {
        data,
        dateRange,
        handleInputChange,
        handleCellClick
    } = useMarginData(startDate, endDate, campaignId, onDataChange);


    // "몸"인 Presenter 컴포넌트에 필요한 모든 것을 전달하여 화면을 그리게 합니다.
    return (
        <MarginTablePresenter
            data={data}
            dateRange={dateRange}
            handleInputChange={handleInputChange}
            handleCellClick={handleCellClick}
            campaignId={campaignId}
            handleSave={onSave}
        />
    );
};

export default MarginDataTable;