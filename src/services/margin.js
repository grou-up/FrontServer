import { apiRequest } from '../utils/apiClient';

export const getMargin = async ({ date }) => {
    try {
        const response = await apiRequest(`/margin/getCampaignAllSales?date=${date}`);
        return response;
    } catch (error) {
        throw error;
    }
}
export const getTotalSales = async ({ date }) => {
    try {
        const response = await apiRequest(`/margin/getDailyAdSummary?date=${date}`)
        return response;
    } catch (error) {
        throw error
    }
}
export const getMarginByCampaignId = async ({ startDate, endDate, campaignId }) => {
    try {
        const response = await apiRequest(`/margin/getMargin?startDate=${startDate}&endDate=${endDate}&campaignId=${campaignId}`);
        return response;
    } catch (error) {
        throw error;
    }
}
export const marginUpdatesByPeriod = async (data) => {
    try {
        const response = await apiRequest('/margin/marginUpdatesByPeriod', 'PATCH', data);
        console.log(response)
        return response; // 성공 시 반환
    } catch (error) {
        console.error('데이터 생성 중 오류 발생:', error.message);
        throw error; // 오류를 상위로 전달
    }
};

export const getDailyMarginSummary = async ({ date }) => {
    try {
        const response = await apiRequest(`/margin/getDailyMarginSummary?date=${date}`)
        console.log(response)
        return response;
    } catch (error) {
        throw error
    }
}
export const getNetProfit = async ({ startDate, endDate, }) => {
    try {
        const response = await apiRequest(`/margin/getNetProfit?startDate=${startDate}&endDate=${endDate}`);
        console.log(response)
        return response;
    } catch (error) {
        throw error
    }
}