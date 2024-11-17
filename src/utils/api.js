import { API_URL } from "../config/api";

// 공통 API 요청 함수
export const apiRequest = async (endpoint, method, body) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined, 
    });

    const data = await response.json(); 
    if (!response.ok) {
      throw new Error(data.error_message || "Something went wrong");
    }
    return data; 
  } catch (error) {
    throw new Error(error.message || "Something went wrong"); 
  }
};

export default apiRequest