import { API_URL } from '../config/api';

export const login = async ({ email, password }) => {
    try {
        const response = await fetch(`${API_URL}/api/members/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        return await response.json();
    } catch (error) {
        throw new Error('Login failed');
    }
};