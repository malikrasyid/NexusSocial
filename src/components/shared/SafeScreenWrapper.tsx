import React from 'react';
import { 
  StatusBar, 
  StyleSheet, 
  View, 
  ViewStyle, 
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SafeScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
  statusBarColor?: 'dark-content' | 'light-content';
}

export const SafeScreenWrapper = ({ 
  children, 
  style, 
  backgroundColor = '#FFFFFF', 
  statusBarColor = 'dark-content' 
}: SafeScreenWrapperProps) => {
  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor }]}
      edges={['top', 'left', 'right']}
    >
      <StatusBar barStyle={statusBarColor} backgroundColor={backgroundColor} />
      <View style={[styles.inner, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    },
});