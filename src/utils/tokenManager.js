const TOKEN_KEY = 'accessToken';

// 토큰 저장
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// 토큰 가져오기
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// 토큰 삭제
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};
