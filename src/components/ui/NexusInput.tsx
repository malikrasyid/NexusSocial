import React, { useState } from 'react';
import { TextInput, View, StyleSheet, TextInputProps, TouchableOpacity, Text } from 'react-native';

// We extend TextInputProps so you get all standard props like onChangeText, value, etc.
interface NexusInputProps extends TextInputProps {
  placeholder: string;
  isPassword?: boolean;
}

export const NexusInput = ({ placeholder, isPassword, ...props }: NexusInputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  return (
    <View style={styles.container}>
      <TextInput 
        placeholder={placeholder}
        placeholderTextColor="#999"
        style={styles.input}
        secureTextEntry={isPassword && !isPasswordVisible}
        {...props}
      />
      {isPassword && (
        <TouchableOpacity 
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          style={styles.toggleButton}
        >
          <Text style={styles.toggleText}>
            {isPasswordVisible ? 'Hide' : 'Show'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 20,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  toggleButton: {
    paddingLeft: 10,
  },
  toggleText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '600',
  },
});