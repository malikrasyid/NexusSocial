import client from './client';
import { API_ENDPOINTS } from './endpoints';

export const getFeed = async () => {
  try {
    const response = await client.get(API_ENDPOINTS.POSTS.FEED);
    return response.data;
  } catch (error) {
    console.error('Error fetching feed:', error);
    return [];
  }
};

export const getUserPosts = async (userId: string) => {
  try {
    const response = await client.get(API_ENDPOINTS.POSTS.USER_POSTS(userId));
    return response.data;
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return [];
  }
};

export const toggleLike = async (postId: string) => {
  try {
    const response = await client.put(API_ENDPOINTS.POSTS.LIKE(postId));
    return response.data;
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};

export const createPost = async (data: FormData | any) => {
  const response = await client.post(API_ENDPOINTS.POSTS.CREATE, data, {
    headers: {
      // Explicitly telling the backend this is a file upload
      'Content-Type': 'multipart/form-data', 
    },
  });
  return response.data;
};