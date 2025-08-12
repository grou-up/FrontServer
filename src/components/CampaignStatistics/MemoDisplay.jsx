import React from 'react';
import '../../styles/campaignStats/MemoDisplay.css';


const MemoDisplay = ({ memoData }) => {
    if (!memoData || Object.keys(memoData).length === 0) {
        return (
            <div className="memo-container">
                <p className="no-memo-text">작성된 메모가 없습니다.</p>
            </div>
        );
    }

    // 1. 데이터 가공 로직에서 author 부분을 제거
    const flatMemoList = Object.entries(memoData).flatMap(([date, memos]) => {
        // 이제 memos는 ['메모 내용1', '메모 내용2'] 같은 단순 문자열 배열이야.
        return memos.map((memoContent, index) => ({
            id: `${date}-${index}`,
            date: date,
            content: memoContent,
        }));
    });

    // 2. 렌더링 부분도 author 관련 코드를 모두 제거
    return (
        <div className="memo-container">
            <table className="memo-table">
                <thead>
                    <tr>
                        <th>날짜</th>
                        <th>내용</th>
                    </tr>
                </thead>
                <tbody>
                    {flatMemoList.map(memo => (
                        <tr key={memo.id}>
                            <td>{memo.date}</td>
                            <td>
                                <p
                                    className="memo-content2"
                                    dangerouslySetInnerHTML={{ __html: memo.content }}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MemoDisplay;