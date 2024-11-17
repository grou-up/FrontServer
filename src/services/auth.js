import { apiRequest } from "../utils/api";

// 로그인 요청
export const login = async ({ email, password }) => {
  return apiRequest("/members/login", "POST", { email, password });
};

// 회원가입 요청
export const signup = async ({ email, password, name }) => {
  return apiRequest("/members/signup", "POST", { email, password, name });
};