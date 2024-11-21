import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Routes로 수정
import Login from './pages/Login';
import SignupForm from "./components/SignupForm"; 
import MainForm from "./components/MainForm";
class AppRoutes extends React.Component {
    render() {
        return (
            <Router>
                <Routes> {/* Switch 대신 Routes */}
                    <Route path="/" element={<Login />} />
                    {/* 회원가입 페이지 */}
                    <Route path="/signup" element={<SignupForm />} />
                    {/* 메인 페이지 */}
                    <Route path="/main" element={<MainForm />} />
                </Routes>
            </Router>
        );
    }
}

export default AppRoutes;
