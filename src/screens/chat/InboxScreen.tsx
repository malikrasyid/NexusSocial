// src/screens/chat/InboxScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  RefreshControl,
  TouchableOpacity 
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { SafeScreenWrapper } from '../../components/shared/SafeScreenWrapper';
import { Heading, SubText } from '../../components/ui/Typography';
import { ChatListItem } from '../../components/chat/ChatListItem';
import { getInbox } from '../../api/chat';
import { formatRelativeTime } from '../../utils/date'; // Assuming you have this from FeedScreen
import { useAuth } from '../../context/AuthContext';
import { socket } from '../../utils/socket';
import { useInbox } from '../../hooks/useInbox';

const InboxScreen = () => {
  const navigation = useNavigation<any>();
  const { user: currentUser } = useAuth();
  
  const [inbox, setInbox] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInbox = async () => {
    try {
      const data = await getInbox();
      setInbox(data);
    } catch (error) {
      console.error('Failed to fetch inbox:', error);
    } finally {
      setLoading(false);
    }
  };

  useInbox(currentUser, setInbox, fetchInbox);

  useFocusEffect(
    useCallback(() => {
      fetchInbox();
    }, [])
  );

  const renderEmpty = () => (
    !loading ? (
      <View style={styles.emptyContainer}>
        <Feather name="message-square" size={48} color="#d1d5db" />
        <SubText style={styles.emptyText}>No messages yet.</SubText>
        <SubText style={{ color: '#9ca3af', fontSize: 13, marginTop: 4 }}>
          Start a conversation from a user's profile!
        </SubText>
      </View>
    ) : null
  );

  return (
    <SafeScreenWrapper>
      {/* 1. Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Feather name="edit" size={24} color="#1f2937" />
        </TouchableOpacity> 
        <Heading style={{ fontSize: 18 }}>Messages</Heading>
        <View style={{ width: 24 }} /> 
      </View>

      {/* 2. Loading State */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4f46e5" />
        </View>
      )}

      {/* 3. Inbox List */}
      {!loading && (
        <FlatList
          data={inbox}
          keyExtractor={(item) => item.userId}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={renderEmpty}
          renderItem={({ item }) => (
            <ChatListItem
              userId={item.userId}
              username={item.username}
              avatarUrl={item.avatar || `https://ui-avatars.com/api/?name=${item.username}`}
              lastMessage={item.lastMessage}
              unreadCount={item.unreadCount}
              timeAgo={formatRelativeTime(item.timestamp)}
              onPress={() => {
                navigation.navigate('ChatRoom', {
                  userId: item.userId,
                  username: item.username,
                  avatar: item.avatar,
                });
              }}
            />
          )}
        />
      )}
    </SafeScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
});

export default InboxScreen;