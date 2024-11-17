import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm"; 
import MainForm from "./components/MainForm";
const App = () => {
  return (
    <Router>
      <Routes>
        {/* 로그인 페이지 */}
        <Route path="/" element={<LoginForm />} />
        {/* 회원가입 페이지 */}
        <Route path="/signup" element={<SignupForm />} />
        {/* 메인 페이지 */}
        <Route path="/main" element={<MainForm />} />
      </Routes>
    </Router>
  );
};

export default App;