import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignupForm from "./components/SignupForm";
import MainForm from "./components/MainForm";
import KakaoLoginCallback from "./pages/KakaoLoginCallback";
import PrivateRoute from "./components/PrivateRoute"; // PrivateRoute 추가
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
class AppRoutes extends React.Component {
    render() {
        return (
            <Router>
                <Routes>
                    {/* 공개된 경로 */}
                    <Route path="/" element={<Login />} />
                    <Route path="/signup" element={<SignupForm />} />
                    <Route path="/oauth/kakao/callback" element={<KakaoLoginCallback />} />

                    {/* 보호된 경로 */}
                    <Route
                        path="/main"
                        element={
                            <PrivateRoute>
                                <Sidebar />
                                <Header /> {/* Header 추가 */}
                                <MainForm />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </Router>
        );
    }
}

export default AppRoutes;
