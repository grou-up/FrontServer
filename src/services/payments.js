import { apiRequest } from '../utils/apiClient';

export const readyToPay = async ({ title }) => {
    try {
        const response = await apiRequest(`/payment/kakao/ready?type=${title}`);
        // console.log(response)
        return response;
    } catch (error) {
        console.error("Error fetching readytoPay:", error);
        throw error;
    }
}

export const completePayment = async ({ pgToken, tid }) => {
    try {
        const response = await apiRequest(`/payment/kakao/completed?pgToken=${pgToken}&tid=${tid}`);
        console.log(response)
        return response;
    } catch (error) {
        console.error("Error fetching readytoPay:", error);
        throw error;
    }
}