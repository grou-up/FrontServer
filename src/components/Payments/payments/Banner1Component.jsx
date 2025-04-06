import React from "react";
import './../../../styles/payments/Banner1Component.css' // 필요한 CSS 파일 import

const Banner1Component = () => {
    return (
        <div className="banner1">
            <div className="banner_font">
                <h1 className="banner_title">햇빛이란?</h1>
                <div className="banner_contents1">캠패인을 조회하기 위한 단위 입니다.</div>
                <div className="banner_contents2">x 햇살을 통해 하나의 캠패인에 y 일 동안 조회 가능합니다 </div>
            </div>
            <button className="banner_button">
                <div className="banner_button_font">자세히 알아보러가기</div>
            </button>
        </div>
    );
};

export default Banner1Component;
