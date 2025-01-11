import { apiRequest } from '../utils/apiClient';

export const getMargin = async ({ date }) => {
    try {
        const response = await apiRequest(`/margin/getCampaignAllSales?date=${date}`);
        return response;
    } catch (error) {
        throw error;
    }
}