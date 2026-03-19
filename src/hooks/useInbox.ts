import { useEffect } from 'react';
import { socket } from '../utils/socket';

export const useInbox = (
  currentUser: any,
  setInbox: React.Dispatch<React.SetStateAction<any[]>>,
  fetchInbox: () => Promise<void> // Needs this in case of a brand new chat
) => {
  
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (incomingMessage: any) => {
      const myId = currentUser?._id || currentUser?.id;
      const senderId = typeof incomingMessage.sender === 'object' ? incomingMessage.sender._id : incomingMessage.sender;
      const receiverId = typeof incomingMessage.receiver === 'object' ? incomingMessage.receiver._id : incomingMessage.receiver;

      const isOwnMessage = String(senderId) === String(myId);
      const otherUserId = isOwnMessage ? receiverId : senderId;

      setInbox((prevInbox) => {
        const chatExists = prevInbox.find(chat => String(chat.userId) === String(otherUserId));

        if (chatExists) {
          const updatedInbox = prevInbox.map(chat => {
            if (String(chat.userId) === String(otherUserId)) {
              return {
                ...chat,
                lastMessage: incomingMessage.content,
                timestamp: incomingMessage.createdAt,
                unreadCount: !isOwnMessage ? (chat.unreadCount || 0) + 1 : chat.unreadCount
              };
            }
            return chat;
          });
          return updatedInbox.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        } else {
          fetchInbox(); // Refetch if it's a new chat partner
          return prevInbox;
        }
      });
    };

    socket.on('newMessage', handleNewMessage);
    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [currentUser, setInbox, fetchInbox]);
};