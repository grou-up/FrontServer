import React, { useEffect } from "react";

function KakaoLoginCallback() {
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get("token");

        if (token) {
            localStorage.clear();
            localStorage.setItem("accessToken", token);

            // 저장된 토큰 확인
            console.log("Token saved in localStorage:", localStorage.getItem("accessToken"));

            window.location.replace("/main");
        } else {
            console.error("Token is missing ");
        }
    }, []);

    return null;
}

export default KakaoLoginCallback;
