import client from './client';
import { API_URLS } from './endpoints';
import { User } from '../types';

// 1. Get Current User Profile
export const getMyProfile = async () => {
  const response = await client.get<User>(API_URLS.ME);
  return response.data;
};

// 2. Get Any User's Profile (Public)
export const getUserProfile = async (userId: string) => {
  const response = await client.get<User>(API_URLS.USER_PROFILE(userId));
  return response.data;
};

// 3. Update Text Data (JSON)
// Backend: @Body() updateDto: UpdateUserDto
export const updateProfileData = async (data: Partial<User>) => {
  const response = await client.put(API_URLS.UPDATE_PROFILE, data);
  return response.data;
};

// 4. Upload Avatar (Multipart/Form-Data)
// Backend: @UseInterceptors(FileInterceptor('file'))
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

  const response = await client.put(API_URLS.UPLOAD_AVATAR, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// 5. Follow / Unfollow
export const followUser = async (userId: string) => {
  const response = await client.post(API_URLS.FOLLOW(userId));
  return response.data;
};

export const unfollowUser = async (userId: string) => {
  const response = await client.delete(API_URLS.FOLLOW(userId).replace('/follow', '/follow')); 
  // ^ Note: Check your endpoint.ts to match DELETE route structure
  return response.data;
};