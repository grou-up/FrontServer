import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Routes로 수정
import Login from './pages/Login';

class AppRoutes extends React.Component {
    render() {
        return (
            <Router>
                <Routes> {/* Switch 대신 Routes */}
                    <Route path="/" element={<Login />} />
                </Routes>
            </Router>
        );
    }
}

export default AppRoutes;
