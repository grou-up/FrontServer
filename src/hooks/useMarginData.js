// src/hooks/useMarginData.js

import { useState, useEffect, useMemo, useCallback } from 'react';
import { getMarginByCampaignId, createMarginTable } from "../services/margin";

export const useMarginData = (startDate, endDate, campaignId, onDataChange) => {
    const [data, setData] = useState([]);
    const [modifiedData, setModifiedData] = useState({});
    const [isInitialLoading, setIsInitialLoading] = useState(false);

    const dateRange = useMemo(() => {
        const range = [];
        const currentDate = new Date(startDate);
        const end = new Date(endDate);
        while (currentDate <= end) {
            const yearMonthDay = currentDate.toISOString().split('T')[0];
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            range.push({ fullDate: yearMonthDay, displayDate: `${month}-${day}` });
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return range;
    }, [startDate, endDate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getMarginByCampaignId({ startDate, endDate, campaignId });
                setData(response.data[0].data);
            } catch (error) {
                console.error("데이터를 가져오는 중 오류 발생:", error);
            }
        };
        fetchData();
    }, [startDate, endDate, campaignId]);

    const handleInputChange = useCallback((e, fullDate, key) => {
        const newValue = e.target.value;
        setData(prevData =>
            prevData.map(item =>
                item.marDate === fullDate ? { ...item, [key]: Number(newValue) } : item
            )
        );
        setModifiedData(prev => {
            const itemForDate = data.find(item => item.marDate === fullDate) || {};
            const updatedData = {
                ...prev[fullDate],
                id: itemForDate.id,
                marDate: fullDate,
                marTargetEfficiency: itemForDate.marTargetEfficiency,
                marAdBudget: itemForDate.marAdBudget,
                [key]: Number(newValue)
            };
            return { ...prev, [fullDate]: updatedData };
        });
    }, [data]); // data를 의존성에 추가

    const handleCellClick = useCallback(async (fullDate) => {
        try {
            await createMarginTable({ targetDate: fullDate, campaignId });
            const updateResponse = await getMarginByCampaignId({ startDate, endDate, campaignId });

            setData(updateResponse.data[0]?.data || []);
        } catch (error) {
            console.error("셀 클릭 후 마진 테이블 생성 실패:", error);
        }
    }, [startDate, endDate, campaignId]);

    useEffect(() => {
        onDataChange(campaignId, modifiedData);
    }, [modifiedData, campaignId, onDataChange]);


    return {
        data,
        dateRange,
        isInitialLoading,
        handleInputChange,
        handleCellClick
    };
};