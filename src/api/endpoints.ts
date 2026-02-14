export const API_URLS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  
  // User
  ME: '/user/me',
  UPDATE_PROFILE: '/user/me',
  UPLOAD_AVATAR: '/user/avatar',
  USER_PROFILE: (id: string) => `/user/${id}`,
  FOLLOW: (id: string) => `/user/${id}/follow`,
  
  // Posts
  FEED: '/posts/feed',
  CREATE_POST: '/posts',
  LIKE_POST: (id: string) => `/posts/${id}/like`,
  USER_POSTS: (id: string) => `/posts/user/${id}`,

  // Chat
  INBOX: '/chat/inbox',
  CHAT_HISTORY: (id: string) => `/chat/history/${id}`,
};