import client from './client';
import { API_URLS } from './endpoints';

export const loginUser = async (identifier: string, password: string) => {
  try {
    console.log(`[Auth] Logging in to: ${client.defaults.baseURL}${API_URLS.LOGIN}`);
    const isEmail = identifier.includes('@');
    
    const payload = isEmail 
      ? { email: identifier, password }       
      : { username: identifier, password };   

    const response = await client.post(API_URLS.LOGIN, payload);
    return response.data;
  } catch (error: any) {
    console.error('[Auth] Login Error:', error.response?.data || error.message);
    throw error;
  }
};

export const registerUser = async (fullName: string, email: string, password: string) => {
  try {
    console.log(`[Auth] Registering to: ${client.defaults.baseURL}${API_URLS.REGISTER}`);
    const response = await client.post(API_URLS.REGISTER, { 
      username: fullName.split(' ')[0] + Math.floor(Math.random() * 1000), // Temp username generation
      email, 
      password 
    });
    return response.data;
  } catch (error: any) {
    console.error('[Auth] Register Error:', error.response?.data || error.message);
    throw error;
  }
};