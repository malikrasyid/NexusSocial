import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface SocialButtonProps {
  title: string;
  icon?: React.ReactNode; // Optional icon
  onPress?: () => void;
}

export const SocialButton = ({ title, icon, onPress }: SocialButtonProps) => (
  <TouchableOpacity style={styles.socialBtn} onPress={onPress}>
    {icon}
    <Text style={styles.socialText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  socialBtn: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 55,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    gap: 10,
  },
  socialText: {
    color: '#000',
    fontWeight: '600',
  },
});