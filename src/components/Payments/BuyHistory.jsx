import React from 'react';
import "../../styles/payments/BuyHistory.css"
const BuyHistory = () => {
    return (
        <div>
            <div className="text_discription">사용자가 충전한 햇살 내역 및 환불 내역을 확인 할 수 있습니다.</div>
            <table>
                <thead>
                    <tr>
                        <th>일자</th>
                        <th>분류</th>
                        <th>주문ID</th>
                        <th>상품</th>
                        <th>결제 방식</th>
                        <th>결제 금액</th>
                        <th>상태</th>
                        <th>환불</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>2024-04-02</td>
                        <td>광고</td>
                        <td>ORDER12345</td>
                        <td>햇살 100개</td>
                        <td>신용카드</td>
                        <td>70,000원</td>
                        <td>완료</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>2024-04-01</td>
                        <td>충전</td>
                        <td>ORDER67890</td>
                        <td>햇살 50개</td>
                        <td>계좌이체</td>
                        <td>35,000원</td>
                        <td>완료</td>
                        <td>-</td>
                    </tr>
                    {/* 더 많은 데이터 행을 추가할 수 있습니다 */}
                </tbody>
            </table>
        </div>
    );
};

export default BuyHistory;
