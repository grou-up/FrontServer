import React, { useEffect, useState } from "react";

function MarginCalculatorResult() {
    const [formula, setFormula] = useState("");

    useEffect(() => {
        // 로컬 스토리지에서 마진식 불러오기
        const savedFormula = localStorage.getItem("marginFormula");
        setFormula(savedFormula || "마진식이 없습니다.");
    }, []);

    return (
        <div>
            <h2>마진 계산 결과</h2>
            <p>{formula}</p>
        </div>
    );
}

export default MarginCalculatorResult;