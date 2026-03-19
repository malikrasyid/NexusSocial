import React, { useState, useEffect, useRef } from 'react';
import { 
  View,
  Text, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform, 
  StyleSheet, 
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { socket } from '../../utils/socket';

import { SafeScreenWrapper } from '../../components/shared/SafeScreenWrapper';
import { Heading } from '../../components/ui/Typography';
import { ChatBubble } from '../../components/chat/ChatBubble';
import { ChatInput } from '../../components/chat/ChatInput';
import { useAuth } from '../../context/AuthContext';
import client from '../../api/client'; 
import { API_ENDPOINTS } from '../../api/endpoints';
import { useChatRoom } from '../../hooks/useChatRoom';

export const ChatRoomScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { user: currentUser} = useAuth();
  
  // Get the user we are talking to from the navigation params
  const { userId: otherUserId, username: otherUsername } = route.params;

  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const loadChatData = async () => {
      if (!otherUserId) return;
      
      try {
        setLoading(true);
        
        // Use the new centralized endpoints!
        const historyUrl = API_ENDPOINTS.CHAT.HISTORY(otherUserId);
        const response = await client.get(historyUrl);
        
        setMessages(response.data);

        // Silently mark their messages as read
        const readUrl = API_ENDPOINTS.CHAT.MARK_READ(otherUserId);
        client.patch(readUrl).catch(err => console.log('Silently failed to mark read', err));

      } catch (error) {
        console.error('Failed to load chat history:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChatData();
  }, [otherUserId]);

  const { sendMessage } = useChatRoom(otherUserId, currentUser, setMessages, flatListRef);

  const myId = currentUser?._id;

  // 1. Create a quick helper to bulletproof the receiver ID extraction
  const getReceiverId = (m: any) => 
    typeof m.receiver === 'object' ? m.receiver?._id || m.receiver : m.receiver;

  // 2. Use strict String() matching, just like you did in renderItem
  const unreadMessagesCount = messages.filter(
    m => String(getReceiverId(m)) === String(myId) && m.isRead === false
  ).length;
  
  const firstUnreadMessageId = messages.find(
    m => String(getReceiverId(m)) === String(myId) && m.isRead === false
  )?._id;
  
  const renderItem = ({ item }: { item: any }) => {
    // Bulletproof ID extraction
    const senderId = typeof item.sender === 'object' ? item.sender?._id : item.sender;    
    const isOwnMessage = String(senderId) === String(myId);

    const showUnreadBadge = item._id === firstUnreadMessageId;

    return (
      <View>
        {/* THE UNREAD BADGE / DIVIDER */}
        {showUnreadBadge && (
          <View style={styles.unreadBadgeContainer}>
            <View style={styles.unreadLine} />
            <Text style={styles.unreadBadgeText}>
              {unreadMessagesCount} Unread Message{unreadMessagesCount > 1 ? 's' : ''}
            </Text>
            <View style={styles.unreadLine} />
          </View>
        )}

        {/* The actual chat bubble */}
        <ChatBubble 
          message={item.content} 
          isOwnMessage={isOwnMessage} 
        />
      </View>
    );
  };

  return (
    <SafeScreenWrapper style={{ backgroundColor: '#fff', paddingHorizontal: 0 }}>

        {/* --- HEADER --- */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Heading style={{ fontSize: 18 }}>{otherUsername}</Heading>
          <View style={{ width: 24 }} /> 
        </View>

        {/* --- MESSAGE LIST --- */}
        <KeyboardAvoidingView 
          style={styles.keyboardAvoid} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#4f46e5" />
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item, index) => item._id?.toString() || index.toString()}
              renderItem={renderItem}
              contentContainerStyle={styles.messageList}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Say hi to {otherUsername}!</Text>
                </View>
              }
            />
          )}

        {/* --- BOTTOM INPUT BAR --- */}
        <ChatInput 
          value={inputText} 
          onChangeText={setInputText} 
          onSend={() => sendMessage(inputText, setInputText)} 
          disabled={inputText.trim() === ''}
        />
      </KeyboardAvoidingView>
    </SafeScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  backButton: {
    paddingRight: 16,
    paddingVertical: 8,
  },
  keyboardAvoid: { flex: 1 },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageList: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    flexGrow: 1,
    justifyContent: 'flex-end', 
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 15,
  },
  unreadBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  unreadLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb', // Light gray line
  },
  unreadBadgeText: {
    marginHorizontal: 10,
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default ChatRoomScreen;