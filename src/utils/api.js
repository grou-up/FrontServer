import { API_URL } from "../config/api";

// 공통 API 요청 함수
export const apiRequest = async (endpoint, method, body) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined, // body가 있을 때만 JSON으로 변환
    });

    const data = await response.json(); // JSON 응답 파싱
    if (!response.ok) {
      throw new Error(data.error_message || "Something went wrong");
    }
    return data; // 성공적으로 데이터를 반환
  } catch (error) {
    throw new Error(error.message || "Something went wrong"); // 에러 메시지 전달
  }
};

export default apiRequest