import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import client from '../api/client';

interface User {
  id: string;
  email: string;
  fullName?: string;
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  signIn: (token: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on app launch
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      const storedToken = await SecureStore.getItemAsync('nexus_token');
      const storedUser = await SecureStore.getItemAsync('nexus_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        // Add token to axios headers for future requests
        client.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }
    } catch (e) {
      console.log('Error loading auth data', e);
    } finally {
      setIsLoading(false);
    }
  }

  const signIn = async (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    client.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    
    await SecureStore.setItemAsync('nexus_token', newToken);
    await SecureStore.setItemAsync('nexus_user', JSON.stringify(newUser));
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync('nexus_token');
    await SecureStore.deleteItemAsync('nexus_user');
    setToken(null);
    setUser(null);
    delete client.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier usage
export const useAuth = () => useContext(AuthContext);