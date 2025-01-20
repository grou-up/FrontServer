import React from "react";
import "../../../styles/MarginCalculatorForm.css"; // CSS 연결

function ActionButtons({ calculateMargins, saveOptions, saveDefalutOptions }) {
    return (
        <div className="action-buttons">
            <button className="save-default" onClick={saveDefalutOptions}>기본값 저장하기</button>
            <div className="right-buttons">
                <button className="calculate" onClick={calculateMargins}>계산하기</button>
                <button className="save" onClick={saveOptions}>저장</button>
            </div>
        </div>
    );
}

export default ActionButtons;