// src/hooks/useDateRangePicker.js (파일 경로 예시)

import React, { useState, useCallback } from 'react';
import DateRangeCalendar from '../components/Date/DateRangeCalendar';
// 날짜를 'YYYY-MM-DD' 형식으로 변환
const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// 사용자가 initialConfig 객체를 만들어서 전달 할 수 있다.

export const useDateRangePicker = (initialConfig = {}) => {
    // 훅 내부에서 모든 상태 관리
    const [startDate, setStartDate] = useState(
        initialConfig.initialStartDate || new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    );
    const [endDate, setEndDate] = useState(
        initialConfig.initialEndDate || new Date()
    );
    const [showDatePicker, setShowDatePicker] = useState(false);

    // 부모 컴포넌트에 최종 날짜를 전달할 콜백
    const onDatesChange = initialConfig.onDatesChange || (() => { });

    const handleDateRangeChange = useCallback((dateRange) => {
        const start = new Date(dateRange.startDate);
        start.setHours(12, 0, 0, 0); // 시작일: 정오 (12:00:00.000)

        const end = new Date(dateRange.endDate);
        end.setHours(23, 59, 59, 999); // 종료일: 자정 직전 (23:59:59.999)

        setStartDate(start.toISOString().slice(0, 10));
        setEndDate(end.toISOString().slice(0, 10));
    }, [onDatesChange]);

    const toggleDatePicker = useCallback(() => {
        setShowDatePicker(prev => !prev);
    }, []);

    // 외부에서 사용할 버튼 컴포넌트
    const DatePickerButton = () => (
        <button onClick={toggleDatePicker} className="date-selection-button">
            <span>{formatDate(startDate)}</span>
            <span className="mx-1">~</span>
            <span>{formatDate(endDate)}</span>
        </button>
    );

    // 외부에서 렌더링할 모달 컴포넌트
    const DatePickerModal = () => (
        showDatePicker ? (
            <div className="date-picker-modal">
                <DateRangeCalendar
                    onDateRangeChange={handleDateRangeChange}
                    initialStartDate={startDate}
                    initialEndDate={endDate}
                    onClose={toggleDatePicker}
                />
            </div>
        ) : null
    );

    // 훅이 반환하는 최종 결과물
    return {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        DatePickerButton,
        DatePickerModal,
    };
};