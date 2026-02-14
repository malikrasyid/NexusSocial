import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// 1. Determine Base URL based on device
// Android Emulator uses 10.0.2.2 to access the host machine
// iOS Simulator uses localhost
const API_URL = "http://192.168.1.11:3001";// <--- CHANGE THIS

// 2. Create Axios Instance
const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. Request Interceptor: Attach Token automatically
client.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 4. Response Interceptor: Handle 401 (Unauthorized)
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Logic to logout user if token expires (we can add this later)
      console.log('Session expired');
    }
    return Promise.reject(error);
  }
);

export default client;