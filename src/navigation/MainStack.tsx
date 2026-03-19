import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { HomeStack } from './HomeStack';
import { ProfileStack } from './ProfileStack';
import InboxScreen from '../screens/chat/InboxScreen';
import { SearchStack } from './SearchStack';

const Tab = createBottomTabNavigator();

export const MainStack = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#6366f1', 
        tabBarInactiveTintColor: '#9ca3af',
      })}
    >
      <Tab.Screen 
        name="Feed" 
        component={HomeStack}
        options={{
          tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
        }}
        />
      <Tab.Screen 
        name="Search" 
        component={SearchStack} 
        options={{
          tabBarIcon: ({ color }) => <Feather name="search" size={24} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Messages" 
        component={InboxScreen} 
        options={{
          tabBarIcon: ({ color }) => <Feather name="message-circle" size={24} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    height: 60,
    paddingTop: 5,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
});