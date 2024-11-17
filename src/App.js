import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm"; // 로그인 폼 컴포넌트
import SignupForm from "./components/SignupForm"; // 회원가입 폼 컴포넌트

const App = () => {
  return (
    <Router>
      <Routes>
        {/* 로그인 페이지 */}
        <Route path="/" element={<LoginForm />} />
        {/* 회원가입 페이지 */}
        <Route path="/signup" element={<SignupForm />} />
      </Routes>
    </Router>
  );
};

export default App;