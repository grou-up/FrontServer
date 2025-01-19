import { apiRequest } from '../utils/apiClient';

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