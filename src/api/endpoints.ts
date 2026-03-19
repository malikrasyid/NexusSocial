export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  USER: {
    ME: '/user/me',
    UPDATE_PROFILE: '/user/me',
    UPLOAD_AVATAR: '/user/avatar',
    // Dynamic routes use functions
    PROFILE: (id: string) => `/user/${id}`,
    FOLLOW: (id: string) => `/user/${id}/follow`,
    SEARCH: '/user/search', 
  },
  POSTS: {
    FEED: '/posts/feed', // Note: Make sure your NestJS controller is @Controller('posts') not ('post')
    CREATE: '/posts',
    LIKE: (id: string) => `/posts/${id}/like`,
    USER_POSTS: (id: string) => `/posts/user/${id}`,
  },
  CHAT: {
    INBOX: '/chat/inbox',
    HISTORY: (userId: string) => `/chat/history/${userId}`,
    MARK_READ: (senderId: string) => `/chat/read/${senderId}`,
  }
};