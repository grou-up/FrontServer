import { apiRequest } from '../utils/apiClient';
import axios from 'axios';

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

// 해당 캠패인의 전체옵션 조회
export const getMyExecutionData = async ({ campaignId }) => {
    try {
        const response = await apiRequest(`/execution/getMyExecutionData?campaignId=${campaignId}`);
        console.log(response)
        return response;
    } catch (error) {
        console.error("Error fetching campaigns:", error);
        throw error;
    }
}
export const updateMyExecutionData = async (data) => {
    try {
        const response = await apiRequest('/execution/update', 'PATCH', data);
        console.log(response)
        return response; // 성공 시 반환
    } catch (error) {
        console.error('데이터 생성 중 오류 발생:', error.message);
        throw error; // 오류를 상위로 전달
    }
};