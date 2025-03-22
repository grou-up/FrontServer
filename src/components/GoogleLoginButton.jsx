import React from "react";
import Button from "./Button";

const GoogleLoginButton = () => {
    const handleLogin = () => {
        console.log("구글 로그인 호출")
        window.location.href = `https://server.grouup.co.kr/oauth2/authorization/google`;
    };

    return (
        <Button onClick={handleLogin} variant="google">
            구글로 로그인
        </Button>
    );
};

export default GoogleLoginButton;
