import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignupForm from "./components/SignupForm";
import MainForm from "./components/MainForm";
import KakaoLoginCallback from "./pages/KakaoLoginCallback";
import PrivateRoute from "./components/PrivateRoute"; // PrivateRoute 추가
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import FileUploadForm from "./components/FileUploadForm";
import CampaignDetail from "./components/CampaignDetail";
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
                    <Route
                        path="/upload"
                        element={
                            <PrivateRoute>
                                <Sidebar />
                                <Header />
                                < FileUploadForm/>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/campaigns/:campaignId" // 캠페인 분석 경로 추가
                        element={
                            <PrivateRoute>
                                <Sidebar />
                                <Header />
                                <CampaignDetail />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </Router>
        );
    }
}

export default AppRoutes;
