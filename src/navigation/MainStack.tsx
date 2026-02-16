import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { HomeStack } from './HomeStack';

const SearchScreen = () => (
  <View style={styles.center}><Text style={styles.text}>Search</Text></View>
);
const ChatScreen = () => (
  <View style={styles.center}><Text style={styles.text}>Messages</Text></View>
);
const ProfileScreen = () => {
  const { signOut, user } = useAuth();

  return (
    <View style={styles.center}>
      <Text style={[styles.text, { marginBottom: 20 }]}>
        Hello, {user?.fullName || user?.email}
      </Text>
      <View style={{ width: '80%' }}>
        <PrimaryButton title="Logout" onPress={signOut} />
      </View>
    </View>
  );
};

const Tab = createBottomTabNavigator();

export const MainStack = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#6366f1', 
        tabBarInactiveTintColor: '#9ca3af',
        tabBarLabelStyle: styles.tabLabel,
        tabBarIconStyle: { display: 'none' }, 
        tabBarLabelPosition: 'beside-icon',
      }}
    >
      <Tab.Screen 
        name="Feed" 
        component={HomeStack}
        options={{ tabBarLabel: 'Home' }}
        />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen} 
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen} 
        options={{ tabBarLabel: 'Chat' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
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
    paddingBottom: 10,
    paddingTop: 10,
    elevation: 0, 
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
});