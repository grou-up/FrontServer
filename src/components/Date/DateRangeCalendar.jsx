// src/components/Date/DateRangeCalendar.jsx
import React, { useState, useEffect } from 'react';
import '../../styles/DateRangeCalendar.css';

const DateRangeCalendar = ({ onDateRangeChange, initialStartDate, initialEndDate, onClose }) => {
    // 현재 화면 기준 날짜(첫 달의 1일)
    const [currentDate, setCurrentDate] = useState(new Date());
    const [startDate, setStartDate] = useState(initialStartDate ? new Date(initialStartDate) : null);
    const [endDate, setEndDate] = useState(initialEndDate ? new Date(initialEndDate) : null);
    const [isSelectingEnd, setIsSelectingEnd] = useState(false);

    const today = new Date();

    // 퀵 옵션 정의
    const quickOptions = [
        { label: '어제', value: 'yesterday' },
        { label: '최근 7일', value: 'last7days' },
        { label: '이번달', value: 'thisMonth' },
        { label: '최근 30일', value: 'last30days' },
        { label: '지난 주', value: 'lastWeek' },
        { label: '지난 달', value: 'lastMonth' },
    ];

    // 부모에게 날짜 범위 변경 알려주기
    useEffect(() => {
        if (startDate && endDate && onDateRangeChange) {
            onDateRangeChange({
                startDate: startDate.toISOString().slice(0, 10),
                endDate: endDate.toISOString().slice(0, 10),
            });
        }
    }, [startDate, endDate, onDateRangeChange]);

    // 한 달치 달력 데이터 생성 (6주×7일)
    const generateCalendar = date => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const first = new Date(year, month, 1);
        const start = new Date(first);
        start.setDate(start.getDate() - first.getDay());

        const weeks = [];
        const cur = new Date(start);
        for (let w = 0; w < 6; w++) {
            const week = [];
            for (let d = 0; d < 7; d++) {
                week.push(new Date(cur));
                cur.setDate(cur.getDate() + 1);
            }
            weeks.push(week);
        }
        return weeks;
    };

    // 날짜 클릭 처리
    const handleDateClick = date => {
        const clicked = new Date(date);
        clicked.setHours(0, 0, 0, 0);
        console.log(1)
        if (!startDate || (startDate && endDate)) {
            // 시작일 재설정
            setStartDate(clicked);
            setEndDate(null);
            setIsSelectingEnd(true);
            console.log(2)

        } else if (startDate && !endDate) {
            // 사용자가 끝 날짜 선택 중
            let selectedEnd = clicked;
            console.log(3)
            // 1) 시작일보다 이전 클릭 시 → 시작일 재설정
            if (selectedEnd < startDate) {
                setStartDate(selectedEnd);
                setEndDate(null);
                setIsSelectingEnd(true);
                console.log(4)
                return;
            }

            // 2) 오늘을 넘으면 오늘로
            if (selectedEnd > today) {
                if (startDate < today) {
                    console.log("앞")
                    selectedEnd = today;
                }
                else {
                    console.log("뒤")
                    setStartDate(null)
                    setEndDate(null)
                    return

                }

            }

            // 3) 시작일 + 29일(=30일 범위) 넘으면 그 날로
            const maxEnd = new Date(startDate);

            maxEnd.setDate(maxEnd.getDate() + 29);
            if (selectedEnd > maxEnd) {
                setStartDate(maxEnd)
                console.log(7)
            }

            setEndDate(selectedEnd);
            setIsSelectingEnd(false);
        }
    };


    // 범위·시작·끝 날짜 검사
    const isInRange = date => startDate && endDate && date >= startDate && date <= endDate;
    const isStartDate = date => startDate && date.toDateString() === startDate.toDateString();
    const isEndDate = date => endDate && date.toDateString() === endDate.toDateString();

    // 퀵 옵션 클릭
    const handleQuickSelect = option => {
        const today = new Date();
        let start, end;
        switch (option) {
            case 'yesterday':
                start = new Date(today); start.setDate(start.getDate() - 1);
                end = new Date(start);
                break;
            case 'last7days':
                start = new Date(today); start.setDate(start.getDate() - 6);
                end = new Date(today);
                break;
            case 'thisMonth':
                start = new Date(today.getFullYear(), today.getMonth(), 1);
                end = new Date(today);
                break;
            case 'last30days':
                start = new Date(today); start.setDate(start.getDate() - 29);
                end = new Date(today);
                break;
            case 'lastWeek':
                start = new Date(today); start.setDate(start.getDate() - today.getDay() - 7);
                end = new Date(start); end.setDate(end.getDate() + 6);
                break;
            case 'lastMonth':
                start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                end = new Date(today.getFullYear(), today.getMonth(), 0);
                break;
            default:
                return;
        }
        setStartDate(start);
        setEndDate(end);
        setIsSelectingEnd(false);
    };

    // 전역(두 달치) 내비게이션
    const prevRange = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    const nextRange = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

    // 보여줄 두 달
    const calendars = [
        new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    ];

    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

    return (
        <div className="date-range-calendar">
            {/* 두 달 달력 */}
            <div className="calendar-container">
                {calendars.map((viewDate, idx) => {
                    const weeks = generateCalendar(viewDate);
                    return (
                        <div className="calendar-content" key={idx}>
                            <h4 className="month-year">
                                <button onClick={prevRange} className="nav-button">‹</button>
                                {viewDate.getFullYear()}년 {monthNames[viewDate.getMonth()]}
                                <button onClick={nextRange} className="nav-button">›</button>
                            </h4>
                            <div className="calendar-grid">
                                <div className="weekdays">
                                    {dayNames.map(d => (
                                        <div key={d} className={`weekday ${d === '일' ? 'sunday' : ''}`}>{d}</div>
                                    ))}
                                </div>
                                <div className="dates">
                                    {weeks.map((week, wi) => (
                                        <div className="week" key={wi}>
                                            {week.map((day, di) => {
                                                const sameMonth = day.getMonth() === viewDate.getMonth();
                                                const isToday = day.toDateString() === today.toDateString();
                                                const classes = [
                                                    'date-cell',
                                                    !sameMonth && 'other-month',
                                                    isToday && 'today',
                                                    isStartDate(day) && 'start-date',
                                                    isEndDate(day) && 'end-date',
                                                    isInRange(day) && 'in-range',
                                                    day.getDay() === 0 && 'sunday'
                                                ].filter(Boolean).join(' ');
                                                return (
                                                    <button
                                                        key={di}
                                                        className={classes}
                                                        onClick={() => handleDateClick(day)}
                                                    >
                                                        {day.getDate()}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 퀵 옵션 */}
            <div className="quick-options">
                {quickOptions.map(opt => (
                    <button
                        key={opt.value}
                        className="quick-option-button"
                        onClick={() => handleQuickSelect(opt.value)}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {/* 액션 버튼 */}
            <div className="action-buttons">
                <button className="cancel-button" onClick={() => {
                    setStartDate(null);
                    setEndDate(null);
                }}>취소</button>
                <button className="cancel-button" onClick={() => {
                    onClose && onClose();
                }}>닫기 </button>

            </div>
        </div>
    );
};

export default DateRangeCalendar;
