import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { AuthStack } from './AuthStack';
import { MainStack } from './MainStack';
import CreatePostScreen from '../screens/feed/CreatePostScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import SettingsScreen from '../screens/setting/SettingScreen';

const Stack = createNativeStackNavigator();

const AuthenticatedStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      
      <Stack.Screen name="MainTabs" component={MainStack} />

      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="CreatePost" component={CreatePostScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      </Stack.Group>

      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ presentation: 'card' }} 
      />

    </Stack.Navigator>
  );
};

const RootNavigator = () => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return token ? <AuthenticatedStack /> : <AuthStack />;
};

export default RootNavigator;