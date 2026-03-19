import client from './client'; 
import { API_ENDPOINTS } from './endpoints';

export const markMessagesAsRead = async (senderId: string) => {
  const response = await client.patch(API_ENDPOINTS.CHAT.MARK_READ(senderId));
  return response.data;
};

export const getInbox = async () => {
  const response = await client.get(API_ENDPOINTS.CHAT.INBOX);
  return response.data;
};