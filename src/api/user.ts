import client from './client';
import { API_ENDPOINTS } from './endpoints';
import { User, UserProfile } from '../types';

// 1. Get Current User Profile
export const getMyProfile = async () => {
  const response = await client.get<User>(API_ENDPOINTS.USER.ME);
  return response.data;
};

// 2. Get Any User's Profile (Public)
export const getUserProfile = async (userId: string) => {
  const response = await client.get<User>(API_ENDPOINTS.USER.PROFILE(userId));
  return response.data;
};

// 3. Update Text Data (JSON)
export const updateProfileData = async (data: Partial<User>) => {
  const response = await client.put(API_ENDPOINTS.USER.UPDATE_PROFILE, data);
  return response.data;
};

// 4. Upload Avatar (Multipart/Form-Data)
export const uploadAvatar = async (imageUri: string) => {
  const formData = new FormData();
  
  const filename = imageUri.split('/').pop();
  const match = /\.(\w+)$/.exec(filename || '');
  const type = match ? `image/${match[1]}` : `image/jpeg`;

  // @ts-ignore: React Native specific FormData
  formData.append('file', {
    uri: imageUri,
    name: filename,
    type,
  });

  const response = await client.put(API_ENDPOINTS.USER.UPLOAD_AVATAR, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// 5. Follow / Unfollow
export const followUser = async (userId: string) => {
  const response = await client.post(API_ENDPOINTS.USER.FOLLOW(userId));
  return response.data;
};

export const unfollowUser = async (userId: string) => {
  const response = await client.delete(API_ENDPOINTS.USER.FOLLOW(userId).replace('/follow', '/follow')); 
  return response.data;
};

export const searchUsers = async (query: string): Promise<UserProfile[]> => {
  if (!query.trim()) return [];
  
  const response = await client.get(`/user/search?q=${encodeURIComponent(query)}`);
  return response.data;
};

export const getOtherUserProfile = async (userId: string): Promise<UserProfile> => {
  const response = await client.get(`/user/${userId}`);
  return response.data;
};