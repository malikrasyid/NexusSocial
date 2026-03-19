import { useEffect, MutableRefObject } from 'react';
import { FlatList } from 'react-native';
import { socket } from '../utils/socket';
import client from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';

export const useChatRoom = (
  otherUserId: string,
  currentUser: any,
  setMessages: React.Dispatch<React.SetStateAction<any[]>>,
  flatListRef: MutableRefObject<FlatList | null>
) => {

  // 1. The Real-Time Listener
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (incomingMessage: any) => {
      const senderId = typeof incomingMessage.sender === 'object' ? incomingMessage.sender._id : incomingMessage.sender;
      const isFromOtherPerson = String(senderId) === String(otherUserId);

      if (isFromOtherPerson) {
        setMessages((prev) => [...prev, incomingMessage]);
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

        // Mark read silently
        const readUrl = API_ENDPOINTS.CHAT.MARK_READ(otherUserId);
        client.patch(readUrl).catch(err => console.log('Failed to mark read', err));
      }
    };

    socket.on('newMessage', handleNewMessage);
    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [otherUserId, setMessages, flatListRef]);

  // 2. The Send Message Logic
  const sendMessage = (inputText: string, setInputText: (text: string) => void) => {
    if (inputText.trim() === '') return;

    const myId = currentUser?._id || currentUser?.id;
    const messageContent = inputText.trim();

    // Optimistic UI
    const optimisticMessage = {
      _id: Math.random().toString(),
      content: messageContent,
      sender: { _id: myId }, 
      receiver: { _id: otherUserId },
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setInputText('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    // Emit to server
    if (socket && socket.connected) {
      socket.emit('sendMessage', {
        receiverId: otherUserId,
        content: messageContent
      });
    } else {
      console.error('Socket not connected!');
    }
  };

  return { sendMessage };
};