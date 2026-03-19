import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ChatBubbleProps {
  message: string;
  isOwnMessage: boolean;
}

export const ChatBubble = ({ message, isOwnMessage }: ChatBubbleProps) => {
  return (
    <View style={[
      styles.container,
      // The magic happens here: Push to right if yours, left if theirs
      isOwnMessage ? styles.ownContainer : styles.otherContainer
    ]}>
      <View style={[
        styles.bubble,
        isOwnMessage ? styles.ownBubble : styles.otherBubble
      ]}>
        <Text style={[
          styles.text,
          isOwnMessage ? styles.ownText : styles.otherText
        ]}>
          {message}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 4,
    paddingHorizontal: 8,
  },
  // Container alignments
  ownContainer: {
    alignItems: 'flex-end',
  },
  otherContainer: {
    alignItems: 'flex-start',
  },
  
  // Base bubble shape
  bubble: {
    maxWidth: '80%',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    // Subtle shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  
  // Your message style (Nexus Indigo, Right Side Tail)
  ownBubble: {
    backgroundColor: '#4f46e5',
    borderBottomRightRadius: 4, // Creates the little tail pointing right
  },
  // Their message style (Light Gray, Left Side Tail)
  otherBubble: {
    backgroundColor: '#f3f4f6',
    borderBottomLeftRadius: 4, // Creates the little tail pointing left
  },
  
  // Base text style
  text: {
    fontSize: 15,
    lineHeight: 20,
  },
  // Your text color
  ownText: {
    color: '#ffffff',
  },
  // Their text color
  otherText: {
    color: '#1f2937',
  }
});