import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context'; // <--- ADD THIS
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigation';

export default function App() {
  return (
    <SafeAreaProvider> 
      <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}