import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import Button from "./Button";
import { login } from "../services/auth";
import { handleError } from "../utils/errorHandler";
import KakaoLoginButton from "./KakaoLoginButton"; // 새로 추가된 버튼

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      alert("꺄악!");
      navigate('/main');
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
      <div className="w-full max-w-screen-lg grid grid-cols-1 lg:grid-cols-2 bg-white rounded-lg shadow-xl overflow-hidden">
        {/* 회원가입 섹션 - 작은 화면에서도 항상 보이도록 수정 */}
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-purple-700 to-blue-600 text-white p-12">
          <h1 className="text-5xl font-bold mb-6">환영합니다</h1>
          <p className="text-lg mb-8 opacity-90">
            우리의 서비스는 혁신적이고 신뢰할 수 있습니다.
            <br />
            지금 바로 경험해보세요!
          </p>
          <Button
            type="button"
            className="w-full"
            onClick={() => navigate("/signup")} // 회원가입 페이지로 이동
          >
            회원가입
          </Button>
        </div>

        {/* 로그인 폼 섹션 */}
        <div className="flex flex-col items-center justify-center p-8 w-full">
          <div className="w-full max-w-md">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">로그인</h1>
              <p className="text-gray-500">계정에 로그인해주세요</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  이메일
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  비밀번호
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Button variant="link" type="button">
                  비밀번호 찾기
                </Button>
              </div>

              <Button type="submit" className="w-full">
                로그인
              </Button>
            </form>
            <div className="text-center mt-4">
              <KakaoLoginButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
