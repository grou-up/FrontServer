import { getToken } from './tokenManager';
import { API_URL } from '../config/api';

// 공통 API 요청 함수
export const apiRequest = async (endpoint, method = 'GET', body = null) => {
  try {
    // accessToken 가져오기
    const token = getToken();

    // 기본 헤더 설정
    const headers = {
      'Content-Type': 'application/json',
    };

    // 토큰이 존재하면 Authorization 헤더 추가
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Fetch 요청
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    // 응답 처리
    const data = await response.json();

    // 에러 처리
    if (!response.ok) {
      throw new Error(data.error_message || 'Something went wrong');
    }

    return data; // 성공 시 데이터 반환
  } catch (error) {
    console.error('API 요청 에러:', error.message);
    throw new Error(error.message || 'Something went wrong');
  }
};

export default apiRequest;
