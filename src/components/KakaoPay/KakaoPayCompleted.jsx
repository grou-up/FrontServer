import React, { useEffect } from 'react';
import { completePayment } from '../../services/payments';
import { useNavigate } from 'react-router-dom';

const KakaoPayCompleted = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const getUrlParameter = (name) => {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(name);
        };

        const pgToken = getUrlParameter('pg_token');
        const tid = localStorage.getItem('tid');

        const completePaymentProcess = async () => {
            if (pgToken && tid) {
                try {
                    const response = await completePayment({ pgToken, tid });
                    // console.log('결제 완료 응답:', response);
                    localStorage.removeItem('tid');
                    if (response.data === "ok") {
                        alert("결제가 완료되었습니다!");
                        navigate('/'); // 메인 페이지로 리다이렉트
                    }
                } catch (error) {
                    console.error('결제 완료 오류:', error);
                }
            } else {
                console.error('pgToken 또는 tid가 없습니다.');
            }
        };

        completePaymentProcess();
    }, [navigate]);

    return (
        <div>
            <h1>결제 완료 처리 중...</h1>
            {/* 추가 UI 요소 (예: 로딩 스피너 등) */}
        </div>
    );
};

export default KakaoPayCompleted;
