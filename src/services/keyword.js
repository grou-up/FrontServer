import { apiRequest } from '../utils/apiClient';

// 해당 캠패인의 키워드 조회
export const getKeywords = async({start,end,campaignId}) => {
  try {
    const response = await apiRequest(`/keyword/getKeywordsAboutCampaign?start=${start}&end=${end}&campaignId=${campaignId}`);
    // console.log(response); // 응답값을 콘솔에 출력
    return response;
  } catch (error) {
    console.error("Error fetching campaigns:", error); // 에러 핸들링
    throw error; // 에러를 다시 던져서 호출한 곳에서 처리할 수 있게 함
  }
}