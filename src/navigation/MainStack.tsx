import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { HomeStack } from './HomeStack';
import { ProfileStack } from './ProfileStack';

const SearchScreen = () => (
  <View style={styles.center}><Text style={styles.text}>Search</Text></View>
);
const ChatScreen = () => (
  <View style={styles.center}><Text style={styles.text}>Messages</Text></View>
);

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
        component={SearchScreen} 
        options={{
          tabBarIcon: ({ color }) => <Feather name="search" size={24} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Create" 
        component={View} // Placeholder, usually handled by a listener to open modal
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                top: -20, // 1. Naikkan posisi ikon
                width: 50,
                height: 50,
                borderRadius: 18, // Lingkaran sempurna
                backgroundColor: '#6366f1', // 2. Background Ungu
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#6366f1', // 3. Shadow agar terlihat melayang
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5, // Shadow untuk Android
              }}
            >
              <Feather name="plus" size={28} color="#ffffff" /> 
              {/* Icon Putih & Lebih Besar */}
            </View>
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault(); // Stop default navigation
            navigation.navigate('CreatePost');
          },
        })}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen} 
        options={{
          tabBarIcon: ({ color }) => <Feather name="message-square" size={24} color={color} />,
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