import React from "react";
import "../../../styles/MarginCalculatorForm.css"; // CSS 연결

function ActionButtons({ calculateMargins, saveOptions }) {

    return (
        <div className="action-buttons">
            <button onClick={calculateMargins}>계산하기</button>
            <button onClick={saveOptions}>저장</button>
        </div>
    );
}

export default ActionButtons;
