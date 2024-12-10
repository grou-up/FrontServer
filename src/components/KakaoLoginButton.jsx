import React from "react";
import Button from "./Button";

const REST_API_KEY = process.env.REACT_APP_REST_API_KEY;
const REDIRECT_URI = 'http://localhost:3000/oauth/kakao/callback';


const KakaoLoginButton = () => {
    const handleLogin = () => {
      window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    };
  
    return (
      <Button onClick={handleLogin} variant="kakao">
        카카오로 로그인
      </Button>
    );
  };
  
  export default KakaoLoginButton;