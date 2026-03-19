import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Label, SubText } from '../ui/Typography';

interface ChatListItemProps {
  userId: string;
  username: string;
  avatarUrl: string;
  lastMessage: string;
  timeAgo: string;
  unreadCount?: number;
  onPress: () => void;
}

export const ChatListItem = ({ 
  username, 
  avatarUrl, 
  lastMessage, 
  timeAgo, 
  unreadCount = 0, // Default to 0
  onPress 
}: ChatListItemProps) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7} onPress={onPress}>
      <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Label style={styles.username}>{username}</Label>
          <SubText style={styles.time}>{timeAgo}</SubText>
        </View>
        
        <View style={styles.messageRow}>
          <SubText 
            style={[styles.lastMessage, unreadCount > 0 && styles.unreadMessageText]} 
            numberOfLines={1}
          >
            {lastMessage}
          </SubText>
          
          {/* THE UNREAD BADGE */}
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#f3f4f6', marginRight: 15 },
  content: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  username: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  time: { fontSize: 12, color: '#9ca3af' },
  messageRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lastMessage: { flex: 1, fontSize: 14, color: '#6b7280', paddingRight: 10 },
  
  // Make the text darker/bolder if it's unread
  unreadMessageText: { color: '#1f2937', fontWeight: '600' },
  
  // The Red Badge CSS
  badge: {
    backgroundColor: '#ef4444', // Tailwind Red-500
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});