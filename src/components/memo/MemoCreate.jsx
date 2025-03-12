import React, { useState } from 'react';
import DatePicker from 'react-datepicker'; // DatePicker import
import { useLocation } from 'react-router-dom'; // useLocation import
import { addMemo } from '../../services/memo.js'; // addMemo 함수 import
import '../../styles/memo/MemoCreate.css'; // 스타일을 위한 CSS 파일 import

const MemoCreate = ({ onAddMemo }) => {
    const location = useLocation(); // 현재 위치 정보 가져오기
    const campaignId = location.pathname.split('/')[2]; // URL 경로에서 campaignId 추출

    const [selectedDate, setSelectedDate] = useState(new Date()); // 선택된 날짜 상태
    const [memoText, setMemoText] = useState(''); // 메모 텍스트 상태

    const handleAddMemo = async () => {
        if (!memoText.trim()) {
            alert('메모 내용을 입력하세요.'); // 메모 내용이 비어있을 경우 경고
            return;
        }
        try {
            // 줄바꿈 문자(\n)를 <br> 태그로 변환
            const formattedMemoText = memoText.replace(/\n/g, '<br>');

            const newMemo = await addMemo({
                campaignId,
                contents: formattedMemoText, // 변환된 내용 전송
                date: selectedDate.toISOString().split('T')[0], // YYYY-MM-DD 형식으로 변환
            });
            setMemoText(''); // 추가 후 메모 텍스트 초기화
            alert('메모를 등록하였습니다.');
            onAddMemo(newMemo); // 새 메모 추가
        } catch (error) {
            console.error('메모 추가 실패:', error);
            alert('메모 추가에 실패했습니다.');
        }
    };

    return (
        <div className="memo-create">
            <div className="memo-header">
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="yyyy-MM-dd" // 날짜 포맷 설정
                    className="date-picker-memo-create" // 스타일을 위한 클래스
                />
                <button className="add-button" onClick={handleAddMemo}>추가</button>
            </div>
            <hr />
            <textarea
                className="memo-textarea"
                placeholder="메모를 작성하세요..."
                rows="4"
                value={memoText}
                onChange={(e) => setMemoText(e.target.value)} // 메모 텍스트 업데이트
            />
        </div>
    );
};

export default MemoCreate;
