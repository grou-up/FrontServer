import { apiRequest } from '../utils/apiClient';

// 해당 캠페인의 키워드 조회
export const getExeNames = async ({ campaignId, keySalesOptions }) => {
    try {
        const url = `/execution/getByCampaignIdAndExeIds?campaignId=${campaignId}&exeIds=${keySalesOptions}`; // 쿼리 문자열 포함
        const response = await apiRequest(url, 'GET'); // GET 요청
        return response.data;
    } catch (error) {
        console.error("Error fetching campaigns:", error); // 에러 핸들링
        throw error; // 에러를 다시 던져서 호출한 곳에서 처리할 수 있게 함
    }
}