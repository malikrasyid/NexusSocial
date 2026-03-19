// src/components/chat/ChatInput.tsx
import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export const ChatInput = ({ value, onChangeText, onSend, disabled }: ChatInputProps) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type a message..."
        placeholderTextColor="#9ca3af"
        value={value}
        onChangeText={onChangeText}
        multiline
        maxLength={500}
      />
      <TouchableOpacity 
        style={[styles.sendButton, (!value.trim() || disabled) && styles.sendButtonDisabled]} 
        onPress={onSend}
        disabled={!value.trim() || disabled}
      >
        <Feather name="send" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  input: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    minHeight: 40,
    maxHeight: 100,
    fontSize: 15,
    color: '#1f2937',
    marginRight: 10,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2, // Aligns slightly better with multiline input
  },
  sendButtonDisabled: {
    backgroundColor: '#a5b4fc', // Lighter purple when disabled
  },
});