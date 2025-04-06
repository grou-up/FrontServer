import React from 'react';

const UseHistory = () => {
    return (
        <div>
            <div>사용자가 사용한 햇살에 대한 기록을 확인 할 수 있습니다.</div>
            <table>
                <thead>
                    <tr>
                        <th>일자</th>
                        <th>상태</th>
                        <th>캠페인명</th>
                        <th>사용한 햇살</th>
                        <th>만료일자</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>2024-04-02</td>
                        <td>완료</td>
                        <td>여름맞이 세일 캠페인</td>
                        <td>100</td>
                        <td>2024-05-02</td>
                    </tr>
                    <tr>
                        <td>2024-04-01</td>
                        <td>완료</td>
                        <td>신제품 출시 기념 캠페인</td>
                        <td>50</td>
                        <td>2024-04-30</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default UseHistory;
