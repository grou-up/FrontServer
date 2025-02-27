import React from "react";
import "../../styles/Login/PricingSection.css"; // CSS 파일 import
import price from "../../images/202503price.png"; // 이미지 경로

const PricingSection = () => {
    return (
        <section id="pricing" className="features-section">
            <div className="pricing-section">
                <h2 className="pricing-title">그로우업으로 매출 UP!</h2>
                <p className="pricing-subtitle">광고 분석부터 마진 계산까지 <br />합리적인 가격으로 매출 분석해보세요.</p>
                <div className="pricing-note">
                    <p className="note-title">15일 무료체험 </p>
                    <p className="note-title"> + </p>
                    <p className="note-title">첫 결제시 </p>
                    <p className="note-title">3달간 할인가 결제</p>
                    <p className="note-subtitle">3개월 후에는 정상가로 결제됩니다.</p>
                </div>
                <img src={price} alt="Pricing Table" className="pricing-image" />

                <div className="pricing-button">
                    <a href="#free-trial" className="price-button">15일 무료체험 바로가기</a>
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
