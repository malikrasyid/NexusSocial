import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../api/client';
import { getMyProfile } from '../api/user';
import { User } from '../types';

interface AuthContextData {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        client.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        
        try {
          const userProfile = await getMyProfile();
          setUser(userProfile);
        } catch (apiError) {
          console.error('Token expired or invalid', apiError);
          await signOut(); 
        }
      }
    } catch (e) {
      console.error('Failed to load auth storage', e);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (newToken: string) => {
    try {
      await AsyncStorage.setItem('token', newToken);
      setToken(newToken);
      
      client.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      const userProfile = await getMyProfile();     
      setUser(userProfile);
      
      // Save user to cache if you want offline support
      await AsyncStorage.setItem('user', JSON.stringify(userProfile));

    } catch (error) {
      console.error('SignIn Error: Could not fetch profile', error);
      throw error; 
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    setToken(null);
    setUser(null);
    delete client.defaults.headers.common['Authorization'];
  };

  const refreshUser = async () => {
    if (token) {
      const data = await getMyProfile();
      setUser(data);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, signIn, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);