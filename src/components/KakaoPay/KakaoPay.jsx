import React from 'react';
import { readyToPay } from '../../services/payments';

const PlanCard = ({ title, price, description, features, onPay }) => {
    return (
        <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', margin: '10px', width: '250px' }}>
            <h3>{title}</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{price}</p>
            <p>{description}</p>
            <ul>
                {features.map((feature, index) => (
                    <li key={index} style={{ listStyleType: 'none', margin: '5px 0' }}>✓ {feature}</li>
                ))}
            </ul>
            <button
                onClick={() => onPay(title, price)}
                style={{ backgroundColor: '#f0c14b', border: '1px solid #a88734', borderRadius: '4px', padding: '10px', cursor: 'pointer' }}
            >
                결제하기
            </button>
        </div>
    );
};

const KakaoPay = () => {

    const plans = [
        {
            title: 'bronze',
            price: '30,000원 / 월',
            description: '결제 후 30일 간 사용이 가능합니다.',
            features: ['기능1', '기능2', '기능3', '기능4', '기능5']
        },
        {
            title: 'gold',
            price: '29,000원 / 월',
            description: '정기 결제를 통해 할인된 가격으로 사용이 가능합니다.',
            features: ['기능1', '기능2', '기능3', '기능4', '기능5']
        },
    ];

    const handlePayment = async (title, price) => {
        const numbers = price.match(/\d+/g);
        const priceNum = numbers ? numbers.join('') : '0';

        // console.log(`결제할 상품: ${title}, 가격: ${priceNum}`);

        try {
            const response = await readyToPay({ title });
            // console.log('결제 준비 완료', response);

            if (response.next_redirect_pc_url) {
                localStorage.setItem('tid', response.tid);
                // 결제 페이지로 이동
                window.location.href = response.next_redirect_pc_url;
            } else {
                console.error('리다이렉트 URL이 없습니다.');
            }

        } catch (error) {
            console.error('결제 오류:', error);
        }
    };

    return (
        <div style={{ display: 'flex', margin: '20px' }}>
            {plans.map((plan, index) => (
                <PlanCard key={index} {...plan} onPay={handlePayment} />
            ))}
        </div>
    );
};

export default KakaoPay;
