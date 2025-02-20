import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignupForm from "./components/SignupForm";
import MainForm from "./components/MainForm";
import LoginCallback from "./pages/LoginCallback";
import PrivateRoute from "./components/PrivateRoute"; // PrivateRoute 추가
import Sidebar from "./components/Sidebar";
import FileUploadForm from "./components/FileUploadForm";
import CampaignDetail from "./components/CampaignDetail";
import MarginTabNavigation from "./components/Margin/MarginTabNavigation";
class AppRoutes extends React.Component {
    render() {
        return (
            <Router>
                <Routes>
                    {/* 공개된 경로 */}
                    <Route path="/" element={<Login />} />
                    <Route path="/signup" element={<SignupForm />} />
                    <Route path="/oauth/kakao/callback" element={<LoginCallback />} />
                    <Route path="/oauth/google/callback" element={<LoginCallback />} />
                    {/* 보호된 경로 */}
                    <Route
                        path="/main"
                        element={
                            <PrivateRoute>
                                <Sidebar />
                                <MainForm />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/upload"
                        element={
                            <PrivateRoute>
                                <Sidebar />
                                < FileUploadForm />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/margin-calculator"
                        element={
                            <PrivateRoute>
                                <Sidebar />
                                < MarginTabNavigation />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/campaigns/:campaignId" // 캠페인 분석 경로 추가
                        element={
                            <PrivateRoute>
                                <Sidebar />
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
