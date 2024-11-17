import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";

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