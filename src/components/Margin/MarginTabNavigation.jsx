import React, { useState } from "react";
import TabNavigation from "./TabNavigation";
import MarginCalculatorForm from "./MarginCalculatorForm";
import MarginCalculatorResult from "./MarginCalculatorResult";

const MarginTabNavigation = () => {
    // 상태 추가: 어떤 컴포넌트를 보여줄지 결정
    const [activeComponent, setActiveComponent] = useState(null);

    // 버튼 클릭 시 호출될 함수
    const handleComponentChange = (component) => {
        setActiveComponent(component);
    };

    return (
        <div className="main-content">
            <div className="min-h-screen bg-gray-100">
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">마진 계산식 입력</h2>
                </div>
                <main className="container mx-auto p-6">
                    {/* TabNavigation 추가 */}
                    <TabNavigation onComponentChange={handleComponentChange} />
                    <div className="mt-8">
                        {/* 현재 활성화된 컴포넌트 렌더링 */}
                        {activeComponent === "MarginCalculatorForm" && (
                            <MarginCalculatorForm />
                        )}
                        {activeComponent === "MarginCalculatorResult" && (
                            <MarginCalculatorResult />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MarginTabNavigation;
