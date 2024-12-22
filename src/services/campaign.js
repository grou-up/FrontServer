import { apiRequest } from '../utils/apiClient';

// 캠패인 이름 조회
export const getMyCampaigns = async() => {
  try {
    const response = await apiRequest("/campaign/campaign/getMyCampaigns");
    // console.log(response); // 응답값을 콘솔에 출력
    return response;
  } catch (error) {
    console.error("Error fetching campaigns:", error); // 에러 핸들링
    throw error; // 에러를 다시 던져서 호출한 곳에서 처리할 수 있게 함
  }
}