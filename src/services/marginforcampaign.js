import { apiRequest } from '../utils/apiClient';


export const getExecutionAboutCampaign = async ({ campaignId }) => {
    try {
        const response = await apiRequest(`/marginforcam/getExecutionAboutCampaign?campaignId=${campaignId}`);

        return response;
    } catch (error) {
        console.error("Error fetching campaigns:", error);
        throw error;
    }
}
export const getMyAllExecution = async ({ }) => {
    try {
        const response = await apiRequest(`/marginforcam/getMyAllExecution`);
        return response;
    } catch (error) {
        console.error("Error fetching campaigns:", error);
        throw error;
    }
}

export const updateExecutionAboutCampaign = async (data) => {
    try {
        const response = await apiRequest('/marginforcam/updateExecutionAboutCampaign', 'PATCH', data);
        return response; // 성공 시 반환
    } catch (error) {
        console.error('데이터 생성 중 오류 발생:', error.message);
        throw error; // 오류를 상위로 전달
    }
};


export const deleteExecutionAboutCampaign = async ({ id }) => {
    try {
        const response = await apiRequest(`/marginforcam/deleteExecutionAboutCampaign?id=${id}`, 'DELETE', id);
        return response; // 성공 시 반환
    } catch (error) {
        console.error('데이터 생성 중 오류 발생:', error.message);
        throw error; // 오류를 상위로 전달
    }
}