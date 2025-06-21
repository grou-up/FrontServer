import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getHistory } from "../../services/file";
import FileHistoryModal from './FileHistoryModal';

export default function FileSalesHistory() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [history, setHistory] = useState({
        advertisingReport: [],   // ["2025-05-01", "2025-05-02", …]
        netSalesReport: {}       // { "2025-05-10": { id:…, fileName:…, … }, … }
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalDate, setModalDate] = useState('');
    const [modalFiles, setModalFiles] = useState([]);

    // yyyy-MM-dd 포맷
    const formatDate = d =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    // 이번 달 1일 ~ 다음 달 말일
    const getRange = baseDate => {
        const y = baseDate.getFullYear();
        const m = baseDate.getMonth();
        return {
            startDate: formatDate(new Date(y, m, 1)),
            endDate: formatDate(new Date(y, m + 2, 0))
        };
    };

    // API 호출
    useEffect(() => {
        const { startDate, endDate } = getRange(currentDate);
        getHistory({ startDate, endDate })
            .then(res => {
                const data = res.data ?? res;
                setHistory({
                    advertisingReport: data.advertisingReport || [],
                    netSalesReport: data.netSalesReport || {}
                });
            })
            .catch(console.error);
    }, [currentDate]);

    // 42일 그리드용 날짜 배열
    const getCalendarDays = (year, month) => {
        const first = new Date(year, month, 1);
        const start = new Date(first);
        start.setDate(first.getDate() - first.getDay());
        return Array.from({ length: 42 }).map((_, i) => {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            return d;
        });
    };

    // 해당 날짜에 광고/순매출 데이터가 있는지
    const getFlags = date => {
        const key = formatDate(date);
        return {
            isAdv: history.advertisingReport.includes(key),
            isNet: history.netSalesReport[key] != null
        };
    };

    // 해당 날짜의 FileResponseDto 리스트에 타입을 붙여서 반환
    const getFilesForDate = date => {
        const key = formatDate(date);
        const out = [];

        // 순매출 보고서는 맵에서 DTO 꺼내기
        const netDto = history.netSalesReport[key];
        if (netDto) {
            out.push({ type: '순매출 보고서', ...netDto });
        }

        return out;
    };
    // 점 렌더링 (광고 빨강, 순매출 파랑)
    const renderIndicators = ({ isAdv, isNet }) => (
        <div className="flex gap-1 mt-1 justify-center">
            {isAdv && <div className="w-2 h-2 bg-red-500 rounded-full" />}
            {isNet && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
        </div>
    );

    // 달 이동
    const navigateMonth = dir =>
        setCurrentDate(d => {
            const nd = new Date(d);
            nd.setMonth(d.getMonth() + dir);
            return nd;
        });

    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

    // 한 달짜리 달력
    const Calendar = ({ offset }) => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + offset;
        const days = getCalendarDays(year, month);
        const title = new Date(year, month, 1);

        return (
            <div className="flex-1 bg-white rounded-lg p-4">
                <div className="text-center font-semibold text-gray-800 mb-4">
                    {title.getFullYear()}년 {monthNames[title.getMonth()]}
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {dayNames.map(d => (
                        <div key={d} className="text-center text-sm font-medium text-gray-500 p-2">
                            {d}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {days.map((day, idx) => {
                        const inMonth = day.getMonth() === title.getMonth();
                        const isToday = formatDate(day) === formatDate(new Date());
                        const flags = getFlags(day);
                        const clickable = flags.isNet;

                        return (
                            <div
                                key={idx}
                                onClick={() => {
                                    if (!clickable) return;
                                    setModalDate(formatDate(day));
                                    setModalFiles(getFilesForDate(day));
                                    setIsModalOpen(true);
                                }}
                                className={`
                  relative group h-12 flex flex-col items-center justify-center text-sm rounded-md
                  ${inMonth ? 'text-gray-900' : 'text-gray-300'}
                  ${isToday ? 'bg-blue-100 font-semibold' : 'hover:bg-gray-50'}
                  ${clickable ? 'cursor-pointer hover:bg-gray-50' : ''}
                `}
                            >
                                <span>{day.getDate()}</span>
                                {renderIndicators(flags)}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="file-card file-sales-history">
                <div className="file-sales-header">
                    <div className="legend flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full" />
                            <span>광고 보고서</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full" />
                            <span>순매출 보고서</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xl font-semibold text-gray-800 -mt-1">
                        <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-gray-200 rounded-md"><ChevronLeft size={20} /></button>
                        {currentDate.getFullYear()}년
                        <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-gray-200 rounded-md"><ChevronRight size={20} /></button>
                    </div>
                </div>
                <div className="calendars flex gap-4 mt-0">
                    <Calendar offset={0} />
                    <Calendar offset={1} />
                </div>
            </div>

            <FileHistoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                date={modalDate}
                files={modalFiles}
            />
        </>
    );
}
