import React from "react";
import Button from "./Button";

const GoogleLoginButton = () => {
    const handleLogin = () => {
        window.location.href = `https://server.grouup.co.kr/oauth2/authorization/google`;
    };

    return (
        <Button onClick={handleLogin} variant="google">
            구글로 로그인
        </Button>
    );
};

export default GoogleLoginButton;
