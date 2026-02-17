export interface User {
  _id: string;
  email: string;
  username: string;
  name?: string; 
  avatar?: string; 
  bio?: string;
  birthday?: string; 
  gender?: string;
  height?: number;   
  weight?: number;   
  interests?: string[]; 
  followers: string[]; 
  following: string[];
}

export interface Post {
  _id: string;
  caption: string; 
  imageUrl?: string;
  user: User; 
  likes: string[];
  createdAt: string;
}