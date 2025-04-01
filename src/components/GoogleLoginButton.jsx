import React from "react";
import Button from "./Button";
import { EXCEPT_API_URL } from '../config/api';
const GoogleLoginButton = () => {
    const handleLogin = () => {
        console.log("구글 로그인 호출")
        window.location.href = `${EXCEPT_API_URL}/oauth2/authorization/google`;
    };

    return (
        <Button onClick={handleLogin} variant="google">
            구글로 로그인
        </Button>
    );
};

export default GoogleLoginButton;
