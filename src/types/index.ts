export interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
}

export interface Post {
  _id: string; 
  caption: string;
  imageUrl?: string;
  user: { 
    _id: string;
    username: string;
    avatar?: string; 
  };
  likes: string[]; 
  createdAt: string;
  updatedAt?: string;
}