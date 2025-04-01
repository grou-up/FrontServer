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
import OtherComponent from "./components/memo/MemoComponent";
import MemoButton from "./components/memo/MemoButton";
import PaymentsComponets from "./components/Payments/PaymentsComponent";

class AppRoutes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showOtherComponent: false, // OtherComponent 표시 여부
        };
    }

    toggleOtherComponent = () => {
        this.setState((prevState) => ({
            showOtherComponent: !prevState.showOtherComponent,
        }));
    };
    render() {
        const { showOtherComponent } = this.state;
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
                        path="/payments"
                        element={
                            <PrivateRoute>
                                <Sidebar></Sidebar>
                                <PaymentsComponets></PaymentsComponets>
                            </PrivateRoute>
                        }
                    />
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
                        path="/campaigns/:campaignId"
                        element={
                            <PrivateRoute>
                                {showOtherComponent ? (
                                    <>
                                        <OtherComponent />
                                        <CampaignDetail />
                                    </>
                                ) : (
                                    <>
                                        <Sidebar />
                                        <CampaignDetail />
                                    </>
                                )}
                                <MemoButton onClick={this.toggleOtherComponent} />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </Router>
        );
    }
}

export default AppRoutes;
