import React from "react";
import Button from "./Button";

// 환경 변수에서 REST API 키와 리다이렉트 URI 가져오기
const REST_API_KEY = process.env.REACT_APP_REST_API_KEY;

const KakaoLoginButton = () => {
    const handleLogin = () => {
        console.log('REST_API_KEY:', REST_API_KEY);

        // 카카오 로그인 페이지로 리다이렉트
        window.location.href = `http://ec2-13-124-198-31.ap-northeast-2.compute.amazonaws.com:8080/oauth2/authorization/kakao`;
    };

    return (
        <Button onClick={handleLogin} variant="kakao">
            카카오로 로그인
        </Button>
    );
};

export default KakaoLoginButton;
