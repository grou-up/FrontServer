import axios from 'axios';
import { getToken } from '../utils/tokenManager';  // 토큰 가져오기 함수 사용
import { PYTHON_URL } from '../config/api';
export const uploadFile1 = (file, onUploadProgress) => {
  console.log(1)
  console.log(file)
  const formData = new FormData();
  formData.append('file', file);

  // 토큰 가져오기
  const token = getToken();

  return axios.post(`${PYTHON_URL}/django/upload_excel/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`  // Authorization 헤더에 토큰 추가
    },
    onUploadProgress: onUploadProgress,  // 진행률 추적 추가
  });
};

export const uploadFile2 = (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  // 토큰 가져오기
  const token = getToken();

  return axios.post('http://localhost:8000/upload_category/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`  // Authorization 헤더에 토큰 추가
    },
    onUploadProgress: onUploadProgress,  // 진행률 추적 추가
  });
};

export const uploadFile3 = (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  // 토큰 가져오기
  const token = getToken();

  return axios.post(`${PYTHON_URL}/django/upload_margin/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`  // Authorization 헤더에 토큰 추가
    },
    onUploadProgress: onUploadProgress,  // 진행률 추적 추가
  });
};
