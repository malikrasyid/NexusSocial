import client from './client';
import { API_URLS } from './endpoints';

export const getFeed = async () => {
  try {
    const response = await client.get(API_URLS.FEED);
    return response.data;
  } catch (error) {
    console.error('Error fetching feed:', error);
    return [];
  }
};

export const getUserPosts = async (userId: string) => {
  try {
    const response = await client.get(API_URLS.USER_POSTS(userId));
    return response.data;
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return [];
  }
};

export const toggleLike = async (postId: string) => {
  try {
    const response = await client.put(API_URLS.LIKE_POST(postId));
    return response.data;
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};

export const createPost = async (caption: string, imageUri?: string) => {
  const formData = new FormData();
  
  // Add the caption
  formData.append('caption', caption); 
  // Add the image if it exists
  if (imageUri) {
    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename || '');
    const type = match ? `image/${match[1]}` : `image/jpeg`;

    // @ts-ignore
    formData.append('file', {
      uri: imageUri,
      name: filename,
      type,
    });
  }

  try {
    const response = await client.post(API_URLS.CREATE_POST, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};